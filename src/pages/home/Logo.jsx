
import React from 'react';
import './Logo.css'
// import { IoFlashSharp } from "react-icons/io5";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

const Logo = () => {
  return (
    <div className='Logo'>
      Fla<ElectricBoltIcon className={`energy`}/>h
    </div>
  )
}

export default Logo
