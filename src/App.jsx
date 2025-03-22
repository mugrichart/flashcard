import './App.css';
import Home from './pages/home/Home';
import Personal from './pages/personal/Personal';
import Network from './pages/network/Network';
import Header from './pages/header/Header';
import More from './pages/external/More';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import axios from 'axios';
import API_BASE_URL from '../serverConfig'
const token = localStorage.getItem('token');
const user = localStorage.getItem('user')
import { useState, useEffect } from 'react';


function App() {
  const [userAuthed, setUserAuthed] = useState((token && user) ? true : false); 
  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE_URL}/protected-route`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        const { user } = res.data
        if (user) localStorage.setItem('user')
        }
      )
      .catch((error) => {
        console.log('error: ', error)
        if (error.message !== 'Network Error') setUserAuthed(false);
        if (error.message === 'Invalid or expired token') localStorage.removeItem('user')
      });

    }
    

  }, [token]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/*' element={<Home userAuthed={userAuthed} setUserAuthed={setUserAuthed}/>} />
          <Route path="/portal/*" element={<ProtectedRoute element={Portal} userAuthed={userAuthed} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

const Portal = () => {

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='personal/*' element={<Personal />} />
          <Route path='more/*' element={<More />} />
          <Route path='network/*' element={<Network />} />
        </Routes>
      </main>
      <footer>
      </footer>
    </>
  );
}
