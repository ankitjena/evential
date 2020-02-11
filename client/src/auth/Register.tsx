import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, ResponseTypes } from './actions';
import Navbar from '../components/Navbar';
import { Link, RouteComponentProps } from 'react-router-dom';
import { isComplete } from '../helpers/common';
import { AppState } from '../helpers/rootReducer';

function validateEmail(email: string) {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone: string) {
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(String(phone).toLowerCase());
}

type ErrorTextProps = {
  text: string;
};

export const ErrorText: FC<ErrorTextProps> = ({ text }: ErrorTextProps) => {
  return <p className="text-red-500 text-sm italic">{text}</p>;
};

export const RegisterComponent: FC<RouteComponentProps> = ({
  history
}: RouteComponentProps) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: AppState) => state.AuthReducer);

  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: ''
  });
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [userDetailsComplete, setUserDetailsComplete] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userExistsError, setUserExistsError] = useState(false);

  useEffect(() => {
    if (!validateEmail(userDetails.email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [userDetails.email]);

  useEffect(() => {
    if (!validatePhone(userDetails.phone)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  }, [userDetails.phone]);

  useEffect(() => {
    setUserDetailsComplete(isComplete(userDetails));
  }, [userDetails]);

  useEffect(() => {
    if (authState.isAuthenticated === true) {
      history.push('/');
    }
    if (authState.authResponse === ResponseTypes.USER_EXISTS) {
      setUserExistsError(true);
    }
  }, [authState.isAuthenticated, authState.authResponse]);

  return (
    <div className="w-full max-w-md mx-auto my-16">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="input"
            id="name"
            type="text"
            onChange={e =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            value={userDetails.name}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="input"
            id="username"
            type="text"
            onChange={e =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            value={userDetails.username}
          />
          {userExistsError && (
            <ErrorText text="User already exists. Please log in" />
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email ID
          </label>
          <input
            className={
              userDetails.email && emailError ? 'input-error' : 'input'
            }
            id="email"
            type="text"
            onChange={e =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            value={userDetails.email}
          />
          {userDetails.email && emailError && (
            <ErrorText text="Please enter a valid email" />
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone number
          </label>
          <input
            className={
              userDetails.phone && phoneError ? 'input-error' : 'input'
            }
            id="phone"
            type="text"
            onChange={e =>
              setUserDetails({ ...userDetails, phone: e.target.value })
            }
            value={userDetails.phone}
          />
          {userDetails.phone && phoneError && (
            <ErrorText text="Enter a valid 10 digit phone number" />
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="input"
            id="password"
            type="password"
            onChange={e =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
            value={userDetails.password}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            className="input"
            id="password"
            type="password"
            onChange={e => {
              setConfirmPassword(e.target.value);
              if (userDetails.password !== e.target.value) {
                setPasswordConfirmed(false);
              } else {
                setPasswordConfirmed(true);
              }
            }}
          />
          {confirmPassword && !passwordConfirmed && (
            <ErrorText text="Passwords do not match" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className={
              emailError || phoneError || !userDetailsComplete
                ? 'btn btn-disabled'
                : 'btn'
            }
            type="button"
            onClick={() => dispatch(register(userDetails))}
          >
            Register
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/auth/login"
          >
            Registered ? Then Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

const Register: FC<RouteComponentProps> = props => {
  return (
    <>
      <Navbar />
      <RegisterComponent {...props} />
    </>
  );
};

export default Register;
