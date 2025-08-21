import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AIChatbot() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || "admin";

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/chat", userId],
    refetchInterval: 2000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsTyping(true);
      const response = await apiRequest("POST", "/api/chat", { userId, message });
      return await response.json();
    },
    onSuccess: () => {
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: ["/api/chat", userId] });
      setMessage("");
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white" />
            </div>
            <CardTitle className="text-lg">Vigon AI Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
              <div className="flex-1 h-4 bg-slate-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              {!messages.length && (
                <div className="flex space-x-3 animate-fade-in">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-lg p-3">
                    <p className="text-sm text-slate-900">
                      Hello! I'm your IT assistant. How can I help you today?
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Just now</p>
                  </div>
                </div>
              )}
              
              {messages.map((msg: any) => (
                <div key={msg.id}>
                  <div className="flex space-x-2 justify-end mb-2">
                    <div className="flex-1 bg-vigon-blue rounded-lg p-3 text-right max-w-xs ml-auto">
                      <p className="text-sm text-white">{msg.message}</p>
                      <p className="text-xs text-blue-200 mt-1">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  </div>
                  
                  {msg.response && (
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-vigon-blue rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-lg p-3">
                        <p className="text-sm text-slate-900">{msg.response}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {sendMessageMutation.isPending && (
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-vigon-blue rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ask me anything about the systems..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
            className="flex-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <Button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
