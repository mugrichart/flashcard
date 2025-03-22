
import React from 'react';
import Auth from '../Auth';

const Login = ({ setUserAuthed}) => {
  return (
    <Auth page={'login'} setUserAuthed={setUserAuthed} />
  )
}

export default Login
