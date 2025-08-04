import BackButton from '../components/BackButton/BackButton';
import { Link, useNavigate } from 'react-router-dom';

import { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import ip from '../info';

// then only allow the player to join the lobby and join the game if the name is unqiue
// allow for

const GamePin = () => {
  // holds the state for the input boxes
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');

  // for navigating programmatically
  const navigate = useNavigate();

  /**
   * Handles the click event of the back button.
   * Routes user to the landing page.
   * @return {void} This function does not return a value.
   */
  const handleBackButtonClick = () => {
    console.log('Going Back');
    navigate('/');
  };

  /**
   * Handles the form submission event.
   * checks if a valid game pin and username have been entered
   * then tries to connect user to the game by outing them to the game lobby
   * @param {any} e - The event object.
   * @return {void} This function does not return anything.
   */
  const handleSubmit = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (name !== '' && room !== '') {
      axios
        .post('http://' + ip + ':8000/livequiz/joinGame/', {
          pin: room,
          playername: name,
        })
        .then((response) => {
          if (response.data.status === 'success') {
            console.log(response.data.players);

            navigate('/game', {
              state: {
                name: name,
                room: room,
              },
            });
          } else {
            console.error('error, game not found');
            alert('error, game not found');
          }
        })
        .catch((error) => {
          console.log('Error: ' + error);
        });
    }
  };

  /**
   * Set the name based on the provided parameter.
   *
   * @param {any} e - the input event
   * @return {void}
   */
  const nameSet = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  /**
   * A function that sets the room value based on the input event.
   *
   * @param {any} e - the input event
   * @return {void}
   */
  const roomSet = (e: ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  return (
    <>
      <Link to='../'>
        <BackButton onClick={handleBackButtonClick} className='text' />
      </Link>
      <div>
        <h1 className='text display-1'>Game Pin</h1>
      </div>
      <div className='container gamepin'>
        <form>
          <div className='mb-3'>
            <input
              className='form-control'
              placeholder='Insert game pin here'
              id='input-txtbox'
              onChange={roomSet}
            />
          </div>
          <div className='mb-3'>
            <input
              className='form-control'
              placeholder='enter username'
              id='input-txtbox'
              onChange={nameSet}
            />
          </div>

          <div className='d-grid gap-2 col-6 mx-auto'>
            <button
              type='button'
              className='btn btn-primary btn-lg'
              id='confirm-btn'
              onClick={handleSubmit}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default GamePin;
