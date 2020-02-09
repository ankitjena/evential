import { AuthState } from './reducer'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import axios from 'axios'

export enum AuthActionTypes {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

export interface LoginAction {
  type: AuthActionTypes.LOGIN;
  data: AuthState
}

export interface RegisterAction {
  type: AuthActionTypes.REGISTER;
  data: AuthState
}

export function login(): ThunkAction<
  Promise<LoginAction>,
  AuthState,
  undefined,
  LoginAction
> {
  return async (dispatch: ThunkDispatch<AuthState, undefined, LoginAction>) => {
    const res = await axios.post('/auth/login', {
      username: 'ankitjena',
      password: 'evential'
    })

    console.log("works")
    console.log(res)

    return dispatch({
      type: AuthActionTypes.LOGIN,
      data: {
        isAuthenticated: true,
        user: res.data.user
      }
    })
  }
}

export function register(): ThunkAction<
  Promise<RegisterAction>,
  AuthState,
  undefined,
  RegisterAction
> {
  return async (dispatch: ThunkDispatch<AuthState, undefined, RegisterAction>) => {
    const res = await axios.post('/auth/register', {
      username: "ankitjena",
      email: "ankitjena13@gmail.com",
      name: "Ankit Jena",
      phone: "8598033713",
      password: "evential"
    })

    return dispatch({
      type: AuthActionTypes.REGISTER,
      data: {
        isAuthenticated: true,
        user: res.data.user
      }
    })
  }
}