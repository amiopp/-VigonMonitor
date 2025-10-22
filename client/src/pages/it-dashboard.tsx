import React from 'react';
import { useLocation } from 'wouter';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { 
  Wifi, 
  Tv, 
  Shield, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Activity,
  Signal,
  Cpu,
  HardDrive,
  Database
} from 'lucide-react';

export default function ITDashboard() {
  const [location] = useLocation();

  // Mock data for IT infrastructure
  const systemStatus = {
    wifi: { status: 'healthy', uptime: '99.8%', users: 156, performance: 'excellent' },
    iptv: { status: 'healthy', uptime: '99.9%', channels: 120, quality: 'HD' },
    security: { status: 'warning', uptime: '98.5%', cameras: 45, alerts: 2 }
  };

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'Security camera 3B offline', time: '2 min ago', system: 'Security' },
    { id: 2, type: 'info', message: 'WiFi optimization completed', time: '15 min ago', system: 'WiFi' },
    { id: 3, type: 'success', message: 'Backup completed successfully', time: '1 hour ago', system: 'Infrastructure' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel IT Infrastructure Dashboard</h1>
            <p className="text-gray-600">Monitor and manage all IT systems across the hotel network</p>
          </div>

          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* WiFi Network */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-blue-600" />
                  <span>WiFi Network</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(systemStatus.wifi.status)}>
                      {systemStatus.wifi.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="font-semibold">{systemStatus.wifi.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-semibold">{systemStatus.wifi.users}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Performance</span>
                    <span className="font-semibold text-green-600">{systemStatus.wifi.performance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IPTV Systems */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Tv className="h-5 w-5 text-purple-600" />
                  <span>IPTV Systems</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(systemStatus.iptv.status)}>
                      {systemStatus.iptv.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="font-semibold">{systemStatus.iptv.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Channels</span>
                    <span className="font-semibold">{systemStatus.iptv.channels}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality</span>
                    <span className="font-semibold text-purple-600">{systemStatus.iptv.quality}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Systems */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Security Systems</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(systemStatus.security.status)}>
                      {systemStatus.security.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="font-semibold">{systemStatus.security.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cameras</span>
                    <span className="font-semibold">{systemStatus.security.cameras}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Alerts</span>
                    <span className="font-semibold text-yellow-600">{systemStatus.security.alerts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline" size="sm">
                    <Signal className="h-4 w-4 mr-2" />
                    Network Scan
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    <Cpu className="h-4 w-4 mr-2" />
                    System Health Check
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Backup Status
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Performance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getAlertColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.system} • {alert.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>System Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Health</span>
                    <span className="text-lg font-bold text-green-600">98.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.7%' }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">99.2%</p>
                      <p className="text-xs text-gray-500">Network Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">97.8%</p>
                      <p className="text-xs text-gray-500">Service Quality</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">96.5%</p>
                      <p className="text-xs text-gray-500">Security Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">94.3%</p>
                      <p className="text-xs text-gray-500">Efficiency</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </main>
      </div>
      
    </div>
  );
}
