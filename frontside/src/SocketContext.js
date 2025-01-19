import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const backendUrl = process.env.NODE_ENV === 'production' ? 'http://backend:5000' : 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      transports: ['polling', 'websocket'],
      autoConnect: false
    });

    newSocket.on('connect', () => {
      console.log("Frontend connected to Socket.IO");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Frontend Socket.IO connection error:", err);
    });

    newSocket.on('disconnect', () => {
      console.log("Frontend disconnected from Socket.IO");
    });

    setSocket(newSocket); // Store the socket in state
    return () => {
        if (newSocket) {
            newSocket.disconnect();
        }
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}> {/* Provide the socket here! */}
      {children}
    </SocketContext.Provider>
  );
};
