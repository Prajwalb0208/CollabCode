import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'

const Footer = () => {
    return (
        <div className='footer'>
            <img src={assets.logo} alt="" className='logo' />
            <div className="footer-right">
                All rights reserved
            </div>
        </div>
    )
}

export default Footer