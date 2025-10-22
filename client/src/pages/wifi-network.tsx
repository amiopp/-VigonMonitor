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
  Wifi, 
  Signal, 
  Users, 
  Shield, 
  Settings, 
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Router,
  Smartphone,
  Laptop,
  Tablet
} from 'lucide-react';

export default function WiFiNetwork() {
  const [location] = useLocation();
  const [selectedHotel, setSelectedHotel] = useState('all');
  const { toast } = useToast();

  // Button handlers
  const handleAccessPointAction = (action: string, apName: string) => {
    toast({
      title: "Access Point Action",
      description: `${action} action performed on ${apName}`,
    });
  };

  const handleDeviceAction = (action: string, deviceName: string) => {
    toast({
      title: "Device Action",
      description: `${action} action performed on ${deviceName}`,
    });
  };

  const handleNetworkAction = (action: string) => {
    toast({
      title: "Network Action",
      description: `${action} action completed successfully`,
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

  // Mock data for WiFi network
  const wifiData = {
    overview: {
      totalAccessPoints: 24,
      activeAccessPoints: 23,
      totalUsers: 156,
      activeUsers: 142,
      uptime: '99.8%',
      status: 'healthy',
      bandwidth: '2.1 GB/s',
      security: 'WPA3 Enterprise'
    },
    accessPoints: [
      { id: 1, name: 'AP-01-Lobby', location: 'Main Lobby', status: 'active', users: 23, signal: 95, channel: 6, security: 'WPA3' },
      { id: 2, name: 'AP-02-Restaurant', location: 'Restaurant', status: 'active', users: 18, signal: 88, channel: 11, security: 'WPA3' },
      { id: 3, name: 'AP-03-Pool', location: 'Pool Area', status: 'active', users: 15, signal: 92, channel: 1, security: 'WPA3' },
      { id: 4, name: 'AP-04-Floor1', location: 'Floor 1', status: 'active', users: 28, signal: 87, channel: 6, security: 'WPA3' },
      { id: 5, name: 'AP-05-Floor2', location: 'Floor 2', status: 'maintenance', users: 0, signal: 0, channel: 0, security: 'WPA3' },
      { id: 6, name: 'AP-06-Conference', location: 'Conference Room', status: 'active', users: 12, signal: 94, channel: 11, security: 'WPA3' }
    ],
    devices: [
      { id: 1, name: 'iPhone 14 Pro', type: 'smartphone', ip: '192.168.1.45', mac: 'AA:BB:CC:DD:EE:FF', signal: 92, connected: '2h 15m' },
      { id: 2, name: 'MacBook Pro', type: 'laptop', ip: '192.168.1.46', mac: '11:22:33:44:55:66', signal: 89, connected: '1h 30m' },
      { id: 3, name: 'Samsung Galaxy', type: 'smartphone', ip: '192.168.1.47', mac: 'AA:BB:CC:DD:EE:99', signal: 85, connected: '45m' },
      { id: 4, name: 'iPad Pro', type: 'tablet', ip: '192.168.1.48', mac: 'AA:BB:CC:DD:EE:88', signal: 91, connected: '3h 20m' }
    ],
    performance: {
      coverage: 94,
      speed: 89,
      stability: 96,
      security: 98
    },
    alerts: [
      { id: 1, type: 'warning', message: 'AP-05-Floor2 in maintenance mode', time: '5 min ago', priority: 'medium' },
      { id: 2, type: 'info', message: 'Network optimization completed', time: '1 hour ago', priority: 'low' },
      { id: 3, type: 'success', message: 'Security update installed', time: '2 hours ago', priority: 'low' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartphone': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Wifi className="h-4 w-4" />;
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
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">WiFi Network</h1>
                      <p className="text-gray-600">Monitor and manage WiFi infrastructure, access points, and connected devices across all hotels</p>
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel WiFi Networks</h2>
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
                                <Wifi className="h-5 w-5 text-blue-600" />
                                <span>{hotel.name}</span>
                              </CardTitle>
                              <p className="text-sm text-gray-500">{hotel.location}</p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Access Points:</span>
                                  <span className="font-semibold">{wifiData.overview.totalAccessPoints}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Connected Users:</span>
                                  <span className="font-semibold">{wifiData.overview.activeUsers}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Bandwidth:</span>
                                  <span className="font-semibold">{wifiData.overview.bandwidth}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Security:</span>
                                  <span className="font-semibold text-green-600">{wifiData.overview.security}</span>
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
                    <span>Network Performance</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Coverage</span>
                    <span className="text-sm font-medium">{wifiData.performance.coverage}%</span>
                  </div>
                  <Progress value={wifiData.performance.coverage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Speed</span>
                    <span className="text-sm font-medium">{wifiData.performance.speed}%</span>
                  </div>
                  <Progress value={wifiData.performance.speed} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Stability</span>
                    <span className="text-sm font-medium">{wifiData.performance.stability}%</span>
                  </div>
                  <Progress value={wifiData.performance.stability} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Security</span>
                    <span className="text-sm font-medium">{wifiData.performance.security}%</span>
                  </div>
                  <Progress value={wifiData.performance.security} className="h-2" />
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
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Recent Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wifiData.alerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge className={getAlertColor(alert.type)}>
                            {alert.type}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-xs text-gray-500">{alert.time} • {alert.priority} priority</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
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
                  <Router className="h-5 w-5 text-indigo-600" />
                  <span>Access Points Management</span>
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure All
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Health Check
                  </Button>
                  <Button size="sm" variant="outline">
                    <Wifi className="h-4 w-4 mr-2" />
                    Optimize
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Access Point</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Users</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Signal</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Channel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wifiData.accessPoints.map((ap, index) => (
                      <motion.tr
                        key={ap.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Wifi className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{ap.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{ap.location}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(ap.status)}>
                            {ap.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{ap.users}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{ap.signal}%</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{ap.channel || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleAccessPointAction('Configure', ap.name)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleAccessPointAction('Monitor', ap.name)}
                            >
                              <Activity className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleAccessPointAction('Locate', ap.name)}
                            >
                              <MapPin className="h-3 w-3" />
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
          {/* Connected Devices */}
          <Card className="mb-8 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Connected Devices</span>
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Scan
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Device</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">IP Address</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">MAC Address</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Signal</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Connected</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wifiData.devices.map((device, index) => (
                      <motion.tr
                        key={device.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(device.type)}
                            <span className="font-medium text-gray-900">{device.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 capitalize">{device.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 font-mono">{device.ip}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 font-mono">{device.mac}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{device.signal}%</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{device.connected}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeviceAction('Monitor', device.name)}
                            >
                              <Activity className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeviceAction('Secure', device.name)}
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeviceAction('Configure', device.name)}
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
                    <Signal className="h-5 w-5 text-blue-600" />
                    <span>Network Diagnostics</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Speed Test')}
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Speed Test
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Coverage Map')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Coverage Map
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Interference Check')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Interference Check
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
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Security Audit')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('User Management')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Access Logs')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Access Logs
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
                  <Settings className="h-5 w-5 text-orange-600" />
                  <span>Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('AP Settings')}
                >
                  <Router className="h-4 w-4 mr-2" />
                  AP Settings
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Channel Plan')}
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Channel Plan
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNetworkAction('Auto-Config')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Auto-Config
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
