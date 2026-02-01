import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Toaster } from 'react-hot-toast';
import CodeEditor from '../../Component/CodeEditor/CodeEditor';
import OutputConsole from '../../Component/OutputConsole/OutputConsole';
import Chat from '../../Component/Chat/Chat';
import VoiceChat from '../../Component/VoiceChat/VoiceChat';
import { useAuth } from '../../context/AuthContext';

const CodingRealtime = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // Yjs state
  const [yDoc, setYDoc] = useState(null);
  const [provider, setProvider] = useState(null);

  // Socket state
  const [socket, setSocket] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    // 1. Initial Socket Handshake
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    // 2. Check URL params for immediate join
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('roomId');
    const userParam = params.get('username');

    if (roomParam && userParam) {
      setRoomId(roomParam);
      setUsername(userParam);
      setJoined(true);
    } else if (roomParam && user) {
      setRoomId(roomParam);
      setUsername(user.username);
      setJoined(true);
    } else if (roomParam) {
      setRoomId(roomParam);
    } else if (user) {
      setUsername(user.username);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Handle Room Join and Yjs Initialization
  useEffect(() => {
    if (!joined || !roomId || !socket) return;

    // Join Socket Room
    socket.emit('join-room', roomId);

    // Initialize Yjs for THIS room
    const doc = new Y.Doc();
    const wsp = new WebsocketProvider(
      import.meta.env.VITE_YJS_WEBSOCKET_URL,
      roomId,
      doc
    );

    setYDoc(doc);
    setProvider(wsp);

    return () => {
      wsp.disconnect();
      doc.destroy();
      setYDoc(null);
      setProvider(null);
    };
  }, [joined, roomId, socket]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId && username) {
      // Update URL without reload
      const newUrl = `${window.location.pathname}?roomId=${roomId}&username=${username}`;
      window.history.pushState({}, '', newUrl);
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e', color: 'white' }}>
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px', background: '#2d2d2d', borderRadius: '10px' }}>
          <h2>Join Arena</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
          />
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
          />
          <button type="submit" style={{ padding: '10px', background: '#007acc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Enter Lobby
          </button>
          <button type="button" onClick={() => setRoomId(Math.random().toString(36).substring(7))} style={{ padding: '10px', background: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Generate Random Room
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Toaster position="top-center" />
      <div style={{ flex: 2, borderRight: '1px solid #333' }}>
        <CodeEditor
          roomId={roomId}
          username={username}
          setOutput={setOutput}
          setIsRunning={setIsRunning}
          yDoc={yDoc}
          provider={provider}
        />
      </div>
      <div style={{ flex: 1 }}>
        <OutputConsole output={output} isRunning={isRunning} />
      </div>

      <Chat
        socket={socket}
        yDoc={yDoc}
        roomId={roomId}
        username={username}
        color="#38bdf8"
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
      />

      <VoiceChat
        roomId={roomId}
        username={username}
        socket={socket}
      />
    </div>
  );
};

export default CodingRealtime;
