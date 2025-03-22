

import React from 'react';
import './Home.css';

import Login from '../auth/login/Login';
import Register from '../auth/register/Register';
import {Navigate, Routes, Route,  } from 'react-router-dom';


import Logo from './Logo';

const Home = ({ userAuthed, setUserAuthed}) => {

  return userAuthed ? 
    <Navigate to= "../portal/personal"/> :
    <div className='Home'>
      <div className='intro side'>
        <Logo />
        <p>Get your flashcards ready in no time</p>
      </div>

      <div className='auth'>
        <Routes>
          <Route path='' element={<Login setUserAuthed={setUserAuthed} />}/>
          <Route path='register' element={<Register />}/>
        </Routes>
      </div>
      
    </div>
}

export default Home
