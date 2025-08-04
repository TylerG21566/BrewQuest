import BackButton from '../components/BackButton/BackButton';
import Dialog from '../components/Dialog/Dialog';
import { MouseEvent, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import ip from '../info';

interface Decoded extends JwtPayload {
  user_id: number;
}

const EditProfile = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  const confirm = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      // grab user_id from decoding the cookies
      const token = localStorage.getItem('access_token')!;
      const decoded: Decoded = jwtDecode(token);
      const id = decoded.user_id;
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${localStorage.getItem('access_token')}`;
      await axios
        .put('http://' + ip + ':8000/' + `api/delete_user/${id}`)
        .then(async () => {
          alert('Successfully deleted account');
        })
        .catch(async (err) => {
          console.log(err);
        });
      localStorage.clear();
      axios.defaults.headers.common['Authorization'] = null;
      window.location.href = '/host/login';

      // update message saying credentials changed
    } catch (error) {
      console.log(error);
      window.alert('Failed to delete account');
    }
    setShowAccountDialog(false);
  };

  const cancel = () => {
    setShowAccountDialog(false);
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      // grab user_id from decoding the cookies
      const token = localStorage.getItem('access_token')!;
      const decoded: Decoded = jwtDecode(token);
      const id = decoded.user_id;
      let detailsChanged = false;
      let usernameIsInUse = false;
      // updating each individually incase there is a blank field
      if (username == '' && email == '' && newPassword == '') {
        alert('Please fill in the appropiate fields');
      }

      if (!(username == '')) {
        // make an update call to the API URL for username
        await axios
          .put('http://' + ip + ':8000/' + `api/change_username/${id}`, {
            username: username,
          })
          .then(async (response) => {
            // alert('Username Successfully Changed');
            // console.log(localStorage.getItem('access_token')!);
            if (response['data']['Response'] === 'Username already exists') {
              alert('Username already exists');
              usernameIsInUse = true;
            } else {
              alert('Username Successfully Changed');
              console.log(localStorage.getItem('access_token')!);
              detailsChanged = true;
            }
          })
          .catch(async (err) => {
            console.log(err);
          });
      }
      if (!(email == '') && !usernameIsInUse) {
        // make an update call to the API URL for email
        await axios
          .put('http://' + ip + ':8000/' + `api/change_email/${id}`, {
            email: email,
          })
          .then(async () => {
            alert('Email Successfully Changed');
            detailsChanged = true;
          })
          .catch(async (err) => {
            console.log(err);
          });
      }
      if (!(newPassword == '') && !usernameIsInUse) {
        // check if matches old password
        // check if newPassword and confirmNewPassword matches
        // update password
        let passwordmatches = false;
        await axios
          .post('http://' + ip + ':8000/' + `api/check_password/${id}`, {
            currentPassword: currentPassword,
          })
          .then(async (response) => {
            if (response.data['Response'] === 'Password matches') {
              passwordmatches = true;
            }
          })
          .catch(async (err) => {
            console.log(err);
          });
        if (passwordmatches) {
          if (newPassword === confirmNewPassword) {
            await axios
              .put('http://' + ip + ':8000/' + `api/change_password/${id}`, {
                password: newPassword,
              })
              .then(async () => {
                alert('Password Successfully Changed');
                detailsChanged = true;
              })
              .catch(async (err) => {
                console.log(err);
              });
          } else {
            alert('Confirm password does not match new password');
          }
        } else {
          alert('Current password was not correct');
        }
      }
      if (detailsChanged) {
        localStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
        window.location.href = '/host/login';
      }
      // update message saying credentials changed
    } catch (error) {
      console.log(error);
      window.alert('Invalid Credentials');
    }
  };

  return (
    <div>
      <Link to='/host/QuizList'>
        <BackButton className='text' />
      </Link>
      <div>
        <Dialog
          show={showAccountDialog}
          title='Deleting Account'
          description='Are you sure you want to permanently delete your account?'
          confirm={confirm}
          cancel={cancel}
        />
      </div>
      <div>
        <h1 className='text display-1'>Edit Profile</h1>
      </div>
      <div className='container login-form'>
        <form>
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
              Current Password
            </label>
            <input
              type='password'
              className='form-control'
              id='input_password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='input_password' className='form-label text'>
              New Password
            </label>
            <input
              type='password'
              className='form-control'
              id='input_password'
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='input_password' className='form-label text'>
              Confirm New Password
            </label>
            <input
              type='password'
              className='form-control'
              id='input_password'
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <div className='d-grid gap-2 col-6 mx-auto'>
            <button
              className='btn btn-primary login-btn'
              type='button'
              onClick={handleSubmit}
            >
              Update details
            </button>
          </div>
        </form>
        <div className='btn-container center-text'>
          <button
            className='dlt_btn'
            onClick={() => {
              setShowAccountDialog(true);
            }}
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
