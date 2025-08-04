import BackButton from '../../components/BackButton/BackButton';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./GameLobby.css"

// This is the client Lobby

interface Player {
  playername: string;
  score: number;
}
interface props {
  client: W3CWebSocket;
  connected: boolean;
  setConnected: (b: boolean) => void;
  livequizhttp: string;
  room: string;
  name: string;
  triggerGameStart: () => void;
}
const GameLobby = ({
  client,
  connected,
  setConnected,
  livequizhttp,
  triggerGameStart,
  room,
  name,
}: props) => {
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);

  const getPlayerStates = () => {
    const payload = { pin: room, playername: name };

    axios
      .post(livequizhttp + 'getLobbyPlayerStates/', payload)
      .then((response) => {
        console.log(' this is the response: ', response);
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

  const roomClosed = () => {
    navigate('/');
  };

  /**
   * Remove a player from the lobby and update the state accordingly.
   */
  const removePlayer = async () => {
    console.log('WebSocket Client Closed');
    await axios
      .post(livequizhttp + 'playerLeftLobby/', { pin: room, playername: name })
      .then((response) => {
        console.log(response.data);

        if (response.data.status === 'success') {
          setConnected(false);
        }

        // synchrounous function btw
        client.send(
          JSON.stringify({
            type: 'PlayerLeftLobby',
            data: { room_id: room, playername: name },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    /**
     * Handles the incoming message from the client.
     *
     * @param {any} m - The message received from the client. (not sure of specific type)
     */

    client.onmessage = async (m: { data: unknown }) => {
      if (typeof m.data === 'string') {
        const dataFromServer = JSON.parse(m.data);
        console.log('on message this is the data from the server', m);

        if (dataFromServer) {
          switch (dataFromServer.action) {
            case 'PlayerJoinedLobby': {
              console.log('PlayerJoinedLobby');
              getPlayerStates();
              break;
            }
            case 'PlayerLeftLobby': {
              console.log('PlayerLeftLobby');
              getPlayerStates();
              break;
            }
            case 'LobbyClosedByHost': {
              console.log('LobbyClosedByHost');
              roomClosed();
              break;
            }
            case 'HostStartGame': {
              console.log('HostStartGame');
              triggerGameStart();
              break;
            }
            case 'HostKicksPlayer': {
              console.log('HostKicksPlayer');
              if (dataFromServer.playername == name) {
                console.log('You have been kicked');
                removePlayer();
              } else {
                console.log('Someone has be kicked');
                getPlayerStates();
              }
              break;
            }
          }
        }
      }
    };

    /**
     * Handles the error event for the client.
     *
     * @param {error} error - the error object
     */
    client.onerror = (error) => {
      console.log('Connection Error', error);
    };

    /**
     * Initializes the WebSocket client and
     * sends a message to the server when the connection is opened.
     */
    client.onopen = () => {
      console.log('WebSocket Client Connected');

      client.send(
        // synchrounous function btw
        JSON.stringify({
          type: 'PlayerJoinedLobby',
          data: { room_id: room, playername: name },
        })
      );
      setConnected(true);
    };

    /**
     * The onclose event handler for the client.
     */
    client.onclose = () => {
      removePlayer();
    };
  }, []);

  const playerLeftLobby = async () => {
    console.log('PlayerLeftLobby(): ');
    await axios
      .post(livequizhttp + 'playerLeftLobby/', {
        pin: room,
        playername: name,
      })
      .then((response) => {
        console.log('response.data: ');
        console.log(response.data);

        if (response.data.status === 'success') {
          setConnected(false);
        }
        // synchrounous function btw
        client.send(
          JSON.stringify({
            type: 'PlayerLeftLobby',
            data: { room_id: room, playername: name },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // code that runs when tab is closed
  // this will just remove the player from the game
  // updating the database and letting all the other players know someone has left
  useEffect(
    () =>
      window.addEventListener('beforeunload', async (e) => {
        e.preventDefault();
        e.returnValue = '';
        playerLeftLobby();
      }),
    []
  );

  // client.close();
  // ^ actually IMPORTANT as used to MANUALLY close the websocket after connection
  // use return () => {client.close() } in useEffect to close it

  /**
   * Creates a grid based on the input array.
   *
   * @param  arr - the input array
   * @return {ReactComponentElement[]} the grid created from the input array
   */
  const makeGrid = (arr: string[]) => {
    //This code defines a function makeGrid that takes an input array and creates a
    //grid by grouping the elements of the array in rows of three. The function
    //returns an array of React component elements representing the grid.
    const grid = [];
    let count = 0;
    console.log('this is player array: ', arr);
    //the input
    // this is the grid formed by having the input array in groups of 3 in a row
    for (let i = 0; i < arr.length; i = i + 3) {
      grid.push(
        <div key={'player row' + (count / 3).toString()} className='row'>
          {arr.slice(i, i + 3).map((n: string, id: number) => (
            <h4 className='text-center col-md-4 text-light' key={id + count}>
              {n}
            </h4>
          ))}
        </div>
      );
      count = count + 3;
    }
    return grid;
  };

  return (
    <>
      {
        // If connected, render the lobby, otherwise render a message
        connected ? (
          <div className='container-fluid'>
           
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
          
            <Link to='/'><BackButton
              onClick={() => {
                removePlayer();
              }}
              className='text'
            ></BackButton>
            </Link>
            <h1 className='text-light'>Connected to Lobby : {room}</h1>
            <h2 className='text-light'>Player Count: {players.length}</h2>


            <div className='container player-grid'>
              {makeGrid(players.map((n: Player) => n.playername))}
            </div>
          </div>
        ) : (
          <h1>Not Connected</h1>
        )
      }
    </>
  );
};

export default GameLobby;
