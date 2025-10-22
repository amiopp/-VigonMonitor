import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  BarChart3, 
  Users, 
  Zap,
  X,
  Maximize2,
  Minimize2,
  Brain,
  Target,
  Clock,
  TrendingDown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  insights?: string[];
  recommendations?: string[];
  data?: any;
  priority?: 'high' | 'medium' | 'low';
}

interface AIInsight {
  type: 'cost' | 'revenue' | 'performance' | 'alert' | 'staff' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  priority: number;
  confidence: number;
}

interface ManagerAIChatbotProps {
  currency: string;
  formatCurrency: (amount: number, currency: string) => string;
  powerConsumption: any;
  estimatedMonthlyCost: number;
}

export default function ManagerAIChatbot({ 
  currency, 
  formatCurrency, 
  powerConsumption, 
  estimatedMonthlyCost 
}: ManagerAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI advisor, designed to support your decision-making with real-time insights and strategic recommendations. I can analyze costs, monitor alerts, summarize staff communications, and suggest optimizations. How can I assist you today?",
      timestamp: new Date(),
      insights: ['Dashboard overview available', 'Recent alerts detected', 'Performance metrics ready', 'Staff communications tracked'],
      recommendations: ['Review critical alerts first', 'Check staff activity summary', 'Analyze cost trends', 'Consider optimization opportunities'],
      priority: 'high'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data queries - replace with actual API calls
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => ({
      totalRevenue: 89200,
      totalCost: 127400,
      profit: -38200,
      activeAlerts: 8,
      staffIssues: 3,
      systemPerformance: 94.2,
      monthlyTrend: -2.1,
      yearToDate: -15.3
    })
  });

  const { data: staffData } = useQuery({
    queryKey: ['staff-communications'],
    queryFn: () => [
      { id: 1, message: "WiFi connectivity issues in east wing", priority: 'high', timestamp: '2 hours ago', hotel: 'Fairmont' },
      { id: 2, message: "IPTV system maintenance completed", priority: 'low', timestamp: '4 hours ago', hotel: 'Savoy' },
      { id: 3, message: "New security camera installation needed", priority: 'medium', timestamp: '6 hours ago', hotel: 'RITZ' },
      { id: 4, message: "Energy consumption spike detected", priority: 'high', timestamp: '1 hour ago', hotel: 'SAPST' },
      { id: 5, message: "Guest WiFi complaints increasing", priority: 'medium', timestamp: '3 hours ago', hotel: 'CRI' }
    ]
  });

  const { data: performanceData } = useQuery({
    queryKey: ['system-performance'],
    queryFn: () => ({
      uptime: 94.2,
      bandwidth: 78.5,
      energyEfficiency: 82.1,
      securityScore: 91.3,
      guestSatisfaction: 87.6
    })
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeTrends = (data: any) => {
    const trends = [];
    if (data.monthlyTrend < 0) {
      trends.push(`Costs increased by ${Math.abs(data.monthlyTrend)}% this month`);
    } else {
      trends.push(`Costs decreased by ${data.monthlyTrend}% this month`);
    }
    
    if (data.yearToDate < -10) {
      trends.push('Year-to-date performance below target');
    }
    
    return trends;
  };

  const generatePredictions = (data: any) => {
    const predictions = [];
    if (data.monthlyTrend < 0) {
      predictions.push('If current trend continues, monthly costs could reach $135,000 by next month');
    }
    if (data.systemPerformance < 95) {
      predictions.push('System performance may drop below 90% within 2 weeks if issues persist');
    }
    return predictions;
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerInput = userInput.toLowerCase();
    let response = '';
    let insights: string[] = [];
    let recommendations: string[] = [];
    let data: any = {};
    let priority: 'high' | 'medium' | 'low' = 'medium';

    // Update conversation context
    setConversationContext(prev => [...prev, userInput]);

    if (lowerInput.includes('cost') || lowerInput.includes('financial') || lowerInput.includes('revenue')) {
      const trends = analyzeTrends(dashboardData);
      const predictions = generatePredictions(dashboardData);
      
      response = `Based on current financial data, your total costs are ${formatCurrency(dashboardData?.totalCost || 0, currency)} with revenue of ${formatCurrency(dashboardData?.totalRevenue || 0, currency)}. This results in a net loss of ${formatCurrency(Math.abs(dashboardData?.profit || 0), currency)}. Your monthly power consumption costs are ${formatCurrency(estimatedMonthlyCost, currency)}.`;
      
      insights = [
        `Costs exceed revenue by ${Math.round((Math.abs(dashboardData?.profit || 0) / (dashboardData?.totalRevenue || 1)) * 100)}%`,
        'WiFi infrastructure is highest cost driver (35.3%)',
        `Monthly power costs: ${formatCurrency(estimatedMonthlyCost, currency)}`,
        ...trends,
        ...predictions
      ];
      
      recommendations = [
        'Review WiFi infrastructure costs for optimization opportunities',
        'Implement energy efficiency measures to reduce operational costs',
        'Consider revenue optimization strategies to improve profitability',
        'Analyze cost breakdown to identify savings potential',
        'Optimize power consumption to reduce monthly energy costs'
      ];
      
      data = { financial: dashboardData, power: { cost: estimatedMonthlyCost, currency } };
      priority = 'high';
      
    } else if (lowerInput.includes('alert') || lowerInput.includes('issue') || lowerInput.includes('problem')) {
      response = `You currently have ${dashboardData?.activeAlerts || 0} active alerts. Critical issues include WiFi network problems, power system overload, and security camera failures.`;
      
             insights = [
         '3 critical alerts require immediate attention',
         '5 warnings need monitoring',
         `System performance at ${dashboardData?.systemPerformance || 0}%`,
         'Most critical: WiFi network down in Fairmont',
         'Power system overload could affect multiple hotels'
       ];
      
      recommendations = [
        'Address WiFi issues first - highest guest impact',
        'Schedule power system review within 24 hours',
        'Update security camera firmware to prevent failures',
        'Implement proactive monitoring for critical systems'
      ];
      
      priority = 'high';
      
    } else if (lowerInput.includes('staff') || lowerInput.includes('team') || lowerInput.includes('communication')) {
      const highPriorityIssues = staffData?.filter((item: any) => item.priority === 'high').length || 0;
      
      response = `Staff communications show ${staffData?.length || 0} recent issues, with ${highPriorityIssues} high-priority items. The team is reporting WiFi connectivity problems, completed maintenance, and security camera needs.`;
      
             insights = [
         'WiFi issues affecting guest experience in Fairmont and SAPST',
         'Maintenance tasks completed successfully in Savoy',
         'Security infrastructure needs attention in RITZ',
         'Energy consumption spike detected recently in SAPST',
         'Guest WiFi complaints increasing in CRI'
       ];
      
      recommendations = [
        'Prioritize WiFi resolution for guest satisfaction',
        'Acknowledge maintenance completion to boost team morale',
        'Plan security camera upgrades systematically',
        'Investigate energy consumption spike',
        'Address guest WiFi complaints proactively'
      ];
      
      data = { staff: staffData };
      priority = 'medium';
      
    } else if (lowerInput.includes('performance') || lowerInput.includes('optimization') || lowerInput.includes('efficiency')) {
      response = `Your system performance is currently at ${dashboardData?.systemPerformance || 0}%. There are opportunities for optimization in energy usage, bandwidth allocation, and infrastructure consolidation.`;
      
      insights = [
        `Energy efficiency can save 15-20% (current score: ${performanceData?.energyEfficiency || 0}%)`,
        `Bandwidth optimization potential (current usage: ${performanceData?.bandwidth || 0}%)`,
        'Infrastructure consolidation benefits available',
        `Security score: ${performanceData?.securityScore || 0}%`,
        `Guest satisfaction: ${performanceData?.guestSatisfaction || 0}%`
      ];
      
      recommendations = [
        'Implement smart power management systems',
        'Optimize bandwidth allocation based on usage patterns',
        'Consider infrastructure consolidation for cost savings',
        'Enhance security monitoring and response',
        'Improve guest WiFi experience'
      ];
      
      data = { performance: performanceData };
      priority = 'medium';
      
    } else if (lowerInput.includes('power') || lowerInput.includes('energy') || lowerInput.includes('consumption') || lowerInput.includes('electricity')) {
      const currentUsage = powerConsumption?.totalUsage || 8.4;
      const monthlyCost = estimatedMonthlyCost;
      
      response = `Current power consumption is ${currentUsage} kW with a monthly cost estimate of ${formatCurrency(monthlyCost, currency)}. This represents your energy usage across all hotel systems and infrastructure.`;
      
      insights = [
        `Current power usage: ${currentUsage} kW average`,
        `Monthly energy cost: ${formatCurrency(monthlyCost, currency)}`,
        `Energy efficiency score: ${performanceData?.energyEfficiency || 0}%`,
        'Power consumption affects operational costs significantly',
        'Energy optimization can reduce monthly costs by 15-20%'
      ];
      
      recommendations = [
        'Monitor power usage patterns for optimization opportunities',
        'Implement smart power management systems',
        'Consider energy-efficient equipment upgrades',
        'Set up automated power monitoring and alerts',
        'Develop energy conservation strategies'
      ];
      
      data = { power: { usage: currentUsage, cost: monthlyCost, currency } };
      priority = 'medium';
      
    } else if (lowerInput.includes('trend') || lowerInput.includes('analysis') || lowerInput.includes('overview')) {
      response = `Here's a comprehensive overview of your current situation: Financial performance shows challenges, system performance is stable, and there are several optimization opportunities available.`;
      
      insights = [
        'Financial: Costs exceed revenue by significant margin',
        'System: 94.2% uptime with room for improvement',
        'Staff: 3 high-priority issues requiring attention',
        'Alerts: 8 active issues across all hotels',
        'Optimization: 15-20% energy savings potential'
      ];
      
      recommendations = [
        'Focus on cost optimization first',
        'Address critical alerts immediately',
        'Implement energy efficiency measures',
        'Review staff workload and priorities',
        'Plan long-term infrastructure improvements'
      ];
      
      priority = 'high';
      
    } else {
      response = "I can help you with financial analysis, alert management, staff communications, performance optimization, and trend analysis. What specific area would you like to focus on?";
      insights = ['Dashboard data available', 'Real-time monitoring active', 'Staff communications tracked', 'Performance metrics ready'];
      recommendations = ['Ask about specific metrics', 'Request staff summaries', 'Get optimization suggestions', 'Analyze trends and patterns'];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      insights,
      recommendations,
      data,
      priority
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Financial Summary', query: 'Show me the current financial status and cost analysis', icon: TrendingDown },
    { label: 'Alert Overview', query: 'What are the current critical alerts and issues?', icon: AlertTriangle },
    { label: 'Staff Issues', query: 'Summarize recent staff communications and issues', icon: Users },
    { label: 'Performance', query: 'How is system performance and what optimizations are available?', icon: BarChart3 },
    { label: 'Power Consumption', query: 'What is the current power consumption and energy costs?', icon: Zap },
    { label: 'Trend Analysis', query: 'Analyze current trends and provide predictions', icon: TrendingUp }
  ];

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    // Auto-send the quick action
    setTimeout(() => {
      setInputValue('');
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: query,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      generateAIResponse(query).then(aiResponse => {
        setMessages(prev => [...prev, aiResponse]);
      });
    }, 100);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        <Brain className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl border-0 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <CardTitle className="text-lg">AI Strategic Advisor</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-blue-500"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-blue-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-blue-100">Intelligent insights & strategic recommendations</p>
        </CardHeader>

                 {!isMinimized && (
           <>
             <CardContent className="p-0 h-full flex flex-col">
               {/* Messages */}
               <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.insights && message.type === 'ai' && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                              <Lightbulb className="h-3 w-3 mr-1 text-blue-500" />
                              Key Insights:
                            </p>
                            <ul className="text-xs space-y-1">
                              {message.insights.map((insight, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-blue-500">•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {message.recommendations && message.type === 'ai' && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                              <Target className="h-3 w-3 mr-1 text-green-500" />
                              Strategic Recommendations:
                            </p>
                            <ul className="text-xs space-y-1">
                              {message.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-green-500">→</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs opacity-70">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.priority && (
                            <Badge 
                              variant={message.priority === 'high' ? 'destructive' : message.priority === 'medium' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {message.priority} priority
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">AI is analyzing data...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                             </ScrollArea>

               {/* Quick Actions */}
               <div className="p-3 border-t bg-gray-50">
                 <p className="text-xs font-medium text-gray-600 mb-2">Quick Actions:</p>
                 <div className="flex flex-wrap gap-1">
                   {quickActions.map((action, index) => {
                     const Icon = action.icon;
                     return (
                       <Button
                         key={index}
                         variant="outline"
                         size="sm"
                         onClick={() => handleQuickAction(action.query)}
                         className="text-xs h-7 px-2"
                       >
                         <Icon className="h-3 w-3 mr-1" />
                         {action.label}
                       </Button>
                     );
                   })}
                 </div>
               </div>

               {/* Input */}
               <div className="p-3 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about costs, alerts, staff issues, performance, or trends..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
