import axios from 'axios';
import ip from '../info';
import { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    (async () => {
      try {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${localStorage.getItem('access_token')}`;
        await axios.post(
          'http://' + ip + ':8000/api/logout/',
          {
            refresh_token: localStorage.getItem('refresh_token'),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        localStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
        window.location.href = '/host/login';
      } catch (e) {
        console.log('logout not working', e);
      }
    })();
  }, []);

  return <></>;
};
export default Logout;
