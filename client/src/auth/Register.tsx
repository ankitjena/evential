import React from 'react'
import { useDispatch } from 'react-redux'
import { register } from './actions'

const Register = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(Register())}>
        Register
      </button>
    </div>
  )
}

export default Register