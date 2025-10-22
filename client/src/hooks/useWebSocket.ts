import { useState, useEffect, useRef } from "react";

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn("WebSocket is not connected. Message not sent:", message);
    }
  };

  useEffect(() => {
    // For now, simulate WebSocket connection for chat functionality
    // In production, this would connect to a real WebSocket server
    setIsConnected(true);
    
    // Simulate receiving messages for demo purposes
    const simulateMessages = () => {
      const messages = [
        '{"type":"chat_message","id":"demo1","sender":"System","senderId":"system","message":"Welcome to the IT Staff Chat!","timestamp":"' + new Date().toISOString() + '","type":"system"}',
        '{"type":"chat_message","id":"demo2","sender":"Fatima Alami","senderId":"2","message":"Starting network maintenance in 10 minutes","timestamp":"' + new Date().toISOString() + '","type":"message","priority":"high"}'
      ];
      
      messages.forEach((msg, index) => {
        setTimeout(() => {
          setLastMessage(msg);
        }, index * 2000);
      });
    };

    // Start simulation after 1 second
    setTimeout(simulateMessages, 1000);

    // In production, uncomment this code:
    // const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // const connect = () => {
    //   ws.current = new WebSocket(wsUrl);

    //   ws.current.onopen = () => {
    //     setIsConnected(true);
    //     console.log("WebSocket connected");
    //   };

    //   ws.current.onmessage = (event) => {
    //     setLastMessage(event.data);
    //   };

    //   ws.current.onclose = () => {
    //     setIsConnected(false);
    //     console.log("WebSocket disconnected");
    //     setTimeout(connect, 3000);
    //   };

    //   ws.current.onerror = (error) => {
    //     console.error("WebSocket error:", error);
    //     setIsConnected(false);
    //   };
    // };

    // connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
