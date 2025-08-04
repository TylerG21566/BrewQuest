import GameLobby from './GameLobby';
import { useEffect, useState } from 'react';
import QuestionPageClient from './QuestionPageClient';
import { useLocation } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import ip from '../../info';
import axios from 'axios';
import { Leaderboard } from '..';

// ClientGame.tsx this is the container that will render all the pages / components
// shown to the clients during game play
const ClientGame = () => {
  // Page Management + Game State Management
  enum GAME_PAGE {
    Lobby,
    Quiz,
    LeaderBoard,
  }
  const [gameOver, setGameOver] = useState(false);
  const [currentPage, setCurrentPage] = useState(GAME_PAGE.Lobby);
  const [quizId, setQuizId] = useState(-1);
  const [roundIds, setRoundIds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  // End

  // Getting Props
  const location = useLocation();
  const room = location.state.room;
  const name = location.state.name;
  // End

  // WebSocket State Management + initializing
  const [connected, setConnected] = useState(false);
  const client = new W3CWebSocket('ws://' + ip + ':8000/room/' + room + '/');
  // End

  // Http address definition
  const livequizhttp = 'http://' + ip + ':8000/livequiz/';
  // End

  // Gets the quiz ID and round ids from the server
  const getQuizInfo = () => {
    console.log('getQuizId(): ');
    axios
      .post(livequizhttp + 'getQuizInfo/', { pin: room, playername: name })
      .then((response) => {
        console.log(response.data);

        if (response.data.status === 'success') {
          setQuizId(response.data.id);
          setRoundIds(response.data.round_ids);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // End

  // Gets quiz info on start up
  useEffect(() => {
    getQuizInfo();
  }, []);
  // End

  // When each GAME_PAGE is opened,
  // the web sockets onMessage functions are redefined to suit that pages needs

  const Page = () => {
    switch (currentPage) {
      case GAME_PAGE.Lobby:
        return (
          <GameLobby
            client={client}
            connected={connected}
            setConnected={setConnected}
            livequizhttp={livequizhttp}
            triggerGameStart={() => {
              setCurrentPage(GAME_PAGE.Quiz);
            }}
            room={room}
            name={name}
          />
        );
      case GAME_PAGE.Quiz:
        return (
          <QuestionPageClient
            quizId={quizId}
            roundIndex={roundIndex}
            roundIds={roundIds}
            livequizhttp={livequizhttp}
            pin={room}
            timesUp={() => {
              if (roundIndex + 1 == roundIds.length) {
                setGameOver(true);
              } else {
                setRoundIndex(roundIndex + 1);
              }
              setCurrentPage(GAME_PAGE.LeaderBoard);
            }}
            playername={name}
            client={client}
            setCurrentPage = {setCurrentPage}
          />
        );
      case GAME_PAGE.LeaderBoard:
        return (
          <Leaderboard
            gameOver={gameOver}
            livequizhttp={livequizhttp}
            pin={room}
            client={client}
            name={name}
            nextRound={() => {
              setCurrentPage(GAME_PAGE.Quiz);
            }}
          />
        );
    }
  };

  return <>{Page()}</>;
};

export default ClientGame;
