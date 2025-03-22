import React from 'react';

const backgroundColors = {
    warning: 'rgb(245, 224, 149)',
    success: 'rgb(193, 246, 86)',
    info: 'rgb(108, 173, 244)',
    danger: 'rgb(250, 115, 105)'
}

const infoStyler = (info) => {
    return {
        position: 'absolute',
        minWidth: '500px',
        zIndex: 2,
        left: '50%',
        transform: 'translate(-50%, -30%)',
        padding: '1em 3em',
        boxShadow: '0 0 1em rgba(0, 0, 0, 0.5',
        background: backgroundColors[info.type]
    }
}

const Info = ({ info, id }) => 
    <div style={infoStyler(info)} id={id}>
          {info.message}
    </div>


export default Info
