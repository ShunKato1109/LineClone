import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

// png
import unknown from "../../04Image/unknown.png"

// FireBase
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase';
import ChatRoomContext from '../../06Context/ChatRoomContext';


// Styled-Components
const WrapperChat = styled.div`
  display:flex;
  padding:20px;
  justify-content: ${props => props.user ? 'flex-end' : 'flex-start'};
`;

const WrapperChatMessage = styled.div`
    min-height:48px;
    min-width:40px;
    max-width:1600px;
    background-color:${props => props.user ? '#79e278' : '#c9c9c97a'};
    color:#000;
    border-radius:30px;
    padding:8px 24px;
    margin:15px;
    font-size:32px;
`;

const ChatIcondiv = styled.div`
    border-radius:50%;
    border:1px solid #ebebeb;
    height:100%;
    aspect-ratio:1/1;
    background-image:url(${props => props.$imgurl});
    background-size: cover;
    background-position: center;
`;

const ChatTimeDiv = styled.div`
  display:flex;
  align-items:flex-end;
  font-size:24px;
  color:#3f3d3dae;
  padding:8px 0;
`;


const ChatMessage = (props) => {

    const {message,user,timestamp,userId,userData,imageCache} = props;
    
    // =========React-hook========= //
    const [imgURL,setImgURL] = useState(''); //画像URLを格納
    const {AccountData} = useContext(ChatRoomContext);


  // チャットログに表示する時間の設定
  let date = new Date(timestamp);
  const chatDate = `${date.getMonth() + 1}/${date.getDate()} ${(date.getHours())}:${date.getMinutes()}`;


  // ユーザープロフィールURLの取得
  useEffect(()=>{

    const findProfileUrl = userData.find((data)=>(data.userId===userId));
    const profileUrl = findProfileUrl.profileUrl;
    const imgPath = `${profileUrl}.png`;
    if (imageCache.has(imgPath)) {
      setImgURL(imageCache.get(imgPath));
      return;
  };

    if(profileUrl){
      const path = `/${profileUrl}.png`;
      const fileRef = ref(storage,path);
      getDownloadURL(fileRef).then((url)=>{
        imageCache.set(imgPath, url);
        setImgURL(url);
      }).catch((error) => {
        imageCache.set(imgPath, unknown);
        setImgURL(unknown);
      });
    };
  },[imageCache]);



  return (
    user === AccountData.userName ? 
    <WrapperChat user={user}>
      <ChatTimeDiv>{chatDate}</ChatTimeDiv>
      <WrapperChatMessage user={user}>
          {message}
      </WrapperChatMessage>
    </WrapperChat>
    :
    <WrapperChat>
      <ChatIcondiv $imgurl={imgURL} />
      <WrapperChatMessage>
          {message}
      </WrapperChatMessage>
      <ChatTimeDiv>{chatDate}</ChatTimeDiv>
    </WrapperChat>
  )
}

export default ChatMessage
