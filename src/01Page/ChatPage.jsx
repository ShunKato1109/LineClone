import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components';
import ChatSidebar from '../02Components/ChatSidebar/ChatSidebar';
import ChatMain from '../02Components/ChatMain/ChatMain';


const WrapperPage = styled.div`
  display:flex;
`;

const ChatPage = (props) => {

  const {setChatRoom} = props;

  return (
    <WrapperPage>
      {/* サイドバー */}
        <ChatSidebar/>
        {/* 共通サイドバー */}

        {/* チャット画面サイドバー */}

      {/* メイン画面 */}
      <ChatMain />
        {/* チャット内容 */}

        {/* 入力 */}
    </WrapperPage>
  )
}

export default ChatPage
