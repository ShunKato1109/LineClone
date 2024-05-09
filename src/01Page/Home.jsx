import React from 'react'
import { get, useForm } from 'react-hook-form'
import styled from 'styled-components';

// DummyData
import MessageDummy from '../00DummyData/MessageDummy';

// FireStore
// import {addDoc, collection,getDoc} from "firebase/firestore";
import {collection,addDoc, getDocs, query, where, doc, updateDoc} from "firebase/firestore";
import {db} from '../firebase';

// Styled-Components
const WrapperHomediv = styled.div`
  display:flex;
  height:100vh;
  align-items:center;
  justify-content:center;
`;

const WrapperUserInputdiv = styled.div`
  display:flex;
  flex-direction:column;
`;


const Userinput = styled.input`
  width:800px;
  height:50px;
  padding:20px;
  font-size:24px;
`;

const Userlabel = styled.label`
  display:flex;
  justify-content:flex-start;
  font-size:24px;
`;

const SubmitBtninput = styled.input`
  display:flex;
  justify-content:center;
  width:250px;
  height:60px;
  border-radius:30px;
  border:none;
  font-size:24px;
  background-color:#79e278;
  cursor: pointer;
  :hover {
    background-color:#c5f1c4e0;
  }
  `;

// チャットルームのダミーデータ
const chatRoomData = [
//   {
//       chatRoomId: "room1",
//       chatRoomName: "",
//       participants: [
//           "gokigenpanda",
//           "kato"
//       ],
//       lastMessage: {
//           text: "今日はお花見どう？",
//           sentBy: "gokigenpanda",
//           timestamp: "2024-04-26T07:52:44Z"
//       }
//   },
//   {
//       chatRoomId: "room2",
//       chatRoomName: "",
//       participants: [
//           "konezumi",
//           "kato"
//       ],
//       lastMessage: {
//           text: "今日はお花見どう？",
//           sentBy: "konezumi",
//           timestamp: "2024-04-30T08:52:44Z"
//       }
//   },
//   {
//       chatRoomId: "room3",
//       chatRoomName: "",
//       participants: [
//           "kanedakon",
//           "kato"
//       ],
//       lastMessage: {
//           text: "おすすめのカフェある？コーヒー飲みたいな！",
//           sentBy: "kanedakon",
//           timestamp: "2024-04-26T01:52:44Z"
//       }
//   },
//   {
//       chatRoomId: "room4",
//       chatRoomName: "",
//       participants: [
//           "yoshinosan",
//           "kato"
//       ],
//       lastMessage: {
//           text: "来週のピクニック、楽しみにしてるよ！",
//           sentBy: "yoshinosan",
//           timestamp: "2024-04-30T22:52:44Z"
//       }
//   },
//   {
//       chatRoomId: "room5",
//       chatRoomName: "みんなのグループ",
//       participants: [
//           "gokigenpanda",
//           "konezumi",
//           "kanedakon",
//           "yoshinosan",
//           "loverabbit",
//           "kato"
//       ],
//       lastMessage: {
//           text: "昨日の星空、きれいだったね〜",
//           sentBy: "loverabbit",
//           timestamp: "2024-04-27T01:52:44Z"
//       }
//   },
//   {
//       chatRoomId: "room6",
//       chatRoomName: "カフェに行くグループ",
//       participants: [
//           "gokigenpanda",
//           "konezumi",
//           "kato"
//       ],
//       lastMessage: {
//           text: "おすすめのカフェある？コーヒー飲みたいな！",
//           sentBy: "gokigenpanda",
//           timestamp: "2024-04-27T14:52:44Z"
//       }
//   },
//   {
//     chatRoomId: "room7",
//     chatRoomName: "カフェに行くグループ",
//     participants: [
//         "gokigenpanda",
//         "konezumi",
//         "yoshinosan"
//     ],
//     lastMessage: {
//         text: "かとういないね",
//         sentBy: "gokigenpanda",
//         timestamp: "2024-04-30T14:52:44Z"
//     }
//   },
//   {
//     chatRoomId: "room8",
//     chatRoomName: "",
//     participants: [
//         "yoshinosan",
//         "konezumi"
//     ],
//     lastMessage: {
//         text: "ぼくは吉野です",
//         sentBy: "yoshinosan",
//         timestamp: "2024-05-01T22:52:44Z"
//     }
// },
];

// ユーザーのダミーデータ
const userDummyData = [
  // {
  //     "userId": "gokigenpanda",
  //     "userName": "ごきげんぱんだ",
  //     "profileUrl": ""
  // },
  // {
  //     "userId": "konezumi",
  //     "userName": "こねずみ",
  //     "profileUrl": ""
  // },
  // {
  //     "userId": "kanedakon",
  //     "userName": "金田こん",
  //     "profileUrl": ""
  // },
  // {
  //     "userId": "yoshinosan",
  //     "userName": "よしのさん",
  //     "profileUrl": ""
  // },
  // {
  //     "userId": "loverabbit",
  //     "userName": "らぶらびっと",
  //     "profileUrl": ""
  // },
  // {
  //     "userId": "kato",
  //     "userName": "かとう",
  //     "profileUrl": ""
  // }
];

const messagesDummyData = [
  {
      "chatMessageId": "msg1",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "わーい！きょう、おてんきいいね！",
      "timestamp": "2024-05-01T12:10:26.864936Z"
  },
  {
      "chatMessageId": "msg2",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "いいね、ちょっと散歩しようか。",
      "timestamp": "2024-05-01T12:15:26.864936Z"
  },
  {
      "chatMessageId": "msg3",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "かふぇ、たのしかった？",
      "timestamp": "2024-05-01T12:20:26.864936Z"
  },
  {
      "chatMessageId": "msg4",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "アイスラテ飲んだよ。君も好きかな？",
      "timestamp": "2024-05-01T12:25:26.864936Z"
  },
  {
      "chatMessageId": "msg5",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "アイスクリーム、いいね！今度一緒に食べに行こう。",
      "timestamp": "2024-05-01T12:30:26.864936Z"
  },
  {
      "chatMessageId": "msg6",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "暑い日には、本当にアイスクリームがぴったりだね。",
      "timestamp": "2024-05-01T12:35:26.864936Z"
  },
  {
      "chatMessageId": "msg7",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "そうだね、プロジェクトの計画を立てよう。",
      "timestamp": "2024-05-01T12:40:26.864936Z"
  },
  {
      "chatMessageId": "msg8",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "それはいいアイデアだね。どんなスケッチを考えてるの？",
      "timestamp": "2024-05-01T12:45:26.864936Z"
  },
  {
      "chatMessageId": "msg9",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "ねえ、しんかんせんみたい！",
      "timestamp": "2024-05-01T12:50:26.864936Z"
  },
  {
      "chatMessageId": "msg10",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "ぼくもいっしょにたべたい！",
      "timestamp": "2024-05-01T12:55:26.864936Z"
  },
  {
      "chatMessageId": "msg11",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "本当だね、いい天気だよ。",
      "timestamp": "2024-05-01T13:00:26.864936Z"
  },
  {
      "chatMessageId": "msg12",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "ねえねえ、おさんぽいこうよ！",
      "timestamp": "2024-05-01T13:05:26.864936Z"
  },
  {
      "chatMessageId": "msg13",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "うん、新しいカフェ、すごくおしゃれだったよ。",
      "timestamp": "2024-05-01T13:10:26.864936Z"
  },
  {
      "chatMessageId": "msg14",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "おいしかった？ぼくもいきたいな！",
      "timestamp": "2024-05-01T13:15:26.864936Z"
  },
  {
      "chatMessageId": "msg15",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "アイスたべたいなー！",
      "timestamp": "2024-05-01T13:20:26.864936Z"
  },
  {
      "chatMessageId": "msg16",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "暑い日には、本当にアイスクリームがぴったりだね。",
      "timestamp": "2024-05-01T13:25:26.864936Z"
  },
  {
      "chatMessageId": "msg17",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "ねえねえ、らいしゅうのこと、はなそ？",
      "timestamp": "2024-05-01T13:30:26.864936Z"
  },
  {
      "chatMessageId": "msg18",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "それはいいアイデアだね。どんなスケッチを考えてるの？",
      "timestamp": "2024-05-01T13:35:26.864936Z"
  },
  {
      "chatMessageId": "msg19",
      "chatRoomId": "room1",
      "userId": "gokigenpanda",
      "userName": "ごきげんぱんだ",
      "text": "ねえ、しんかんせんみたい！",
      "timestamp": "2024-05-01T13:40:26.864936Z"
  },
  {
      "chatMessageId": "msg20",
      "chatRoomId": "room1",
      "userId": "kato",
      "userName": "かとう",
      "text": "いいね、それからご飯にしよう。",
      "timestamp": "2024-05-01T13:45:26.864936Z"
  },
  {
    "chatMessageId": "msg1",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "今日は何して過ごした？",
    "timestamp": "2024-05-01T12:18:42.302671Z"
},
{
    "chatMessageId": "msg2",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "図書館で本を借りてきたよ。",
    "timestamp": "2024-05-01T12:23:42.302671Z"
},
{
    "chatMessageId": "msg3",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "どんな本？",
    "timestamp": "2024-05-01T12:28:42.302671Z"
},
{
    "chatMessageId": "msg4",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "冒険小説だよ。すごく面白いから、おすすめだよ。",
    "timestamp": "2024-05-01T12:33:42.302671Z"
},
{
    "chatMessageId": "msg5",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "映画にも行きたいな。",
    "timestamp": "2024-05-01T12:38:42.302671Z"
},
{
    "chatMessageId": "msg6",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "最近、良い映画があるかな？",
    "timestamp": "2024-05-01T12:43:42.302671Z"
},
{
    "chatMessageId": "msg7",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "家で映画を見ようよ。ポップコーンも準備しよう！",
    "timestamp": "2024-05-01T12:48:42.302671Z"
},
{
    "chatMessageId": "msg8",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "いいね！何の映画がいい？",
    "timestamp": "2024-05-01T12:53:42.302671Z"
},
{
    "chatMessageId": "msg9",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "アクションものが見たいな。",
    "timestamp": "2024-05-01T12:58:42.302671Z"
},
{
    "chatMessageId": "msg10",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "それじゃあ、アクション映画を選ぼう。",
    "timestamp": "2024-05-01T13:03:42.302671Z"
},
{
    "chatMessageId": "msg11",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "天気がいいから、ピクニックに行かない？",
    "timestamp": "2024-05-01T13:08:42.302671Z"
},
{
    "chatMessageId": "msg12",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "いいね！どこに行く？",
    "timestamp": "2024-05-01T13:13:42.302671Z"
},
{
    "chatMessageId": "msg13",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "近くの公園がいいかな。",
    "timestamp": "2024-05-01T13:18:42.302671Z"
},
{
    "chatMessageId": "msg14",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "お弁当を持って行こう。",
    "timestamp": "2024-05-01T13:23:42.302671Z"
},
{
    "chatMessageId": "msg15",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "サンドイッチを作るよ。",
    "timestamp": "2024-05-01T13:28:42.302671Z"
},
{
    "chatMessageId": "msg16",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "フルーツも忘れずにね。",
    "timestamp": "2024-05-01T13:33:42.302671Z"
},
{
    "chatMessageId": "msg17",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "写真をたくさん撮ろう。",
    "timestamp": "2024-05-01T13:38:42.302671Z"
},
{
    "chatMessageId": "msg18",
    "chatRoomId": "room2",
    "userId": "kato",
    "userName": "かとう",
    "text": "いいね、素敵な思い出になりそう。",
    "timestamp": "2024-05-01T13:43:42.302671Z"
},
{
    "chatMessageId": "msg19",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "次の旅行はどこに行く？",
    "timestamp": "2024-05-01T13:48:42.302671Z"
},
{
    "chatMessageId": "msg20",
    "chatRoomId": "room2",
    "userId": "konezumi",
    "userName": "こねずみ",
    "text": "海が見たいな。青い海！",
    "timestamp": "2024-05-01T13:53:42.302671Z"
},
];

const Home = () => {

    const {register,handleSubmit,reset} = useForm();

    // ユーザー情報の送信
    const onSubmitUser = (data)=>{
      
      // 新規登録用ユーザー情報
      let postUserData = {
        email:'',
        password:'',
        profileImageUrl:'',
        userId:`${data.userId}`,
        userName:`${data.userName}`,
      };

      // 新規でユーザーを登録する
      const addUser = ()=>{
        const postUserInfo = collection(db,"users");
        addDoc(postUserInfo,postUserData);
        alert('新規ユーザー登録完了しました');
      };

      // ユーザー情報の更新
      const updateUser = (user)=>{
        const updateUserRef = doc(db,'users',user.id);
        updateDoc(updateUserRef,postUserData).then(()=>{alert('データを更新しました')});
      };

      let getUserData = [];
      const userDataRef = collection(db,'users');
      const q = query(userDataRef,where('userId','==',data.userId));
      getDocs(q).then((snapshot)=>{
        snapshot.docs.map((doc)=>getUserData.push({
          id: doc.id,
          ...doc.data()
        }));
        console.log(getUserData[0]);

        if(!getUserData[0]){
          addUser();
        }else{
          // eslint-disable-next-line no-restricted-globals
          const userResponse = confirm('既に登録済みのユーザーです。内容を更新しますか？');
          if(userResponse){
            updateUser(getUserData[0]);
          }else{
            return;
          }
        };

      });

      reset();
    };
    // チャットルームのデータ送信
    const onSubmitRoom = ()=>{
      // Firestoreにデータを送信する
      const postRoomData = collection(db,"chatRoom");
      chatRoomData.map((room)=>(addDoc(postRoomData,room)));
      
    };
    // ユーザーダミーデータの送信
    const onSubmitDummyUsers = () =>{
      const postDummyUsers = collection(db,"users");
      userDummyData.map((user)=>(addDoc(postDummyUsers,user)));
    };

    // ユーザーダミーデータの送信
    const onSubmitMessage = () =>{
      const postDummyMessages = collection(db,"messages");
      messagesDummyData.map((user)=>(addDoc(postDummyMessages,user)));
    };

    return(
      <>
        <WrapperHomediv>
          <form onSubmit={handleSubmit(onSubmitUser)}>
            <WrapperUserInputdiv>
              <h1>ユーザー情報登録/ログイン</h1>
              <Userlabel htmlFor="userName">ユーザー名</Userlabel>
              <Userinput 
              type='text'
              name='userName'
              id='userName'
                {...register('userName',{
                  required:true,
                })}
              />
              <div style={{height:'50px'}}/>
              <Userlabel htmlFor="userId">ユーザーID</Userlabel>
              <Userinput 
              type='text'
              name='userId'
              id='userId'
                {...register('userId',{
                  required:true,
                })}
              />
              <div style={{height:'20px'}}/>
              <div style={{display:'flex',justifyContent:'center'}}>
                <SubmitBtninput type='submit' value='登録/ログイン'/>
              </div>
            </WrapperUserInputdiv>
            </form>
            <div style={{width:"50px"}} />
            <div>
              <WrapperUserInputdiv>
              <h1>デモチャットルーム作成</h1>
                <div style={{height:'20px'}}/>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <SubmitBtninput type='submit' value='ルームデータ送信' onClick={onSubmitRoom}/>
                </div>
              </WrapperUserInputdiv>
              <WrapperUserInputdiv>
              <h1>ダミーユーザー作成</h1>
                <div style={{height:'20px'}}/>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <SubmitBtninput type='submit' value='ユーザーデータ送信' onClick={onSubmitDummyUsers}/>
                </div>
              </WrapperUserInputdiv>
              <WrapperUserInputdiv>
              <h1>デモメッセージ作成</h1>
                <div style={{height:'20px'}}/>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <SubmitBtninput type='submit' value='デモメッセージ送信' onClick={onSubmitMessage}/>
                </div>
              </WrapperUserInputdiv>
              </div>

          </WrapperHomediv>
        

      </>
    )
}

export default Home
