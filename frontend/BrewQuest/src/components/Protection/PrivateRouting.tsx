import { Navigate } from 'react-router-dom';
import React from 'react';

interface props {
  children: JSX.Element;
}

// Wrap this around any pages to only allow logged in users to access it
// {children} is the destructoring of the page passed in.
const PrivateRoute: React.FC<props> = ({ children }) => {
  const [user]: string =
    localStorage.getItem('access_token') == null
      ? ''
      : localStorage.getItem('access_token')!;
  // If user is null, then we navigate to the login, else we go to the page that was wrapped around this.
  return user == '' ? <Navigate to='/' /> : children;
};

export default PrivateRoute;
