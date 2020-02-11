import React, { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './actions';
import Navbar from '../components/Navbar';
import { Link, RouteComponentProps } from 'react-router-dom';
import { isComplete } from '../helpers/common';
import { useSelector } from 'react-redux';
import { AppState } from '../helpers/rootReducer';
import { ResponseTypes } from './actions';
import { ErrorText } from './Register';

export const LoginComponent: FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: AppState) => state.AuthReducer);
  const [userLoginDetails, setUserLoginDetails] = useState({
    username: '',
    password: ''
  });
  const [userDetailsComplete, setUserDetailsComplete] = useState(false);

  const [responseType, setResponseType] = useState(
    ResponseTypes.UNAUTHENTICATED
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    setUserDetailsComplete(isComplete(userLoginDetails));
  }, [userLoginDetails]);

  useEffect(() => {
    setResponseType(authState.authResponse);
    if (authState.authResponse !== ResponseTypes.AUTHENTICATED) {
      setError(true);
    } else {
      props.history.push('/');
    }
  }, [authState.authResponse]);

  return (
    <div className="w-full max-w-md mx-auto my-16">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className={
              error && responseType === ResponseTypes.USER_NOT_FOUND
                ? 'input-error'
                : 'input'
            }
            id="username"
            type="text"
            onChange={e =>
              setUserLoginDetails({
                ...userLoginDetails,
                username: e.target.value
              })
            }
          />
          {error && responseType === ResponseTypes.USER_NOT_FOUND && (
            <ErrorText text="User does not exist" />
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={
              error && responseType === ResponseTypes.INCORRECT_PASSWORD
                ? 'input-error'
                : 'input'
            }
            id="password"
            type="password"
            onChange={e =>
              setUserLoginDetails({
                ...userLoginDetails,
                password: e.target.value
              })
            }
          />
          {error && responseType === ResponseTypes.INCORRECT_PASSWORD && (
            <ErrorText text="Incorrect Password" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className={!userDetailsComplete ? 'btn btn-disabled' : 'btn'}
            type="button"
            onClick={() => dispatch(login(userLoginDetails))}
          >
            Sign In
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="#"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

const Login: FC<RouteComponentProps> = props => {
  return (
    <>
      <Navbar />
      <LoginComponent {...props} />
    </>
  );
};

export default Login;
