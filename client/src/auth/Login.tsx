import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from './actions'
import Navbar from '../common/Navbar'

export const LoginComponent = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(login())}>
        Login
      </button>
    </div>
  )
}

const Login = () => {
  return (
    <>
      <Navbar />
      <LoginComponent />
    </>
  )
}

export default Login