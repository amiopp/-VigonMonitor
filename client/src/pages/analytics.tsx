import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Wifi, 
  Shield, 
  Server, 
  Tv, 
  Activity,
  Calendar,
  Download,
  Upload,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageTransition, { StaggeredContainer, StaggeredItem } from '@/components/ui/PageTransition';
import ResponsiveWrapper, { ResponsiveGrid } from '@/components/ui/ResponsiveWrapper';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const mockMetrics: MetricData[] = [
  {
    label: 'Network Uptime',
    value: 99.8,
    unit: '%',
    change: 0.2,
    trend: 'up',
    color: 'text-green-600'
  },
  {
    label: 'WiFi Performance',
    value: 94.5,
    unit: '%',
    change: -1.2,
    trend: 'down',
    color: 'text-orange-600'
  },
  {
    label: 'Security Score',
    value: 98.7,
    unit: '%',
    change: 0.8,
    trend: 'up',
    color: 'text-blue-600'
  },
  {
    label: 'System Response',
    value: 156,
    unit: 'ms',
    change: -12,
    trend: 'up',
    color: 'text-purple-600'
  }
];

const mockNetworkData: ChartData[] = [
  { name: 'Guest WiFi', value: 45, color: '#3B82F6' },
  { name: 'Staff WiFi', value: 25, color: '#10B981' },
  { name: 'Management', value: 15, color: '#F59E0B' },
  { name: 'IoT Devices', value: 10, color: '#8B5CF6' },
  { name: 'Security', value: 5, color: '#EF4444' }
];

const mockSecurityData = [
  { month: 'Jan', incidents: 12, resolved: 11, pending: 1 },
  { month: 'Feb', incidents: 8, resolved: 8, pending: 0 },
  { month: 'Mar', incidents: 15, resolved: 14, pending: 1 },
  { month: 'Apr', incidents: 6, resolved: 6, pending: 0 },
  { month: 'May', incidents: 9, resolved: 8, pending: 1 },
  { month: 'Jun', incidents: 11, resolved: 10, pending: 1 }
];

const mockPerformanceData = [
  { time: '00:00', cpu: 45, memory: 62, network: 78 },
  { time: '04:00', cpu: 38, memory: 58, network: 65 },
  { time: '08:00', cpu: 72, memory: 81, network: 89 },
  { time: '12:00', cpu: 85, memory: 88, network: 92 },
  { time: '16:00', cpu: 78, memory: 82, network: 87 },
  { time: '20:00', cpu: 65, memory: 71, network: 79 },
  { time: '24:00', cpu: 52, memory: 66, network: 73 }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [metrics, setMetrics] = useState<MetricData[]>(mockMetrics);
  const [networkData, setNetworkData] = useState<ChartData[]>(mockNetworkData);
  const [securityData, setSecurityData] = useState(mockSecurityData);
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-yellow-600';
    if (value >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceBgColor = (value: number) => {
    if (value >= 90) return 'bg-green-100';
    if (value >= 75) return 'bg-yellow-100';
    if (value >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

  // Update data based on time range
  useEffect(() => {
    const updateDataForTimeRange = () => {
      switch (timeRange) {
        case '24h':
          setMetrics([
            { ...mockMetrics[0], value: 99.9, change: 0.1 },
            { ...mockMetrics[1], value: 96.2, change: 1.7 },
            { ...mockMetrics[2], value: 99.1, change: 0.4 },
            { ...mockMetrics[3], value: 142, change: -14 }
          ]);
          setPerformanceData([
            { time: '00:00', cpu: 45, memory: 62, network: 78 },
            { time: '04:00', cpu: 38, memory: 58, network: 65 },
            { time: '08:00', cpu: 72, memory: 81, network: 89 },
            { time: '12:00', cpu: 85, memory: 88, network: 92 },
            { time: '16:00', cpu: 78, memory: 82, network: 87 },
            { time: '20:00', cpu: 65, memory: 71, network: 79 },
            { time: '24:00', cpu: 52, memory: 66, network: 73 }
          ]);
          break;
        case '7d':
          setMetrics(mockMetrics);
          setPerformanceData(mockPerformanceData);
          break;
        case '30d':
          setMetrics([
            { ...mockMetrics[0], value: 99.5, change: -0.3 },
            { ...mockMetrics[1], value: 92.8, change: -1.7 },
            { ...mockMetrics[2], value: 97.9, change: -0.8 },
            { ...mockMetrics[3], value: 168, change: 12 }
          ]);
          setPerformanceData([
            { time: 'Week 1', cpu: 65, memory: 75, network: 82 },
            { time: 'Week 2', cpu: 58, memory: 68, network: 76 },
            { time: 'Week 3', cpu: 72, memory: 81, network: 85 },
            { time: 'Week 4', cpu: 61, memory: 70, network: 79 }
          ]);
          break;
        case '90d':
          setMetrics([
            { ...mockMetrics[0], value: 99.2, change: -0.6 },
            { ...mockMetrics[1], value: 90.1, change: -4.4 },
            { ...mockMetrics[2], value: 96.5, change: -2.2 },
            { ...mockMetrics[3], value: 175, change: 19 }
          ]);
          setPerformanceData([
            { time: 'Month 1', cpu: 68, memory: 78, network: 84 },
            { time: 'Month 2', cpu: 62, memory: 72, network: 79 },
            { time: 'Month 3', cpu: 70, memory: 80, network: 87 }
          ]);
          break;
      }
    };

    updateDataForTimeRange();
  }, [timeRange]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <ResponsiveWrapper padding="lg">
              <StaggeredContainer>
          <StaggeredItem>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive insights into hotel IT infrastructure performance and trends</p>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Time Range:</span>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg" className="mb-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${getPerformanceBgColor(metric.value)}`}>
                          {metric.label.includes('Network') && <Wifi className="h-5 w-5 text-blue-600" />}
                          {metric.label.includes('WiFi') && <Wifi className="h-5 w-5 text-green-600" />}
                          {metric.label.includes('Security') && <Shield className="h-5 w-5 text-blue-600" />}
                          {metric.label.includes('System') && <Server className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {metric.value}{metric.unit}
                        </p>
                        <p className="text-sm text-gray-600">{metric.label}</p>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getPerformanceBgColor(metric.value)}`}
                          style={{ width: `${Math.min(metric.value, 100)}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </ResponsiveGrid>
          </StaggeredItem>

          <StaggeredItem>
            <ResponsiveGrid cols={{ sm: 1, lg: 2 }} gap="lg" className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Network Traffic Distribution
                  </CardTitle>
                  <p className="text-sm text-gray-600">Current network usage by category</p>
                </CardHeader>
                <CardContent>
                                     <div className="space-y-4">
                     {networkData.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${item.value}%`,
                                backgroundColor: item.color
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {item.value}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Incidents Trend
                  </CardTitle>
                  <p className="text-sm text-gray-600">Monthly security incident statistics</p>
                </CardHeader>
                <CardContent>
                                     <div className="space-y-3">
                     {securityData.map((item, index) => (
                      <motion.div
                        key={item.month}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-700 w-12">{item.month}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-gray-600">{item.incidents}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{item.resolved}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{item.pending}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </StaggeredItem>

          <StaggeredItem>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  System Performance Over Time
                </CardTitle>
                <p className="text-sm text-gray-600">Real-time system resource utilization</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-700 mb-2">Time</div>
                        <div className="text-sm font-medium text-gray-700 mb-2">CPU</div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Memory</div>
                        <div className="text-sm font-medium text-gray-700">Network</div>
                      </div>
                                             {performanceData.map((item, index) => (
                        <motion.div
                          key={item.time}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center"
                        >
                          <div className="text-sm font-medium text-gray-700 mb-2">{item.time}</div>
                          <div className={`text-sm font-medium mb-2 ${getPerformanceColor(item.cpu)}`}>
                            {item.cpu}%
                          </div>
                          <div className={`text-sm font-medium mb-2 ${getPerformanceColor(item.memory)}`}>
                            {item.memory}%
                          </div>
                          <div className={`text-sm font-medium ${getPerformanceColor(item.network)}`}>
                            {item.network}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="lg">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">WiFi Coverage</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">98.5%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Security Score</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">A+</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Uptime</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">99.9%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tv className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">IPTV Quality</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Excellent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Recent Alerts Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">High CPU Usage</span>
                      </div>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Network Latency</span>
                      </div>
                      <span className="text-xs text-gray-500">4h ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Maintenance Complete</span>
                      </div>
                      <span className="text-xs text-gray-500">6h ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Backup Successful</span>
                      </div>
                      <span className="text-xs text-gray-500">12h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </StaggeredItem>
        </StaggeredContainer>
            </ResponsiveWrapper>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
