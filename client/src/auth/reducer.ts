import { LoginAction, AuthActionTypes, RegisterAction } from './actions'

export interface AuthState {
  isAuthenticated: boolean;
  user : UserDetails;
}

export interface UserDetails {
  id: string;
  username: string;
  name: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: '',
    username: '',
    name: ''
  }
}

type AuthReducerActions = LoginAction | RegisterAction

export default function(state: AuthState = initialState, action: AuthReducerActions) {
  switch(action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, auth: action.data}
    case AuthActionTypes.REGISTER:
      return { ...state, auth: action.data }
    default:
      return state
  }
}