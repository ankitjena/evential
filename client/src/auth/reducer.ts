import {
  LoginAction,
  AuthActionTypes,
  RegisterAction,
  ResponseTypes,
  CheckAction,
  LogoutAction
} from './actions';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserDetails;
  authResponse: ResponseTypes;
}

export interface UserDetails {
  _id: string;
  username: string;
  name: string;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    _id: '',
    username: '',
    name: ''
  },
  authResponse: ResponseTypes.UNAUTHENTICATED
};

type AuthReducerActions =
  | LoginAction
  | RegisterAction
  | CheckAction
  | LogoutAction;

export default function(
  state: AuthState = initialState,
  action: AuthReducerActions
) {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...action.data };
    case AuthActionTypes.REGISTER:
      return { ...action.data };
    case AuthActionTypes.CHECK:
      return { ...action.data };
    case AuthActionTypes.LOGOUT:
      return { ...action.data };
    default:
      return state;
  }
}
