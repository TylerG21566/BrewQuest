import { useEffect, useState } from 'react';
import HostLobby from './HostLobby';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ip from '../../info';
import MarkingPage from './MarkingPage';


interface Player {
  playername: string;
  score: number;
}
// HostGame.tsx this is the container that will render
// all the pages shown to the host during game play
const HostGame = () => {
  // Page Management + Game State Management
  enum HOST_PAGE {
    CreatingRoom,
    Lobby,
    LeaderBoard,
    Marking,
  }
  const [currentPage, setCurrentPage] = useState(HOST_PAGE.CreatingRoom);
  const [roundIndex, setRoundIndex] = useState(0);
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [errorMessage, setErrorMessage] = useState('Creating Room');
  // End

  // The next 4 lines gets all the props, has to be done this way because of react routing
  const location = useLocation();
  const quizId = location.state.id;
  const room = location.state.room;
  const quizTitle = location.state.title;
  // -----------------------------------

  // For routing programmatically
  const navigate = useNavigate();
  // End

  // Address used for making http requests to the backend
  const livequizhttp = 'http://' + ip + ':8000/livequiz/';
  // End

  // Initializing websocket
  const client = new W3CWebSocket('ws://' + ip + ':8000/room/' + room + '/');
  // End

  // Creates a room, the backend will delete any existing rooms by the same name.
  const createNewRoom = () => {
    const payload = {
      quiz_id: quizId,
      room_name: quizTitle,
      pin: quizTitle.replace(/ /g, '_') + '_' + quizId.toString(),
    };

    axios
      .post(livequizhttp + 'createRoom/', payload)
      .then((response) => {
        console.log('createNewRoom response: ');
        console.log(response);
        if (response.data.status == 'failed')
          setErrorMessage(
            'Room creation failed, please refresh your browser to try again.'
          );
        else {
          setErrorMessage('SUCCESS');
          setCurrentPage(HOST_PAGE.Lobby);
        }
      })
      .catch((error) => {
        setErrorMessage(
          'Room creation failed, please refresh your browser to try again.'
        );
        console.error('Error: ' + error);
      });
  };
  // End

  // Deletes the room. To be used on game close, or suchlike
  const deleteRoom = () => {
    const payload = {
      quiz_id: quizId,
      room_name: quizTitle,
      pin: quizTitle.replace(/ /g, '_') + '_' + quizId.toString(),
    };

    axios
      .post(livequizhttp + 'deleteRoom/', payload)
      .then((response) => {
        if (response.data.status === 'success') {
          client.send(
            JSON.stringify({
              type: 'LobbyClosedByHost',
              data: { room_id: room },
            })
          );
        }

        console.log('deleteRoom() response: ');
        console.log(response.data);
      })
      .catch((error) => {
        console.error('error: ' + error);
      });
  };
  // End

  // Actions to be completed on page initialization
  // Creates Room
  useEffect(() => {
    createNewRoom();
  }, []);

  // Deletes room when tab closed
  useEffect(
    () =>
      window.addEventListener('beforeunload', async (e) => {
        e.preventDefault();
        e.returnValue = '';
        deleteRoom();
      }),
    []
  );
  // End

  // Gets a list of all the players and their scores
  const getPlayerStates = () => {
    const payload = { pin: room };

    axios
      .post(livequizhttp + 'getLobbyPlayerStates/', payload)
      .then((response) => {
        console.log(' getPlayerStates response: ');
        console.log(response);
        if (response.data.status === 'success') {
          setPlayers(response.data.playerScores);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // End

  // Used to trigger quiz start for clients
  const tellClientStartQuiz = async () => {
    console.log('client.readyState ', client.readyState);
    if (roundIndex >= 0) {
      // Stops it from running on start up
      console.log('tellClientStartQuiz():');
      console.log('client ', client);
      console.log('client ready state ', client.readyState);
      if (!connected) {
        console.log('Not connected');
      } else {
        client.send(
          JSON.stringify({
            type: 'HostStartGame',
            data: { room_id: room },
          })
        );
      }
    }
  };
  // End

  // Tell client next round
  const tellClientNextRound = async () => {
    client.send(
      JSON.stringify({
        type: 'HostStartsNextRound',
        data: { room_id: room },
      })
    );
  };

  // Used to set round end time, if start of quiz will tell clients to start
  const updateRoundData = () => {
    console.log('updateRoundData(): ');
    const payload = {
      pin: quizTitle.replace(/ /g, '_') + '_' + quizId.toString(),
      roundIndex: roundIndex,
    };
    axios
      .post(livequizhttp + 'updateRoundData/', payload)
      .then((response) => {
        console.log(response);
        if (players.length > 0 && roundIndex == 0) {
          tellClientStartQuiz();
          setCurrentPage(HOST_PAGE.Marking);
          setRoundIndex(roundIndex + 1);
        } else if (roundIndex > 0) {
          tellClientNextRound();
          setRoundIndex(roundIndex + 1);
        }
      })
      .catch((error) => {
        console.error('Error: ' + error);
      });
  };
  // End

  // Sets page depending on game state.
  const Page = () => {
    switch (currentPage) {
      case HOST_PAGE.CreatingRoom:
        return (
          <>
            <h1 className='text display-1'>{errorMessage}</h1>
          </>
        );
      case HOST_PAGE.Lobby:
        return (
          <HostLobby
            quizId={quizId}
            room={room}
            quizTitle={quizTitle}
            livequizhttp={livequizhttp}
            client={client}
            players={players}
            updatePlayers={getPlayerStates}
            endQuiz={() => {
              deleteRoom();
              navigate('/host/QuizList');
            }}
            startQuiz={updateRoundData}
            connected={connected}
            setConnected={setConnected}
          />
        );
      case HOST_PAGE.Marking:
        return (
          <MarkingPage
            deleteRoom={deleteRoom}
            quizId={quizId}
            room={room}
            quizTitle={quizTitle}
            client={client}
            livequizhttp={livequizhttp}
            startNextRound={updateRoundData}
            roundIndex={roundIndex}
          />
        );
    }
  };

  return <>{Page()}</>;
};

export default HostGame;
