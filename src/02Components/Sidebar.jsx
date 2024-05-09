
// =====Import=====//
import React from 'react'
import styled from 'styled-components'

// Material Icon Import
import PersonIcon from '@mui/icons-material/Person';
import TextsmsIcon from '@mui/icons-material/Textsms';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Navigate, json, useLocation, useNavigate } from 'react-router-dom';

// ========Css=========//
const WrapperSidebar = styled.div `
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    height:100vh;
    width:80px;  
    background-color:#2d3548;
    color:#ffffff83;
`;

const WrapperIcons = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    gap:30px;
    padding:30px 0 30px 0;
`;

const WrapperIcon = styled.div`

`;

const IconStyle = {
    fontSize:'40px',
    cursor:'pointer',
}

// =====Main==== //
const Sidebar = () => {
    const navigate = useNavigate();
    const navigatePage = (path)=>{
        navigate(path,{replace:true});
    };

    const location = useLocation();

    return (
    <WrapperSidebar>
        {/* 上部アイコン選択 */}
        <WrapperIcons>
            <WrapperIcon onClick={()=>navigatePage('/')}>
                <PersonIcon style={{fontSize:'40px',cursor:'pointer',color:location.pathname==='/'? '#ffffff':''}}/>
            </WrapperIcon>
            <WrapperIcon onClick={()=>navigatePage('/chatpage')}>
                <TextsmsIcon style={{fontSize:'40px',cursor:'pointer',color:location.pathname==='/chatpage'? '#ffffff':''}} />
            </WrapperIcon>
            <PersonAddAlt1Icon style={{fontSize:'40px',cursor:'pointer'}} />
            <AccessTimeIcon style={{fontSize:'40px',cursor:'pointer'}} />
        </WrapperIcons>

        {/* 下部アイコン選択 */}
        <WrapperIcons>
            <BrowserNotSupportedIcon style={{fontSize:'40px',cursor:'pointer'}} />
            <TurnedInNotIcon style={{fontSize:'40px',cursor:'pointer'}} />
            <MoreHorizIcon style={{fontSize:'40px',cursor:'pointer'}} />
        </WrapperIcons>
    </WrapperSidebar>
  )
}

export default Sidebar
