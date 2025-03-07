import React from 'react'
import './Navbar.css'
const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='logo'>
            <span className='logo-left'>&lt;  &gt; </span><span>CollabCode</span>
        </div>
        <ul className="navbar-menu">
            <li>Home</li>
            <li>Rooms</li>
            <li>Docs</li>
        </ul>
        <div className="navbar-right">
            <button>→] Login</button>            
            <button>New Room</button>            
        </div>
    </div>
  )
}

export default Navbar