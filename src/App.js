import './App.css';
import ChatPage from './01Page/ChatPage';
import Home from './01Page/Home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoute from './03Route/PrivateRoute';
import ChatRoomContext from './06Context/ChatRoomContext';
import UserContext from './06Context/UserContext';

// socket
import { socket } from './socket';
import { createContext, useState } from 'react';



function App() {
  // 初期チャットルームの設定
  const getFirstViewRoom = localStorage.getItem(`LineClone`);
  const firstViewRoom = JSON.parse(getFirstViewRoom);
  // =====React-Hooks===== //
  const [chatRoom,setChatRoom] = useState(firstViewRoom?firstViewRoom.chatRoomId:null);
  const AccountData = {userName:"かとう",userId:"kato"};
  // プロフィール画像のキャッシュ
  const imageCache = new Map();

  return (
    <div className="App">
      <BrowserRouter>
        <ChatRoomContext.Provider value={{chatRoom,setChatRoom,AccountData}}>
        {/* <UserContext.Provider value={}> */}
          <Routes>
            {/* ホーム画面 */}
            {/* <Route path="/" element={<Home />}/>  */}
            <Route path="/" element={<PrivateRoute children={<Home />}/>} />
            {/* チャット画面 */}
            <Route path="/chatpage" element={<PrivateRoute children={<ChatPage/>}/>} />
          </Routes>
        {/* </UserContext.Provider> */}
        </ChatRoomContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
