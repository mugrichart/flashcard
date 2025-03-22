import './Modal.css'

import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import { Clear as Close } from '@mui/icons-material';

export default ({ homePage, ModalOutlet }) =>{
    const navigate = useNavigate()
    return (
    <div className="modal">
        {useLocation().pathname.split(`/${homePage}`)[1] && <Close className="cancel" onClick={() => navigate(`../../${homePage}`)} />}
        { ModalOutlet }
      </div>
    )
}