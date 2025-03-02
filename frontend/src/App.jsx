import React from 'react'
import './index.css'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Session from './Pages/Session/Session'
import MyAccount from './Pages/MyAccount/MyAccount'
import Footer from './Components/Footer/Footer'

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/session' element={<Session/>}/>
        <Route path='/account' element={<MyAccount/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App