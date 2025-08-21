import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Loader2,
  Bot,
  User,
  Sparkles,
  Zap,
  Heart,
  ThumbsUp,
  Star
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response?: string;
  timestamp: Date;
}

interface ChatSticker {
  emoji: string;
  name: string;
  animation: string;
}

const chatStickers: ChatSticker[] = [
  { emoji: "👋", name: "wave", animation: "animate-bounce" },
  { emoji: "👍", name: "thumbs-up", animation: "animate-pulse" },
  { emoji: "❤️", name: "heart", animation: "animate-ping" },
  { emoji: "⚡", name: "energy", animation: "animate-bounce" },
  { emoji: "✨", name: "sparkles", animation: "animate-spin" },
  { emoji: "🎯", name: "target", animation: "animate-pulse" },
  { emoji: "🚀", name: "rocket", animation: "animate-bounce" },
  { emoji: "💡", name: "idea", animation: "animate-pulse" },
];

const welcomeMessages = [
  "Bonjour! 👋 Comment puis-je vous aider avec votre infrastructure IT?",
  "Hello! How can I assist you with your hotel systems today?",
  "¡Hola! ¿Cómo puedo ayudarte con tus sistemas hoteleros?",
];

export function EnhancedAIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle through welcome messages
  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["/api/chat", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await apiRequest("GET", `/api/chat/${user.id}`);
      return await response.json();
    },
    enabled: !!user?.id && isOpen,
    refetchInterval: isOpen ? 3000 : false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        userId: user?.id,
        message: messageText,
      });
      return await response.json();
    },
    onSuccess: () => {
      setMessage("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        refetchMessages();
      }, 1500);
    },
  });

  const handleSendMessage = () => {
    if (message.trim() && user?.id) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleSendSticker = (sticker: ChatSticker) => {
    if (user?.id) {
      sendMessageMutation.mutate(`${sticker.emoji} ${sticker.name}`);
      setShowStickers(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: 0,
        height: isMinimized ? "auto" : "600px"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 right-6 z-50 w-96"
    >
      <Card className="h-full bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-0 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white/30">
                  <AvatarImage 
                    src="https://dqcgwmxrlprmqeijjsme.supabase.co/storage/v1/object/public/logos/color-1736899024753-0.5219336404716874.png" 
                    alt="Vigon Systems"
                  />
                  <AvatarFallback className="bg-white text-teal-600 font-semibold">
                    VS
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-sm">VIGON Assistant</h3>
                <motion.p 
                  key={welcomeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-white/80"
                >
                  {welcomeMessages[welcomeIndex].includes("👋") ? "En ligne" : "Online"}
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border">
                          <motion.p 
                            key={welcomeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {welcomeMessages[welcomeIndex]}
                          </motion.p>
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Assistant
                        </Badge>
                      </div>
                    </motion.div>

                    {/* Chat Messages */}
                    {messages.map((msg: ChatMessage, index: number) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        {/* User Message */}
                        <div className="flex items-start space-x-3 justify-end">
                          <div className="flex-1 max-w-xs">
                            <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl p-3 shadow-sm">
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <div className="flex items-center justify-end mt-1 space-x-1">
                              <Badge variant="outline" className="text-xs">
                                <User className="h-3 w-3 mr-1" />
                                {user?.name}
                              </Badge>
                            </div>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                              {user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* AI Response */}
                        {msg.response && (
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{msg.response}</p>
                              </div>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Zap className="h-3 w-3 mr-1" />
                                  VIGON AI
                                </Badge>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ThumbsUp className="h-3 w-3 text-gray-400 hover:text-green-500" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Heart className="h-3 w-3 text-gray-400 hover:text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border">
                            <div className="flex space-x-1">
                              <motion.div
                                className="w-2 h-2 bg-teal-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-teal-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-teal-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Stickers Panel */}
              <AnimatePresence>
                {showStickers && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t bg-white/50 dark:bg-gray-800/50 p-3"
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {chatStickers.map((sticker) => (
                        <Button
                          key={sticker.name}
                          variant="ghost"
                          onClick={() => handleSendSticker(sticker)}
                          className="h-12 w-12 p-0 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                        >
                          <span className={cn("text-2xl", sticker.animation)}>
                            {sticker.emoji}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="p-4 border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStickers(!showStickers)}
                    className="h-10 w-10 p-0 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Envoyez-nous un message..."
                      className="pr-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sendMessageMutation.isPending}
                      className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Nous répondons généralement dans l'heure
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}