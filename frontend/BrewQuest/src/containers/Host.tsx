import { Route, Routes } from 'react-router-dom';
import { Login, Logout, QuizEdit, QuizListPage, Register } from '.';
import HostGame from './HostGame/HostGame';
const Host = () => {
  // This file provides the routing for all the host's views
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/QuizList' element={<QuizListPage />} />
        <Route path='/edit' element={<QuizEdit />} />
        <Route path='/register' element={<Register />} />
        <Route path='/game' element={<HostGame />} />
      </Routes>
    </>
  );
};
export default Host;
