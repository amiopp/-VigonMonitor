import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, User, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

export default function AIChatbot() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const userId = "admin"; // In production, get from auth context

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/chat", userId],
    refetchInterval: 2000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/chat", { userId, message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", userId] });
      setMessage("");
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
          <CardTitle>AI Assistant</CardTitle>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">Online</span>
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
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-vigon-blue rounded-full flex items-center justify-center">
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
            className="flex-1 focus:ring-vigon-blue focus:border-vigon-blue"
          />
          <Button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-vigon-blue hover:bg-vigon-dark"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
