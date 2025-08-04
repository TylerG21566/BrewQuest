import axios from 'axios';
import ip from '../info';
let refresh = false;
axios.interceptors.response.use(
  // if successful, then continue with the response
  (resp) => resp,
  // if there was an error outside 2xx, then perform the following
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${localStorage.getItem('access_token')}`;
      const response = await axios.post(
        'http://' + ip + ':8000/token/refresh/',
        { refresh: localStorage.getItem('refresh_token') },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        axios.defaults.headers.common['Authorization'] = `Bearer 
       ${response.data['access']}`;
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // if successfully, updated the tokens then returns
        // return axios(error.config);
      }
    }
    refresh = false;
    return error;
  }
);
