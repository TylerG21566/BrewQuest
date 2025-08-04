import { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import BackButton from '../../components/BackButton/BackButton';
import { Link } from 'react-router-dom';
import './HostLobby.css';

interface Player {
  playername: string;
  score: number;
}
interface props {
  quizId: number;
  room: string;
  quizTitle: string;
  livequizhttp: string;
  client: W3CWebSocket;
  players: Player[];
  updatePlayers: () => void;
  endQuiz: () => void;
  startQuiz: () => void;
  connected: boolean;
  setConnected: (b: boolean) => void;
}

const HostLobby = ({
  room,
  client,
  players,
  updatePlayers,
  endQuiz,
  startQuiz,
  setConnected,
}: props) => {
  // Used to remove a player from the lobby
  const kickPlayer = (player: string) => {
    client.send(
      JSON.stringify({
        type: 'HostKicksPlayer',
        data: { room_id: room, playername: player },
      })
    );
    console.log('kickPlayer(): kicking Player' + player);
  };
  // end

  // Defines how to deal with messages on the web socket.
  useEffect(() => {
    console.log('Use effect client.on etc');
    client.onmessage = async (m: { data: unknown }) => {
      if (typeof m.data === 'string') {
        const dataFromServer = JSON.parse(m.data);
        console.log(
          'on message this is the data from the server',
          dataFromServer
        );

        if (dataFromServer) {
          console.log(dataFromServer.action);
          switch (dataFromServer.action) {
            case 'PlayerJoinedLobby':
            case 'PlayerLeftLobby':
              updatePlayers();
              break;
          }
        }
      }
    };

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      console.log('client', client);
      client.send(
        JSON.stringify({
          type: 'HostJoinedLobby',
          data: { room_id: room },
        })
      );
      setConnected(true);
    };
    client.onclose = () => {
      console.log('endQuiz(): ');
      endQuiz();
    };
    client.onerror = (error) => {
      console.log('Connection Error', error);
    };
  }, []);
  // End

  // DO NOT TOUCH EXCEPT ADDING CSS
  const makeGrid = (playernames: string[]) => {
    //This code defines a function makeGrid that takes an input array and creates a
    //grid by grouping the elements of the array in rows of three. The function
    //returns an array of React component elements representing the grid.
    const grid = [];
    let count = 0;
    console.log('this is player array: ', playernames);
    //the input
    // this is the grid formed by having the input array in groups of 3 in a row
    for (let i = 0; i < playernames.length; i = i + 3) {
      grid.push(
        <div key={'player row' + (count / 3).toString()} className='row'>
          {playernames.slice(i, i + 3).map((name: string, id: number) => (
            <div
              className='text-center col-md-4 text-light player-div'
              key={id + count}
              onClick={() => {
                kickPlayer(name);
              }}
            >
              <h4>{name}</h4>
            </div>
          ))}
        </div>
      );
      count = count + 3;
    }
    return grid;
  };

  return (
    <>
      <div className='container-fluid'>
        
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
     
        <Link to='../QuizList'><BackButton
          onClick={() => {
            endQuiz();
          }}
          className='text'
        ></BackButton></Link>
        <h1 className='text-light'>Connected to Lobby : {room}</h1>
        <h2 className='text-light'>Player Count: {players.length}</h2>


        <div className='container player-grid'>
          {makeGrid(players.map((n: Player) => n.playername))}
        </div>
        <div className='d-grid gap-2 col-4 mx-auto fixed-bottom'>
          <button
            onClick={() => {
              // Hand me down function that actually sets round end time then starts round.
              startQuiz();
            }}
            disabled={players.length == 0}
            className=' btn btn-primary btn-lg mb-5 '
            type='button'
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
};

export default HostLobby;
