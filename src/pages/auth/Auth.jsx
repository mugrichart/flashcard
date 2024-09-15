import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from './input/Input';

import { useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';

const Auth = ({ page }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (page === 'sign-up') {
        await axios.post(`${baseUrl}/api/v1/auth/register`, { username, email, password });
        navigate('..');
      } else {
        const response = await axios.post(`${baseUrl}/api/v1/auth/login`, { email, password });
        localStorage.setItem('token', response.data.token);
        dispatch(setUser(response.data.user))
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/portal/personal');
      }
    } catch (error) {
      console.error('Authentication error', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='Auth'>
      <h1>{page === 'login' ? 'Login' : 'Sign up'}</h1>
      {page === 'sign-up' && (
        <Input placeholder={'username'} type={'text'} value={username} setValue={setUsername} top={86} />
      )}
      <Input placeholder={'email'} type={'email'} value={email} setValue={setEmail} top={86 + 61 * (page === 'sign-up')} />
      <Input placeholder={'password'} type={'password'} value={password} setValue={setPassword} top={147 + 65 * (page === 'sign-up')} />
      <div>
        <input type="checkbox" />
        <label htmlFor="remember me"> Remember me</label>
      </div>
      {page === 'login' && <div className='forgot-password'><a href=''>Forgot password?</a></div>}
      <div className='submit-div'><input type="submit" value={page === 'login' ? 'Sign in' : 'Create an account'} /></div>
      <div className='or'>or</div>
      <div className='google'>{page === 'login' ? 'Sign in with google' : 'Create an account with google'}</div>
      <div className='sign-up'>
        {page === 'login' ? "Don't have an account" : 'Already have an account'}?
        <Link to={page === 'login' ? '/register' : '..'}>
          {page === 'login' ? 'Sign up' : 'Sign in'}
        </Link>
      </div>
    </form>
  );
};

export default Auth;