

import React from 'react';
import './More.css'

import Pdf from './pdf/Pdf';
import Temp from './temporary/Temp';
import Yapping from './yapping/Yapping';

import { Link, BrowserRouter as Router, Routes, Route  } from 'react-router-dom';

const More = () => {
  return (
    <div className='more'>
      <Routes>
        <Route path='' element={<MoreHome />} />
        <Route path='pdf' element ={<Pdf />} />
        <Route path='story-time' element ={<Yapping />} />
        <Route path='temporary/:idType/:id' element = {<Temp />} />
        <Route path='extension' />
        <Route path='mobile' />
      </Routes>
    </div>
  )
}

export default More

const contents = [
  'You want to create flash cards from the book you are reading, an article or any of your downloaded pdf files, you are on the right page.',
  'You are on a website reading something and suddenly come accross something you would want in your flashcards. Check out our chrome extension that helps with that.',
  "You are on a website in your mobile phone's browser and still want to add to your flashcards anything your come accross.",
  "You want to create flash cards from the book you are reading, an article or any of your downloaded pdf files, you are on the right page."
]

const MoreHome = () => (
  <>
    <article>
        <p>
          {contents[0]}
        </p>
        <button><Link to='pdf'>Click here</Link></button>
      </article>
      
      <article>
        <p>
          {contents[1]}
        </p>
        <button>Click here</button>
      </article>
      
      <article>
        <p>
          {contents[2]}
        </p>
        <button>Click here</button>
      </article>
      
      <article>
        <p>
          {contents[3]}
        </p>
        <button>Click here</button>
      </article>
  </>
)