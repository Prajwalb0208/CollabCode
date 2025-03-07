import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import './index.css'
import LandingPage from './Pages/LandingPage/LandingPage'
import RoomsPage from './Pages/RoomsPage/RoomsPage'

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/rooms' element={<RoomsPage/>} />
      </Routes>
      </>
      <Footer/>
    </div>
  )
}

export default App