import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import "./ChatLog.css";

// png画像データ
import unkown from "../../04Image/unknown.png"

// FireBase
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {addDoc, collection,getDocs,where,query, orderBy} from "firebase/firestore";
import {db} from '../../firebase';
import { storage } from '../../firebase';
import ChatRoomContext from '../../06Context/ChatRoomContext';



// CSS
const WrapperChatLog = styled.div`
    display:flex;
    align-items:center;
    height:90px;
    padding:10px 15px;
    gap:15px;
    z-index:100;
    background-color:#fff;

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

const ChatRightBox = styled.div`
    display:flex;
    height:100%;
    flex-direction:column;
    align-items:flex-start;
`;

const ChatTitlediv = styled.div`
    display:flex;
    justify-content:space-between;
    height:30%;
    width:250px;
    font-weight:800;
`;

const ChatSummarydiv = styled.div`
    /* display:flex; */
    height:50%;
    color:#8f8c8cdd;
    font-weight:500;
    width:200px;
    overflow:hidden;
    display: -webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
`;

const DateText = styled.div`
    color:#8f8c8cdd;
    font-weight:200;
`;

const imageCache = new Map();

// =========MainComponent============ //
const ChatLog = (props) => {
  
  const {roomData,userData} = props;
  // =========React-hook========= //
  const { chatRoom, setChatRoom,AccountData } = useContext(ChatRoomContext);
  const [imgURL,setImgURL] = useState(''); //画像URLを格納
  const [chatName,setChatName] = useState('');
  const [chatLastMessage,setChatLastMessage] = useState('');
  const [chatDate,setChatDate] = useState('')

  const [chatInfo, setChatInfo] = useState({ name: '', imgUrl: '' });

  // =========function========= //

  // チャットログに表示する時間の設定
  let date = new Date(roomData.lastMessage.timestamp);
  // const chatDate = `${date.getMonth() + 1}/${date.getDate()}`;

  // 個人チャット・グループチャットでの分岐処理
  useEffect(()=>{
    
    const updateChatLogInf = async()=>{

      let chatName = '';
      let imgUrl = '';


      // 個人チャットの場合
      if(roomData.participants.length===2){
        const chatUserID = roomData.participants.find(participant=>participant !== AccountData.userId);
        const chatUserName = userData.find(user => user.userId === chatUserID);

        if(chatUserName){
          chatName = chatUserName.userName;
          imgUrl = chatUserName.profileUrl;
        }
      }else{
      // グループチャットの場合
          chatName = roomData.chatRoomName;
          imgUrl = roomData.profileUrl;
      };



      const imgPath = `${imgUrl}.png`;
      // キャッシュに既にパスが存在する場合はキャッシュから画像を表示する
      if (imageCache.has(imgPath)) {
        // setChatName(chatName);
        // setImgURL(imageCache.get(imgPath));
        setChatInfo({ name: chatName, imgUrl: imageCache.get(imgPath) });
              // チャットログに表示する時間の設定
        setChatDate(`${date.getMonth() + 1}/${date.getDate()}`);
        setChatLastMessage(roomData.lastMessage.text)
        return;
    };

      // FireStore画像の取得
      if(imgUrl){
        let path = `/${imgUrl}.png`;
        const fileRef = ref(storage,path);
        getDownloadURL(fileRef).then((url)=>{
          imageCache.set(imgPath, url);
          // setChatName(chatName);
          // setImgURL(url);
          setChatInfo({ name: chatName, imgUrl: url });
          setChatDate(`${date.getMonth() + 1}/${date.getDate()}`);
          setChatLastMessage(roomData.lastMessage.text)
        })
        .catch((error) => {
          // setChatName(chatName);
          // setImgURL(unkown);
          // let unknownImg = unkown;
          setChatInfo({ name: chatName, imgUrl: unkown });
          setChatDate(`${date.getMonth() + 1}/${date.getDate()}`);
          setChatLastMessage(roomData.lastMessage.text)
        });
      };

    };

    updateChatLogInf();
  },[roomData,userData]);

  
  // サイドバークリック時にチャットの履歴を取得
  const getChatMessage = ()=>{
    // 1.ChatRoomContextを通じて指定したルームデータを更新する
    setChatRoom(roomData.chatRoomId);
    // 2.次回ページ遷移時の初期画面としてLocalStorageにルームデータを格納
  };

  return (
    <WrapperChatLog className='main' onClick={()=>{getChatMessage()}}>
      <ChatIcondiv $imgurl={chatInfo.imgUrl} />
      <ChatRightBox>
        <ChatTitlediv>
            {/* <div>{chatName}</div> */}
            <div>{chatInfo.name}</div>
            <DateText>{chatDate}</DateText>
        </ChatTitlediv>
        <ChatSummarydiv>
          {/* {roomData.lastMessage.text} */}
          {chatLastMessage}
        </ChatSummarydiv>
      </ChatRightBox>
    </WrapperChatLog>
  )
}

export default ChatLog
