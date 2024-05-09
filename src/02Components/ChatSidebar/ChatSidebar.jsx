import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

// FireStore
import {addDoc, collection,getDocs,where,query, orderBy, onSnapshot} from "firebase/firestore";
import {db} from '../../firebase';

// Css
import "./ChatSidebar.css";

// MaterialUIアイコン
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ChatLog from './ChatLog';
import ChatRoomContext from '../../06Context/ChatRoomContext';

const WrapperChatSidebar = styled.div`
    display:flex;
    flex-direction:column;
    width:400px;
    height:100vh;
    border-right:1px solid #8f8c8c6c;
`;

// 検索ボックス用CSS
const WrapperSearchBox = styled.div`
    display:flex;
    color:#535252a9;
    height:80px;
    align-items:center;
    justify-content:space-between;
    border-bottom:1px solid #8f8c8c6c;
    padding:0px 10px;
    /* gap:3px; */
`;

const SearchInp = styled.input`
    border:none;
    outline:#fff;
    width:80%;
    height:78px;
    font-size:16px;
`;

const WrapperChatlogs = styled.div`
  flex-grow:1;
  overflow-y:scroll;
`;

// component(検索ボックス)
const SearchBox = ()=>{
    const [searchText,setSearchText] = useState(''); //検索ボタンクリック時にテキスト保管

    return(
        <WrapperSearchBox>
            <SearchIcon style={{cursor:'pointer'}}/>
            <SearchInp type='text' placeholder='トークルームとメッセージ検索'/>
            <MenuIcon style={{cursor:'pointer'}}/>
        </WrapperSearchBox>
    )
};


const ChatSidebar = (props) => {

  // =====Reakt-Hooks===== //
  const [getRoomData,setGetRoomData] = useState([]);
  const [getUserData,setGetUserData] = useState([]);
  const {AccountData} = useContext(ChatRoomContext);

  // FireStoreからのデータ取得
  useEffect(()=>{

      // チャットルーム情報のonSnap接続(ユーザー情報に絞って抽出)
      let getChatRoomData=[];
      const roomRef = collection(db,'chatRoom');
      // クエリの作成
      const q = query(roomRef,
          where('participants','array-contains',AccountData.userId),
          orderBy('lastMessage.timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q,(snapshot)=>{
        const rooms = snapshot.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }));
        setGetRoomData(rooms);
        // const firstViewChatRoom = JSON.stringify(rooms[0]);
        // localStorage.setItem('LineClone',firstViewChatRoom);
      });



      getDocs(q).then((snapShot)=>{
          snapShot.docs.map((doc)=>getChatRoomData.push({...doc.data()}));
          setGetRoomData(getChatRoomData);
      });

      // ユーザー情報の取得
      let getUserData = [];
      const userData = collection(db,'users');
      getDocs(userData).then((snapShot)=>{
        snapShot.docs.map((doc)=>getUserData.push({...doc.data()}));
        setGetUserData(getUserData);
      });

      return ()=>unsubscribe();

  },[]);

  return (
    <WrapperChatSidebar>
      {/* 検索 */}
        <SearchBox />

      {/* 履歴 */}
      <WrapperChatlogs className='wrapperChatlogs'>
        {getRoomData.map((room,index)=>(
          <ChatLog
            key={`Sidebar-${room.chatRoomId}`}
            roomData={room}
            userData={getUserData}
          />
        ))}
      </WrapperChatlogs>
    </WrapperChatSidebar>
  )
}

export default ChatSidebar
