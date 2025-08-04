import BackButton from '../components/BackButton/BackButton';
import { MouseEvent, useContext, useState } from 'react';
import axios from 'axios';
import ip from '../info';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setInitialToken } = useContext(AuthContext);

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    try {
      const { data } = await axios.post('http://' + ip + ':8000/token/', user, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setInitialToken(data.access);
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data['access']}`;
      window.location.href = '/host/QuizList';
    } catch (error) {
      console.log(error);
      window.alert('Invalid Credentials');
      axios.defaults.headers.common['Authorization'] = null;
    }
  };

  return (
    <>
      <Link to='/'>
        <BackButton className='text' />
      </Link>
      <div>
        <h1 className='text display-1'>BrewQuest</h1>
      </div>
      <div className='container login-form'>
        <form>
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

          <div className='d-grid gap-2 col-6 mx-auto'>
            <button
              className='btn btn-primary login-btn'
              type='button'
              onClick={handleSubmit}
            >
              Login
            </button>
            <Link to='/host/register' className='text-center'>
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
