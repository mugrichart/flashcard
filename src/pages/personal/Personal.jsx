
import Home from "./Home";
import OptionModal from "./modals/OptionModal";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Personal = () => 

    <Routes>
      <Route path='' element={<Home />} />
      <Route path='*' element={<OptionModal />} />
    </Routes>


export default Personal;

  