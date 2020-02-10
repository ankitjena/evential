import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './actions';
import Navbar from '../common/Navbar';

export const LoginComponent: FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(login())}>Login</button>
    </div>
  );
};

const Login: FC = () => {
  return (
    <>
      <Navbar />
      <LoginComponent />
    </>
  );
};

export default Login;
