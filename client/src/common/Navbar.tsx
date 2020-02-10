import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../helpers/rootReducer'
import '../styles/tailwind.css'
import './Navbar.css'

const Navbar: React.FC = () => {
  const authState = useSelector((state: AppState) => state.AuthReducer)
  console.log(authState)
  return (
    <header className="lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2">
      <div className="flex-1 flex justify-between items-center">
        <a href="#">Evential</a>
      </div>
        <label htmlFor="menu-toggle" className="cursor-pointer lg:hidden block">
          <svg className="fill-current text-gray-900" xmlns="https://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>

        <input type="checkbox" className="hidden" id="menu-toggle"/>

        <div className="hidden lg:flex lg:items-center lg:w-auto w-full" id="menu">
          <nav>
            <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
              <li>
                <a href="#" className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400">Features</a>
              </li>
              <li>
                <a href="#" className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400">Pricing</a>
              </li>
              <li>
                <a href="#" className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400">Documentation</a>
              </li>
              <li>
                <a href="#" className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400">Support</a>
              </li>
            </ul>
          </nav>
        </div> 
    </header>
  )
}

export default Navbar