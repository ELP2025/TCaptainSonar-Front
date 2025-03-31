import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io, Socket } from 'socket.io-client';

function App() {
  const [count, setCount] = useState(0)

  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
    });

    newSocket.on('message', (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', message);
      setMessage('');
    }
  };


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div>
      <h1>Socket.IO Client</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
      <h1>POWER RAAANGERS</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
