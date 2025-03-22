

import React, { useState } from 'react';
import './Header.css';

import {useNavigate} from 'react-router-dom';
import { Menu, Clear as MenuCancel} from '@mui/icons-material';

import Logo from '../home/Logo'

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  const [menuShow, setMenuShow] = useState(false)

  return (
    <header>
        <div className='header-logo' style={{cursor: 'pointer'}} onClick={() => navigate('/portal/personal')}><Logo /></div>
        <nav>
            <ul className={`nav-right ${menuShow && 'show'}`}>
              <li onClick={() => navigate('/portal/network/options')}>Multiplayer</li>
              <li>Add</li>
              <li onClick={() => navigate('/portal/more')}>More</li>
            </ul>
            <span style={{cursor: 'pointer'}} className='menu' onClick={() => setMenuShow(!menuShow)}>{menuShow ? <MenuCancel /> :  <Menu />}</span>
            <div className="nav-profile">
              <span>{user.username}</span>
              <span></span>
            </div>
            
        </nav>
        
    </header>
  )
}

export default Header
