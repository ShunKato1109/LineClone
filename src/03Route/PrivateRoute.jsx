//=====Import=====//
import React from 'react'
import styled from 'styled-components'

// Components
import Sidebar from '../02Components/Sidebar'

// ========Css=========//
const Wrapper = styled.div`
  display:flex;
`;

const WrapperPage = styled.div`
  width:100%;
`;


const PrivateRoute = ({children}) => {
  return (
    <Wrapper>
      <Sidebar />
      <WrapperPage>
        {children}
      </WrapperPage>
    </Wrapper>
  )
}

export default PrivateRoute
