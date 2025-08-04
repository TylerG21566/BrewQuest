import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton/BackButton';
import { MouseEvent, useState } from 'react';
import axios from 'axios';
import ip from '../info';
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState('');

  const alert = () => {
    return (
      <div className='alert alert-primary' role='alert'>
        {alertText}
      </div>
    );
  };

  const tryRegister = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAlertVisible(false);
    if (confirmPassword !== password) {
      setAlertVisible(true);
      setAlertText('Passwords do not match');
    } else {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      axios
        .post('http://' + ip + ':8000/api/register/', user)
        .then((response) => {
          console.log(response);
          if (response.data.status === 'failed') {
            setAlertText(response.data.message);
          } else {
            setAlertText('Success, account created!');
          }
          setAlertVisible(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Link to='/host/login'>
        <BackButton className='text' />
      </Link>
      <div>
        <h1 className='text display-1'>BrewQuest</h1>
      </div>
      <div className='container login-form'>
        <form>
          {alertVisible && alert()}
          <div className='mb-3'>
            <label htmlFor='username_input' className='form-label text'>
              Username
            </label>
            <input
              type='username'
              className='form-control'
              id='username_input'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='email_input' className='form-label text'>
              Email
            </label>
            <input
              type='email'
              className='form-control'
              id='email_input'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='input_password' className='form-label text'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='input_password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='input_password2' className='form-label text'>
              Confirm Password
            </label>
            <input
              type='password'
              className='form-control'
              id='input_password2'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className='d-grid gap-2 col-6 mx-auto'>
            <button
              className='btn btn-primary login-btn'
              type='button'
              onClick={tryRegister}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Register;
