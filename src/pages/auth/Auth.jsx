import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

import Input from './input/Input';

import Spinner from 'react-spinner-material';

import { register, login } from '../../api/http';

import { useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';

const Auth = ({ page, setUserAuthed }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      if (page === 'sign-up') {
        await register({ username, email, password });
        navigate('..');
      } else {
        const response = await login({ email, password });
        localStorage.setItem('token', response.data.token);
        dispatch(setUser(response.data.user))
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUserAuthed(true)
        navigate('/portal/personal');
      }
    } catch (error) {
      setLoading(false)
      console.error('Authentication error', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='Auth'>
      <h1>{page === 'login' ? 'Login' : 'Sign up'}</h1>
      {page === 'sign-up' && (
        <Input placeholder={'username'} type={'text'} value={username} setValue={setUsername} top={80} />
      )}
      <Input placeholder={'email'} type={'email'} value={email} setValue={setEmail} top={80 + 60 * (page === 'sign-up')} />
      <Input placeholder={'password'} type={'password'} value={password} setValue={setPassword} top={140 + 65 * (page === 'sign-up')} />
      <div>
        <input type="checkbox" />
        <label htmlFor="remember me"> Remember me</label>
      </div>
      {page === 'login' && <div className='forgot-password'><a href=''>Forgot password?</a></div>}
      <div className='submit-div'>
        {
          loading ? <Spinner radius={50} color="#345C70" stroke={2} visible={true} /> :
          <input type="submit" value={page === 'login' ? 'Sign in' : 'Create an account'} />
        }
      </div>
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
