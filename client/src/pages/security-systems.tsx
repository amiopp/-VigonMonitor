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
  Shield, 
  Camera, 
  Lock, 
  AlertTriangle, 
  Users, 
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  BarChart3,
  Eye,
  Key,
  Bell,
  Settings,
  Wrench
} from 'lucide-react';

export default function SecuritySystems() {
  const [location] = useLocation();
  const [selectedHotel, setSelectedHotel] = useState('all');
  const { toast } = useToast();

  // Button handlers
  const handleCameraAction = (action: string, cameraName: string) => {
    toast({
      title: "Camera Action",
      description: `${action} action performed on ${cameraName}`,
    });
  };

  const handleSensorAction = (action: string, sensorName: string) => {
    toast({
      title: "Sensor Action",
      description: `${action} action performed on ${sensorName}`,
    });
  };

  const handleSecurityAction = (action: string) => {
    toast({
      title: "Security Action",
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

  // Mock data for security systems
  const securityData = {
    overview: {
      totalCameras: 45,
      activeCameras: 43,
      totalSensors: 28,
      activeSensors: 27,
      uptime: '98.5%',
      status: 'warning',
      alerts: 2,
      securityLevel: 'High'
    },
    cameras: [
      { id: 1, name: 'CAM-01-Lobby', location: 'Main Lobby', status: 'active', recording: true, motion: false, quality: 'HD', storage: '85%' },
      { id: 2, name: 'CAM-02-Entrance', location: 'Main Entrance', status: 'active', recording: true, motion: true, quality: 'HD', storage: '92%' },
      { id: 3, name: 'CAM-03-Parking', location: 'Parking Lot', status: 'active', recording: true, motion: false, quality: 'HD', storage: '78%' },
      { id: 4, name: 'CAM-04-Pool', location: 'Pool Area', status: 'maintenance', recording: false, motion: false, quality: 'N/A', storage: '0%' },
      { id: 5, name: 'CAM-05-Back', location: 'Back Entrance', status: 'active', recording: true, motion: false, quality: 'HD', storage: '88%' },
      { id: 6, name: 'CAM-06-Elevator', location: 'Elevator 1', status: 'active', recording: true, motion: false, quality: 'HD', storage: '91%' }
    ],
    sensors: [
      { id: 1, name: 'SENS-01-Lobby', type: 'Motion', location: 'Main Lobby', status: 'active', sensitivity: 'High', lastTrigger: '2 hours ago' },
      { id: 2, name: 'SENS-02-Entrance', type: 'Door', location: 'Main Entrance', status: 'active', sensitivity: 'Medium', lastTrigger: '15 min ago' },
      { id: 3, name: 'SENS-03-Parking', type: 'Motion', location: 'Parking Lot', status: 'active', sensitivity: 'Medium', lastTrigger: '1 hour ago' },
      { id: 4, name: 'SENS-04-Back', type: 'Door', location: 'Back Entrance', status: 'active', sensitivity: 'High', lastTrigger: 'Never' }
    ],
    alerts: [
      { id: 1, type: 'warning', message: 'CAM-04-Pool in maintenance mode', time: '5 min ago', priority: 'medium', location: 'Pool Area' },
      { id: 2, type: 'info', message: 'Motion detected at Main Entrance', time: '15 min ago', priority: 'low', location: 'Main Entrance' },
      { id: 3, type: 'success', message: 'Security update completed', time: '2 hours ago', priority: 'low', location: 'System-wide' }
    ],
    performance: {
      coverage: 96,
      detection: 94,
      recording: 98,
      storage: 87
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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'Motion': return <Eye className="h-4 w-4" />;
      case 'Door': return <Key className="h-4 w-4" />;
      case 'Window': return <Shield className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
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
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Systems</h1>
                      <p className="text-gray-600">Monitor and manage security infrastructure, cameras, and sensors across all hotels</p>
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Security Systems</h2>
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
                                <Shield className="h-5 w-5 text-blue-600" />
                                <span>{hotel.name}</span>
                              </CardTitle>
                              <p className="text-sm text-gray-500">{hotel.location}</p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Security Cameras:</span>
                                  <span className="font-semibold">{securityData.overview.totalCameras}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Security Sensors:</span>
                                  <span className="font-semibold">{securityData.overview.totalSensors}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Active Alerts:</span>
                                  <span className="font-semibold">{securityData.overview.alerts}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Security Level:</span>
                                  <span className="font-semibold text-green-600">{securityData.overview.securityLevel}</span>
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
                    <span className="text-sm text-gray-600">Coverage</span>
                    <span className="text-sm font-medium">{securityData.performance.coverage}%</span>
                  </div>
                  <Progress value={securityData.performance.coverage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Detection Rate</span>
                    <span className="text-sm font-medium">{securityData.performance.detection}%</span>
                  </div>
                  <Progress value={securityData.performance.detection} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Recording Quality</span>
                    <span className="text-sm font-medium">{securityData.performance.recording}%</span>
                  </div>
                  <Progress value={securityData.performance.recording} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Storage Health</span>
                    <span className="text-sm font-medium">{securityData.performance.storage}%</span>
                  </div>
                  <Progress value={securityData.performance.storage} className="h-2" />
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
                    {securityData.alerts.map((alert, index) => (
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
                            <p className="text-xs text-gray-500">{alert.location} • {alert.time} • {alert.priority} priority</p>
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
                  <Camera className="h-5 w-5 text-indigo-600" />
                  <span>Security Cameras</span>
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
                    <Eye className="h-4 w-4 mr-2" />
                    Live View
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Camera</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Recording</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Motion</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Quality</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Storage</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityData.cameras.map((camera, index) => (
                      <motion.tr
                        key={camera.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Camera className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{camera.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{camera.location}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(camera.status)}>
                            {camera.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={camera.recording ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {camera.recording ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={camera.motion ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}>
                            {camera.motion ? 'Detected' : 'None'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{camera.quality}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{camera.storage}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleCameraAction('View', camera.name)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleCameraAction('Configure', camera.name)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleCameraAction('Monitor', camera.name)}
                            >
                              <Activity className="h-3 w-3" />
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
          {/* Security Sensors */}
          <Card className="mb-8 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Security Sensors</span>
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure All
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Test All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sensor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sensitivity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Trigger</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityData.sensors.map((sensor, index) => (
                      <motion.tr
                        key={sensor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {getSensorIcon(sensor.type)}
                            <span className="font-medium text-gray-900">{sensor.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{sensor.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{sensor.location}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(sensor.status)}>
                            {sensor.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={
                            sensor.sensitivity === 'High' ? 'bg-red-100 text-red-800' :
                            sensor.sensitivity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {sensor.sensitivity}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{sensor.lastTrigger}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleSensorAction('Configure', sensor.name)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleSensorAction('Monitor', sensor.name)}
                            >
                              <Activity className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleSensorAction('Maintain', sensor.name)}
                            >
                              <Wrench className="h-3 w-3" />
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
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span>Monitoring</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('Live Feed')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Live Feed
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('Motion Alerts')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Motion Alerts
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('Coverage Map')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Coverage Map
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
                  onClick={() => handleSecurityAction('Access Control')}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Access Control
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('Alert Settings')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Alert Settings
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('User Permissions')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  User Permissions
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
                  onClick={() => handleSecurityAction('Camera Settings')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera Settings
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('Sensor Config')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Sensor Config
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSecurityAction('Schedule')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
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
