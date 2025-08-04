import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

interface props {
  gameOver: boolean;
  livequizhttp: string;
  pin: string;
  client: W3CWebSocket;
  name: string;
  nextRound: () => void;
}
interface Player {
  playername: string;
  score: number;
}
function Leaderboard({
  gameOver,
  livequizhttp,
  pin,
  client,
  name,
  nextRound,
}: props) {
  const [players, setPlayers] = useState<Player[]>([]);

  const navigate = useNavigate();

  // For if the player disconnects, or leaves
  const removePlayer = async () => {
    console.log('WebSocket Client Closed');
    await axios
      .post(livequizhttp + 'playerLeftLobby/', { pin: pin, playername: name })
      .then((response) => {
        console.log(response.data);

        if (response.data.status === 'success') {
          //setConnected(false);
        }

        // synchrounous function btw
        client.send(
          JSON.stringify({
            type: 'PlayerLeftLobby',
            data: { room_id: pin, playername: name },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // End

  // Gets players in order
  const getLeaderboard = () => {
    const payload = { pin: pin };
    console.log('getLeaderboard(): ');

    axios
      .post(livequizhttp + 'getLeaderboard/', payload)
      .then((response) => {
        console.log(' this is the response: ', response);
        if (response.data.status === 'success') {
          setPlayers(response.data.players);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // End

  // Get leaderboard on start up
  useEffect(() => {
    getLeaderboard();
  }, []);
  // End

  // Sets new websocket protocols on initialization
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
            case 'HostMarksAnswer': {
              console.log('HostMarksAnswer');
              getLeaderboard();
              // Triggered while host is marking questions and scores change
              break;
            }
            case 'HostStartsNextRound': {
              console.log('HostStartsNextRound');
              nextRound();
              break;
            }
            case 'MarkingFinished': {
              console.log('MarkingFinished');

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
    };

    /**
     * The onclose event handler for the client.
     */
    client.onclose = () => {
      removePlayer();
    };
  }, []);
  // End

  // Describes what to do if player closes tab
  // code that runs when tab is closed
  // this will just remove the player from the game
  // updating the database and letting all the other players know someone has left
  useEffect(
    () =>
      window.addEventListener('beforeunload', async (e) => {
        e.preventDefault();
        e.returnValue = '';
        removePlayer();
      }),
    []
  );
  // End
  return (
    <>
      <div className='text-center'>
        <h1 className='display-1 text'>Leaderboard</h1>
      </div>

      <div className='container player-bubble-container'>
        {players.map((player, index) => (
          <div
            key={index + '_' + player}
            className='d-flex align-items-center text player-bubble'
          >
            <div className='p-2  player-bubble-index d-flex align-items-center'>
              <div>
                <h4>{index + 1}.</h4>
              </div>
            </div>
            <div className='p-2 flex-grow-1 player-bubble-name'>
              <div className='d-flex justify-content-between'>
                <div className='p-2'>
                  <h4>{player.playername}</h4>
                </div>
                <div className='p-2'>
                  <h4>{player.score}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='button-box-container'>
        <div className='d-grid gap-2'>
          <button
            type='button'
            className='btn btn-block btn-lg'
            disabled={!gameOver}
            onClick={() => {
              navigate('/');
            }}
          >
            {gameOver ? (
              <h4 className='text'>Return To Menu</h4>
            ) : (
              <h4 className='text'>Waiting for host</h4>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
