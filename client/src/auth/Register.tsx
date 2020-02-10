import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { register } from './actions';
import Navbar from '../common/Navbar';

export const RegisterComponent: FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(register())}>Register</button>
    </div>
  );
};

const Register: FC = () => {
  return (
    <>
      <Navbar />
      <RegisterComponent />
    </>
  );
};

export default Register;
