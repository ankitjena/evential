import { AuthState, initialState } from './reducer';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import axios, { AxiosResponse } from 'axios';

export enum AuthActionTypes {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  CHECK = 'CHECK',
  LOGOUT = 'LOGOUT'
}

export enum ResponseTypes {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_EXISTS = 'USER_EXISTS',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATED = 'AUTHENTICATED'
}

export interface LoginAction {
  type: AuthActionTypes.LOGIN;
  data: AuthState;
}

export interface LoginDetails {
  username: string;
  password: string;
}

export interface RegisterDetails {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterAction {
  type: AuthActionTypes.REGISTER;
  data: AuthState;
}

export interface CheckAction {
  type: AuthActionTypes.CHECK;
  data: AuthState;
}

export interface LogoutAction {
  type: AuthActionTypes.LOGOUT;
  data: AuthState;
}

export function login(
  data: LoginDetails
): ThunkAction<Promise<LoginAction>, AuthState, undefined, LoginAction> {
  return async (dispatch: ThunkDispatch<AuthState, undefined, LoginAction>) => {
    let res: AxiosResponse;
    try {
      res = await axios.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      if (err.response.status === 401) {
        return dispatch({
          type: AuthActionTypes.LOGIN,
          data: {
            ...initialState,
            authResponse: ResponseTypes.INCORRECT_PASSWORD
          }
        });
      }
      if (err.response.status === 404) {
        return dispatch({
          type: AuthActionTypes.LOGIN,
          data: {
            ...initialState,
            authResponse: ResponseTypes.USER_NOT_FOUND
          }
        });
      }
    }

    return dispatch({
      type: AuthActionTypes.LOGIN,
      data: {
        isAuthenticated: true,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user: res!.data.user,
        authResponse: ResponseTypes.AUTHENTICATED
      }
    });
  };
}

export function register(
  data: RegisterDetails
): ThunkAction<Promise<RegisterAction>, AuthState, undefined, RegisterAction> {
  return async (
    dispatch: ThunkDispatch<AuthState, undefined, RegisterAction>
  ) => {
    const res = await axios.post('/auth/register', data);

    if (res.status === 204) {
      return dispatch({
        type: AuthActionTypes.REGISTER,
        data: {
          ...initialState,
          authResponse: ResponseTypes.USER_EXISTS
        }
      });
    }
    localStorage.setItem('token', res.data.token);
    return dispatch({
      type: AuthActionTypes.REGISTER,
      data: {
        isAuthenticated: true,
        user: res.data.user,
        authResponse: ResponseTypes.AUTHENTICATED
      }
    });
  };
}

export function check(): ThunkAction<
  Promise<CheckAction>,
  AuthState,
  undefined,
  CheckAction
> {
  return async (dispatch: ThunkDispatch<AuthState, undefined, CheckAction>) => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/auth/check', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(res);

    return dispatch({
      type: AuthActionTypes.CHECK,
      data: {
        isAuthenticated: true,
        user: res.data.user,
        authResponse: ResponseTypes.AUTHENTICATED
      }
    });
  };
}

export function logout(): ThunkAction<
  Promise<LogoutAction>,
  AuthState,
  undefined,
  LogoutAction
> {
  return async (
    dispatch: ThunkDispatch<AuthState, undefined, LogoutAction>
  ) => {
    localStorage.removeItem('token');
    return dispatch({
      type: AuthActionTypes.LOGOUT,
      data: {
        ...initialState
      }
    });
  };
}
