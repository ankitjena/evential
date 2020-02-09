import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../helpers/rootReducer'

const Navbar: React.FC = () => {
  const authState = useSelector((state: AppState) => state.AuthReducer)
  console.log(authState)
  return (
    <h1>Navbar</h1>
  )
}

export default Navbar