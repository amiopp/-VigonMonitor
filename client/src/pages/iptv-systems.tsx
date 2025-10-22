import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PageTransition, { StaggeredContainer, StaggeredItem } from '@/components/ui/PageTransition';
import ResponsiveWrapper, { ResponsiveGrid } from '@/components/ui/ResponsiveWrapper';
import { useToast } from '@/hooks/use-toast';
import { 
  Tv, 
  Signal, 
  Volume2, 
  Settings, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Monitor,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

export default function IPTVSystems() {
  const [location] = useLocation();
  const [selectedHotel, setSelectedHotel] = useState('all');
  const { toast } = useToast();

  // Button handlers
  const handleChannelAction = (action: string, channelName: string) => {
    toast({
      title: "Channel Action",
      description: `${action} action performed on ${channelName}`,
    });
  };

  const handleNetworkDiagnostic = (action: string) => {
    toast({
      title: "Network Diagnostic",
      description: `${action} diagnostic completed successfully`,
    });
  };

  const handleAudioAction = (action: string) => {
    toast({
      title: "Audio Management",
      description: `${action} action completed`,
    });
  };

  const handleSchedulingAction = (action: string) => {
    toast({
      title: "Scheduling",
      description: `${action} action completed`,
    });
  };

  // Mock hotel data
  const hotels = [
    { id: 'fairmont', name: 'Fairmont', location: 'Downtown' },
    { id: 'savoy', name: 'Savoy', location: 'City Center' },
    { id: 'ritz', name: 'RITZ', location: 'Business District' },
    { id: 'sapst', name: 'SAPST', location: 'Airport Area' },
    { id: 'cri', name: 'CRI FS', location: 'Financial District' },
    { id: 'alithya', name: 'Alithya', location: 'Tech Hub' },
    { id: 'madef', name: 'Madef', location: 'Shopping District' },
    { id: 'essaadi', name: 'Es Saadi Palace Kenzy', location: 'Historic Quarter' },
    { id: 'marriott', name: 'Marriott', location: 'Convention Center' },
    { id: 'radisson', name: 'Radisson', location: 'Waterfront' }
  ];

  // Mock data for IPTV systems
  const iptvData = {
    overview: {
      totalChannels: 120,
      activeChannels: 118,
      hdChannels: 85,
      sdChannels: 35,
      uptime: '99.9%',
      status: 'healthy',
      activeUsers: 234,
      bandwidth: '2.4 GB/s'
    },
    channels: [
      { id: 1, name: 'CNN International', category: 'News', quality: 'HD', status: 'active', viewers: 45, bitrate: '8 Mbps' },
      { id: 2, name: 'BBC World News', category: 'News', quality: 'HD', status: 'active', viewers: 38, bitrate: '8 Mbps' },
      { id: 3, name: 'ESPN', category: 'Sports', quality: 'HD', status: 'active', viewers: 67, bitrate: '10 Mbps' },
      { id: 4, name: 'Discovery Channel', category: 'Documentary', quality: 'HD', status: 'active', viewers: 29, bitrate: '8 Mbps' },
      { id: 5, name: 'HBO', category: 'Entertainment', quality: 'HD', status: 'maintenance', viewers: 0, bitrate: '0 Mbps' },
      { id: 6, name: 'Cartoon Network', category: 'Kids', quality: 'SD', status: 'active', viewers: 23, bitrate: '4 Mbps' }
    ],
    categories: [
      { name: 'News', count: 15, active: 15 },
      { name: 'Sports', count: 25, active: 25 },
      { name: 'Entertainment', count: 35, active: 33 },
      { name: 'Documentary', count: 20, active: 20 },
      { name: 'Kids', count: 15, active: 15 },
      { name: 'Movies', count: 10, active: 10 }
    ],
    performance: {
      bandwidth: 85,
      quality: 92,
      stability: 98,
      userSatisfaction: 89
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'HD': return 'bg-blue-100 text-blue-800';
      case 'SD': return 'bg-gray-100 text-gray-800';
      case '4K': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <div className="mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">IPTV Systems</h1>
                      <p className="text-gray-600">Monitor and manage IPTV infrastructure, channels, and performance across all hotels</p>
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel IPTV Systems</h2>
                    <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
                      {hotels.map((hotel, index) => (
                        <motion.div
                          key={hotel.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <Tv className="h-5 w-5 text-blue-600" />
                                <span>{hotel.name}</span>
                              </CardTitle>
                              <p className="text-sm text-gray-500">{hotel.location}</p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Total Channels:</span>
                                  <span className="font-semibold">{iptvData.overview.totalChannels}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Active Users:</span>
                                  <span className="font-semibold">{iptvData.overview.activeUsers}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Bandwidth:</span>
                                  <span className="font-semibold">{iptvData.overview.bandwidth}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Uptime:</span>
                                  <span className="font-semibold text-green-600">{iptvData.overview.uptime}</span>
                                </div>
                                <div className="pt-2 border-t">
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Online
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </ResponsiveGrid>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <ResponsiveGrid cols={{ sm: 1, lg: 2 }} gap="lg" className="mb-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span>System Performance</span>
                          </CardTitle>
                        </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Bandwidth Utilization</span>
                    <span className="text-sm font-medium">{iptvData.performance.bandwidth}%</span>
                  </div>
                  <Progress value={iptvData.performance.bandwidth} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Stream Quality</span>
                    <span className="text-sm font-medium">{iptvData.performance.quality}%</span>
                  </div>
                  <Progress value={iptvData.performance.quality} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">System Stability</span>
                    <span className="text-sm font-medium">{iptvData.performance.stability}%</span>
                  </div>
                  <Progress value={iptvData.performance.stability} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">User Satisfaction</span>
                    <span className="text-sm font-medium">{iptvData.performance.userSatisfaction}%</span>
                  </div>
                  <Progress value={iptvData.performance.userSatisfaction} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Tv className="h-5 w-5 text-purple-600" />
                          <span>Channel Categories</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {iptvData.categories.map((category, index) => (
                            <motion.div
                              key={category.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-600">{category.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{category.active}/{category.count}</span>
                                <Badge className={category.active === category.count ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {category.active === category.count ? 'All Active' : 'Partial'}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ResponsiveGrid>
              </StaggeredItem>

              <StaggeredItem>
                <Card className="mb-8 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  <span>Channel Management</span>
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Start All
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause All
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Channel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Quality</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Viewers</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bitrate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iptvData.channels.map((channel, index) => (
                      <motion.tr
                        key={channel.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Tv className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{channel.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{channel.category}</td>
                        <td className="py-3 px-4">
                          <Badge className={getQualityColor(channel.quality)}>
                            {channel.quality}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(channel.status)}>
                            {channel.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{channel.viewers}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{channel.bitrate}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleChannelAction('Play', channel.name)}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleChannelAction('Pause', channel.name)}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleChannelAction('Configure', channel.name)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </StaggeredItem>

        <StaggeredItem>
          <ResponsiveGrid cols={{ sm: 1, md: 3 }} gap="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span>Network Diagnostics</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkDiagnostic('Bandwidth Test')}
                >
                  <Signal className="h-4 w-4 mr-2" />
                  Test Bandwidth
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkDiagnostic('Connectivity Check')}
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Check Connectivity
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkDiagnostic('Error Logs')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Error Logs
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-green-600" />
                  <span>Audio Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAudioAction('Audio Settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Audio Settings
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAudioAction('Volume Control')}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Volume Control
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAudioAction('Audio Test')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Audio Test
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Scheduling</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSchedulingAction('Program Guide')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Program Guide
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSchedulingAction('Auto-start')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Auto-start
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSchedulingAction('Auto-stop')}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Auto-stop
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
