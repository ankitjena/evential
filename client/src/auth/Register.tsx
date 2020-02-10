import React from 'react'
import { useDispatch } from 'react-redux'
import { register } from './actions'
import Navbar from '../common/Navbar'

export const RegisterComponent = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(Register())}>
        Register
      </button>
    </div>
  )
}

const Register = () => {
  return (
    <>
      <Navbar />
      <RegisterComponent />
    </>
  )
}

export default Register