import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import {v4 as uuidv4} from 'uuid';

// Components
import ChatMessage from './ChatMessage';
import unknown from '../../04Image/unknown.png'

// Firestore
import {db, storage} from '../../firebase';
import {addDoc, collection,getDocs,where,query, orderBy,doc,onSnapshot,updateDoc} from "firebase/firestore";

// Css
import './ChatMain.css';

// MaterialUIアイコン(ヘッダー)
import LockIcon from '@mui/icons-material/Lock';
import VolumeDownIcon from '@mui/icons-material/VolumeDown'; //音声あり
import VolumeOffIcon from '@mui/icons-material/VolumeOff'; //ミュート
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
// MaterialUIアイコン(チャット入力画面)
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import CallIcon from '@mui/icons-material/Call';
import ChatRoomContext from '../../06Context/ChatRoomContext';
import { useMemo } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';




// チャットメインCSS
const ChatMaindiv = styled.div`
    display:flex;
    height:100vh;
    flex-direction:column;
    flex-grow:1;
`;

const Contentsdiv = styled.div`
    display:flex;
    gap:15px;
    align-items:center;
`;

// チャットヘッダーCSS
const ChatHeaderdiv = styled.div`
    display:flex;
    min-height:81px; //サイドバー検索用ヘッダー高さに合わせる(height+border)
    background-color:#eef1f6;
    justify-content:space-between;
    align-items:center;
    padding:0 20px;
`;

const IconsStyle = {
    fontSize:'32px',
    color:'#535252a9',
    cursor:'pointer',
};

const Icondiv = styled.div`
    font-size:32px;
    color:#535252a9;
    cursor:pointer;
    :hover{
        color:#2c2c2cc7;
    }
`;

// チャット入力画面
const ChatInput = styled.div`
    display:flex;
    flex-direction:column;
    border-top:1px solid #8f8c8c6c;
    margin-top:auto;
    align-items:center;
    padding:10px 30px;
`;

const ChatInputIconsdiv = styled.div`
    display:flex;
    width:100%;
    justify-content:space-between;
    align-items:center;
    margin:10px 0;
`;

const ChatInputArea = styled.textarea`
    width: 100%;
    border: none;
    resize:vertical;
    height:100%;
    min-height: 80px;
    max-height: 200px;
    vertical-align: top;
    font-size:32px;
    outline:none;
    padding:10px 0 0 0;
    
`;

// MessageThread用のスタイル
const WrpperMessageThread = styled.div`
    display:flex;
    flex-direction:column;
    flex-grow:1;
    overflow-y:scroll;

    ::-webkit-scrollbar{
    display:none;
  }
`;

const imageCache = new Map();
// ======メインコンポーネント====== //
const ChatMain = () => {
    // =====Local Storage===== //
    const getFirstViewRoom = localStorage.getItem(`LineClone`);
    const firstViewRoom = JSON.parse(getFirstViewRoom);

    // =====Reakt-Hooks===== //
    const {register,reset} = useForm();
    const {chatRoom,AccountData} = useContext(ChatRoomContext);
    const [getChatMessage,setGetChatMessage] = useState([]);
    const [getUserData,setGetUserData] = useState([]);
    const [getRoomData,setGetRoomData] = useState([]);
    const [chatName,setChatName] = useState(firstViewRoom.chatName);



    // uuidの設定
    const uniqueID = uuidv4();

    // FireStoreからデータの取得
    useEffect(()=>{

        // ユーザー情報の取得
        let getUserData = [];
        const userData = collection(db,'users');
        getDocs(userData).then((snapShot)=>{
        snapShot.docs.map((doc)=>getUserData.push({...doc.data()}));
        setGetUserData(getUserData);
        });

        // チャットルーム情報の取得
      let getChatRoomData=[];
      const roomData = collection(db,'chatRoom');
        getDocs(roomData).then((snapShot)=>{
        snapShot.docs.map((doc)=>getChatRoomData.push({...doc.data()}));
        });
        setGetRoomData(getChatRoomData);

    },[]);

    // 画像キャッシュの作成
    useEffect(()=>{

        const preloadImages = async()=>{
            if (!getUserData) return;
            const promises = getUserData.map((user)=>{
                const imgPath = `${user.profileUrl}.png`;
                const fileRef = ref(storage,`/${user.profileUrl}.png`);
                return getDownloadURL(fileRef).then(url => imageCache.set(imgPath,url))
                .catch(()=>imageCache.set(imgPath,unknown));
            });
    
            // 全ての画像URL取得処理が完了するまで待機
            await Promise.all(promises);
        };
        preloadImages();
    
    },[getUserData]);


    // (サイドバー押下時に発火)メイン画面の表示処理
    useEffect(()=>{

        if (!chatRoom) return;
        //FirestoreのメッセージコレクションとonSnapshot接続する
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, where('chatRoomId', '==', chatRoom), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGetChatMessage(messages);
        });

        
        const roomData = getRoomData.find((room)=>(room.chatRoomId === chatRoom));
        if(roomData && roomData.participants.length===2){
            const chatUserID = roomData.participants.find((participant)=>(participant !== AccountData.userId));
            const chatUserName = getUserData.find(user => user.userId === chatUserID);
            setChatName(chatUserName.userName);
        }else if(roomData){
          // グループチャットの場合
            setChatName(roomData.chatRoomName);
            };
        return () => unsubscribe();
    },[chatRoom,getRoomData]);

    console.log(chatName);

    // メッセージリストの末尾にスクロールするための ref
    const messagesEndRef = useRef(null);

    // メッセージリストの更新に応じてスクロール位置を末尾に移動
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    }, [getChatMessage]);


    // =========function========= //
    // ==チャット内容の履歴を表示する画面== //
    const MessageThread = () =>{
    
        return(
        <WrpperMessageThread className='WrpperMessageThread'>
        {getChatMessage.map((messages)=>(
        <ChatMessage
            key={`${messages.chatMessageId}-${messages.userId}`}
            message={messages.text}
            user={messages.userName}
            userId={messages.userId}
            timestamp={messages.timestamp}
            userData={getUserData}
            imageCache={imageCache}
        />
        ))}
        <div ref={messagesEndRef} />
    </WrpperMessageThread>
        )
    };

    // ==テキストエリアのEnterキー操作== //
    const onKeyNewLine = (event) => {

        // DBへのデータ送信
        const onSubmit = ()=>{
            // 現在日時の取得
            const currentDate = new Date();
            const isoString = currentDate.toISOString();

            // メッセージの格納
            const message = event.target.value;

            // Firestoreへのメッセージデータの追加
            let postData = {
                chatMessageId:uniqueID,
                chatRoomId:chatRoom,
                text:message,
                timestamp:isoString,
                userId:AccountData.userId,
                userName:AccountData.userName,
            };
            const postMessage = collection(db,"messages");
            addDoc(postMessage,postData);


            const setLocalChatName = {
                ...firstViewRoom,
                chatName:chatName,
            };
            const setLocalData = JSON.stringify(setLocalChatName);
            localStorage.setItem('LineClone',setLocalData);

            // FirestoreのchatRoomデータの更新
            const chatRoomRef = collection(db,'chatRoom');
            const q = query(chatRoomRef,where('chatRoomId','==',chatRoom));
            getDocs(q).then((snapShot)=>{
                snapShot.docs.map(async(doc)=>{
                    const docRef = doc.ref;
                    await updateDoc(docRef,{
                        "lastMessage.timestamp": isoString,
                        "lastMessage.text":message,
                    })
                });
            });

            // テキストエリアの初期化
            reset({chatmessage:''});
        };

        const LF = "\n";
        if (event.key === "Enter") {
            if (event.altKey) {
                let first = event.target.value.substring(0, event.target.selectionStart);
                let second = event.target.value.substring(event.target.selectionEnd);
                event.target.value = first + LF + second;
                event.target.selectionStart = first.length + 1;
                event.target.selectionEnd = event.target.selectionStart;
            }else if(event.target.value||event.target.value !=="\n"){
                onSubmit();
                
            }
            event.preventDefault();
            return false;
        }
    };



  return (
    <ChatMaindiv>
        {/* ヘッダー */}
        <ChatHeaderdiv>
            <Contentsdiv>
                <div style={{fontSize:'20px',fontWeight:'600',color:'#171717a9',alignItems:'center'}}>{chatName}</div>
                <Icondiv><VolumeDownIcon style={IconsStyle}/></Icondiv>
                <Icondiv><LaunchIcon style={IconsStyle}/></Icondiv>
            </Contentsdiv>
            <Contentsdiv>
                <CallIcon style={IconsStyle}/>
                <ArticleOutlinedIcon style={IconsStyle}/>
                <MoreHorizOutlinedIcon style={IconsStyle}/>
            </Contentsdiv>
        </ChatHeaderdiv>
        {/* メイン画面 */}
            <MessageThread />

        {/* 入力画面 */}
        <ChatInput>
            {/* 入力画面テキストエリア ※入力エリアの伸縮性は別途調整*/}
            <form style={{width:'100%'}} >
                <ChatInputArea
                    className='ChatInputArea'
                    name='chatmessage'
                    placeholder='メッセージを入力'
                    onKeyDown={onKeyNewLine}
                    {...register('chatmessage')}
                />
            </form>
            {/* 入力画面アイコン行 */}
            <ChatInputIconsdiv>
                <Contentsdiv>
                    <AttachFileIcon style={IconsStyle}/>
                    <BookmarkBorderIcon style={IconsStyle}/>
                    <BrowserNotSupportedIcon style={IconsStyle}/>
                </Contentsdiv>
                <Contentsdiv>
                    <SentimentSatisfiedAltIcon style={IconsStyle}/>
                </Contentsdiv>
            </ChatInputIconsdiv>
        </ChatInput>

    </ChatMaindiv>
  )
}

export default ChatMain
