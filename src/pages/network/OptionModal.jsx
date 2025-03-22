import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Modal from '../../components/modal/Modal';

import { Options, JoinRoom, Playing, Catalog } from './modals';

export default () => 
    <Modal
      homePage = 'network'
      ModalOutlet = {
        <Routes>
          <Route path="options" element={<Options />} />
          <Route path="play-with-friends">
            <Route path="" element={<JoinRoom mode="friends" />}/>
            <Route path="game-catalog" element={<Catalog mode="friends"/>} />
            {/* <Route path="waiting-room" element={<WaitingRoom mode="friends" />} /> */}
            <Route path="playing" element={<Playing />} />
          </Route>
          <Route path="random-game-playing" element={<Playing />} />
        </Routes>
      }
    />