

import React, { useState } from 'react';
import './Input.css';

import { Email as EmailIcon, Visibility as EyeIcon, VisibilityOff as EyeOffIcon, Key as KeyIcon, Person as PersonIcon } from "@mui/icons-material"

const Input = ({type, placeholder, value, setValue, top}) => {
  const [show, setShow] = useState(false)
  return (
    <>
        {placeholder === 'username' && <PersonIcon className='Input--icon' id='Input-username-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'email' && <EmailIcon className='Input--icon' id='Input-email-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'password' &&  <KeyIcon className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'password' && 
          (show ?
            <EyeIcon onClick={() => setShow(!show)} className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, right: '80px'}}/> :
            <EyeOffIcon onClick={() => setShow(!show)} className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, right: '80px'}}/> 
          )
        }
        <label htmlFor={placeholder}></label>
        <input id={`Input-${placeholder}`} name={placeholder} className='Input' type={type !== 'password' ? type : show ? 'text': 'password'} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)}/>
    </>
    )
}

export default Input
