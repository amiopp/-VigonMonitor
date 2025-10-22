import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, Building2, Download, Trash2, Send, 
  Bot, User, Lightbulb, BarChart3, Settings,
  TrendingUp, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function MultiHotelAI() {
  // State management
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample hotel data
  const hotels = [
    { id: "all", name: "All Hotels", location: "Global" },
    { id: "savoy", name: "Savoy Hotel", location: "London, UK" },
    { id: "ritz", name: "Ritz Paris", location: "Paris, France" },
    { id: "marriott", name: "Marriott Marquis", location: "New York, USA" },
    { id: "fairmont", name: "Fairmont Marrakech", location: "Marrakech, Morocco" }
  ];

  // Quick question templates
  const quickQuestions = [
    {
      category: "Performance",
      questions: [
        "Which hotel has the best uptime?",
        "Show me revenue trends across all properties",
        "What are the current system issues?"
      ]
    },
    {
      category: "Operations",
      questions: [
        "How many guests are currently online?",
        "Which services need maintenance?",
        "What's the energy consumption status?"
      ]
    },
    {
      category: "Financial",
      questions: [
        "Compare monthly costs across hotels",
        "Which property is most profitable?",
        "Show me cost optimization opportunities"
      ]
    }
  ];

  // Sample chat history
  const sampleChats = [
    {
      id: 1,
      hotel: "All Hotels",
      topic: "Performance Analysis",
      lastMessage: "Which hotel has the best uptime?",
      timestamp: "2 hours ago",
      messageCount: 8
    },
    {
      id: 2,
      hotel: "Savoy Hotel",
      topic: "System Issues",
      lastMessage: "Current WiFi connectivity status",
      timestamp: "1 day ago",
      messageCount: 12
    },
    {
      id: 3,
      hotel: "Ritz Paris",
      topic: "Financial Review",
      lastMessage: "Monthly cost breakdown",
      timestamp: "3 days ago",
      messageCount: 15
    }
  ];

  // Action handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      hotel: selectedHotel
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, selectedHotel);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      showNotification("Chat history cleared", "success");
    }
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp}] ${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${selectedHotel}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification("Chat exported successfully", "success");
  };

  const handleHotelContextChange = (hotelId: string) => {
    setSelectedHotel(hotelId);
    // Load hotel-specific context
    if (hotelId !== "all") {
      const hotel = hotels.find(h => h.id === hotelId);
      showNotification(`Context switched to ${hotel?.name}`, "info");
    } else {
      showNotification("Context switched to global view", "info");
    }
  };

  const generateAIResponse = (userMessage: string, hotelContext: string): any => {
    const responses = {
      "uptime": `Based on current data, ${hotelContext === 'all' ? 'Savoy Hotel has the best uptime at 99.2%' : 'your hotel has an uptime of 98.7%'}. All systems are operating within normal parameters.`,
      "revenue": `Revenue trends show ${hotelContext === 'all' ? 'consistent growth across properties with an average increase of 5.2% month-over-month' : 'steady performance with room for optimization'}.`,
      "issues": `Current system issues: ${hotelContext === 'all' ? '3 minor alerts across all properties' : '1 maintenance notification for CCTV system'}. All critical systems are operational.`,
      "guests": `Current guest count: ${hotelContext === 'all' ? '2,221 guests across all properties' : '189 guests online'}. WiFi usage is at 78% capacity.`,
      "maintenance": `Scheduled maintenance: ${hotelContext === 'all' ? '2 properties have maintenance windows this week' : 'CCTV system maintenance scheduled for tomorrow'}.`,
      "energy": `Energy consumption: ${hotelContext === 'all' ? 'Average 8.4 kW across properties with 15% potential savings' : 'Current usage at 7.2 kW with optimization opportunities'}.`,
      "costs": `Cost analysis: ${hotelContext === 'all' ? 'Monthly costs total $1,274,000 with WiFi infrastructure being the highest at 35.3%' : 'Monthly costs at $62,000 with room for optimization'}.`,
      "profitability": `Profitability metrics: ${hotelContext === 'all' ? 'Average profit margin is 12.8% across all properties' : 'Current profit margin is 27.1%'}.`,
      "optimization": `Cost optimization opportunities: ${hotelContext === 'all' ? 'Potential monthly savings of $38,200 through infrastructure consolidation and energy efficiency' : 'Potential savings of $8,500 through WiFi optimization'}.`
    };

    const messageLower = userMessage.toLowerCase();
    let response = "I understand your question about hotel operations. Let me provide you with relevant information based on the current data.";

    if (messageLower.includes("uptime") || messageLower.includes("performance")) {
      response = responses.uptime;
    } else if (messageLower.includes("revenue") || messageLower.includes("trends")) {
      response = responses.revenue;
    } else if (messageLower.includes("issues") || messageLower.includes("problems")) {
      response = responses.issues;
    } else if (messageLower.includes("guests") || messageLower.includes("online")) {
      response = responses.guests;
    } else if (messageLower.includes("maintenance")) {
      response = responses.maintenance;
    } else if (messageLower.includes("energy") || messageLower.includes("consumption")) {
      response = responses.energy;
    } else if (messageLower.includes("costs") || messageLower.includes("expenses")) {
      response = responses.costs;
    } else if (messageLower.includes("profit") || messageLower.includes("margin")) {
      response = responses.profitability;
    } else if (messageLower.includes("optimization") || messageLower.includes("savings")) {
      response = responses.optimization;
    }

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: response,
      timestamp: new Date().toLocaleTimeString(),
      hotel: hotelContext
    };
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Multi-Hotel AI Assistant</h1>
              <p className="text-gray-600">Intelligent insights and assistance across all hotel properties</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExportChat}>
                <Download className="h-4 w-4 mr-2" />
                Export Chat
              </Button>
              <Button variant="outline" onClick={handleClearChat}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Hotel Context & Quick Questions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Hotel Context Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Hotel Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedHotel} onValueChange={handleHotelContextChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        <div className="flex items-center space-x-2">
                          <span>{hotel.name}</span>
                          {hotel.id !== "all" && (
                            <Badge variant="outline" className="text-xs">
                              {hotel.location}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  AI responses will be tailored to the selected hotel context
                </p>
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Quick Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickQuestions.map((category) => (
                    <div key={category.category}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                      <div className="space-y-2">
                        {category.questions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start h-auto p-2"
                            onClick={() => handleQuickQuestion(question)}
                          >
                            <span className="text-xs">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Chats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {sampleChats.map((chat) => (
                      <div key={chat.id} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {chat.hotel}
                          </Badge>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">{chat.topic}</h5>
                        <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{chat.messageCount} messages</span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI Assistant</span>
                  {selectedHotel !== "all" && (
                    <Badge variant="secondary">
                      {hotels.find(h => h.id === selectedHotel)?.name}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Multi-Hotel AI Assistant</h3>
                        <p className="text-gray-600 mb-4">
                          Ask me anything about your hotel operations, performance, or get insights across all properties.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {quickQuestions.flatMap(cat => cat.questions).slice(0, 3).map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickQuestion(question)}
                              className="text-xs"
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {message.type === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                            <span className="text-xs opacity-75">
                              {message.type === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            {message.hotel !== "all" && (
                              <Badge variant="outline" className="text-xs">
                                {hotels.find(h => h.id === message.hotel)?.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-75 mt-2">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-4 w-4" />
                            <span className="text-sm">AI is typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about your hotels..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>AI-Generated Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Performance Trend</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Overall system uptime has improved by 2.3% this month across all properties.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Attention Needed</h4>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Marriott Marquis has 3 pending maintenance tasks that require attention.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Optimization Opportunity</h4>
                  </div>
                  <p className="text-sm text-green-800">
                    Potential monthly savings of $38,200 through infrastructure consolidation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

