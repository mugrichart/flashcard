import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Options, CardAdd, CardAddManual, CardAddAuto, CardLearn, NewDeck, GuidedLearning, Quiz } from "."

import Modal from '../../../components/modal/Modal';

export default () => 
    <Modal
      homePage = 'personal'
      ModalOutlet = {
        <Routes>
          <Route path="options" element={<Options />} />
          <Route path="adding" element={<CardAdd />} />
          <Route path="adding/manual" element={<CardAddManual />} />
          <Route path="adding/auto" element={<CardAddAuto />} />
          <Route path="new-deck" element={<NewDeck />} />
          <Route path="learning" element={<CardLearn />} />
          <Route path="guided-learning" element={<GuidedLearning />} />
          <Route path="quiz" element={<Quiz />} />
        </Routes>
      }
    />