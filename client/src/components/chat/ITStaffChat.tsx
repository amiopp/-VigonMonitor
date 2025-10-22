import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Smile,
  Paperclip,
  Send as SendIcon,
  AlertTriangle,
  MessageSquare,
  Plus
} from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/components/auth/AuthProvider";

interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system' | 'alert';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isRead?: boolean;
}

interface ITStaffChatProps {
  className?: string;
}

export default function ITStaffChat({ className }: ITStaffChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'System',
      senderId: 'system',
      message: 'Welcome to the IT Staff Chat! All team members are connected.',
      timestamp: new Date().toISOString(),
      type: 'system'
    },
    {
      id: '2',
      sender: 'Fatima Alami',
      senderId: '2',
      message: 'Starting network maintenance in 10 minutes. Please prepare for brief connectivity interruption.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'message',
      priority: 'high'
    },
    {
      id: '3',
      sender: 'Ahmed Benali',
      senderId: '3',
      message: 'Understood. I\'ll monitor the systems during the maintenance window.',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'message'
    },
    {
      id: '4',
      sender: 'System',
      senderId: 'system',
      message: 'Alert: High CPU usage detected on Server-02',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      type: 'alert',
      priority: 'critical'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageType, setMessageType] = useState<'message' | 'alert'>('message');
  const [showStickers, setShowStickers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, sendMessage } = useWebSocket();
  const { user } = useAuth();

  // Stickers disponibles
  const stickers = ['😀', '😊', '😎', '🤔', '😮', '😢', '😡', '👍', '👎', '❤️', '🔥', '💡', '🚀', '✅', '❌', '⚠️'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: user?.name || 'You',
        senderId: user?.id || 'current-user',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: messageType,
        priority: messageType === 'alert' ? 'high' : undefined
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setMessageType('message'); // Reset to normal message after sending
      
      // Simulate sending via WebSocket
      if (sendMessage) {
        sendMessage(JSON.stringify({
          type: 'chat_message',
          message: newMessage.trim(),
          sender: user?.name || 'You',
          senderId: user?.id || 'current-user',
          timestamp: new Date().toISOString(),
          messageType: messageType
        }));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleStickerClick = (sticker: string) => {
    setNewMessage(prev => prev + sticker);
    setShowStickers(false);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return '🔧';
      case 'alert': return '🚨';
      default: return '💬';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="bg-blue-500 text-white text-xs">FA</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="bg-green-500 text-white text-xs">AB</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="bg-purple-500 text-white text-xs">SM</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg">IT Team Chat</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                <span>•</span>
                <span>3 members online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-2 max-w-[80%] ${msg.senderId === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {msg.senderId !== user?.id && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-slate-500 text-white text-xs">
                    {getInitials(msg.sender)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col space-y-1 ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">{msg.sender}</span>
                  <span className="text-xs text-slate-500">{formatTime(msg.timestamp)}</span>
                  {msg.priority && (
                    <Badge className={`text-xs ${getPriorityColor(msg.priority)}`}>
                      {msg.priority}
                    </Badge>
                  )}
                </div>
                
                <div className={`rounded-lg px-4 py-2 ${
                  msg.type === 'system' 
                    ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                    : msg.type === 'alert'
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : msg.senderId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-start space-x-2">
                    <span className="text-sm">{getMessageTypeIcon(msg.type)}</span>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-slate-500 text-white text-xs">...</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        {/* Message Type Selector */}
        <div className="mb-3">
          <Select value={messageType} onValueChange={(value: 'message' | 'alert') => setMessageType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message normal</span>
                </div>
              </SelectItem>
              <SelectItem value="alert">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Alerte</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messageType === 'alert' ? "Type your alert message..." : "Type your message..."}
              className="pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowStickers(!showStickers)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex-shrink-0"
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>

        {/* Stickers Panel */}
        {showStickers && (
          <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg shadow-lg">
            <div className="grid grid-cols-8 gap-2">
              {stickers.map((sticker, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 text-lg hover:bg-slate-100"
                  onClick={() => handleStickerClick(sticker)}
                >
                  {sticker}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






