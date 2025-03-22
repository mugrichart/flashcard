
import Home from "./Home";
import OptionModal from "./OptionModal";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Network = () => 

    <Routes>
      <Route path='' element={<Home />} />
      <Route path='*' element={<OptionModal />} />
    </Routes>


export default Network;

  