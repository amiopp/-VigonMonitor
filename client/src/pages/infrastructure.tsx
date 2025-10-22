import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Network, 
  Database, 
  HardDrive, 
  Cpu, 
  Memory, 
  Activity,
  Calendar,
  Settings,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Layers,
  GitBranch,
  Shield,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageTransition, { StaggeredContainer, StaggeredItem } from '@/components/ui/PageTransition';
import ResponsiveWrapper, { ResponsiveGrid } from '@/components/ui/ResponsiveWrapper';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

interface InfrastructureComponent {
  id: string;
  name: string;
  type: 'server' | 'network' | 'storage' | 'database' | 'security';
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  location: string;
  uptime: number;
  lastMaintenance: string;
  nextMaintenance: string;
  health: number;
  capacity: number;
  used: number;
}

interface NetworkTopology {
  id: string;
  name: string;
  type: 'core' | 'distribution' | 'access' | 'edge';
  connections: string[];
  bandwidth: string;
  latency: number;
  status: 'active' | 'inactive' | 'degraded';
}

const mockInfrastructure: InfrastructureComponent[] = [
  {
    id: '1',
    name: 'Main Data Center Server',
    type: 'server',
    status: 'online',
    location: 'Data Center A',
    uptime: 99.9,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    health: 95,
    capacity: 1000,
    used: 650
  },
  {
    id: '2',
    name: 'Network Core Switch',
    type: 'network',
    status: 'online',
    location: 'Network Room B',
    uptime: 99.8,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    health: 92,
    capacity: 100,
    used: 78
  },
  {
    id: '3',
    name: 'Storage Array SAN-01',
    type: 'storage',
    status: 'online',
    location: 'Storage Room C',
    uptime: 99.7,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    health: 88,
    capacity: 5000,
    used: 3200
  },
  {
    id: '4',
    name: 'Database Cluster DB-01',
    type: 'database',
    status: 'online',
    location: 'Data Center A',
    uptime: 99.9,
    lastMaintenance: '2024-01-12',
    nextMaintenance: '2024-04-12',
    health: 96,
    capacity: 500,
    used: 280
  },
  {
    id: '5',
    name: 'Firewall FW-01',
    type: 'security',
    status: 'warning',
    location: 'Security Room D',
    uptime: 99.5,
    lastMaintenance: '2024-01-08',
    nextMaintenance: '2024-04-08',
    health: 75,
    capacity: 100,
    used: 85
  },
  {
    id: '6',
    name: 'Backup Server',
    type: 'server',
    status: 'maintenance',
    location: 'Data Center B',
    uptime: 98.2,
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-04-25',
    health: 60,
    capacity: 800,
    used: 450
  }
];

const mockNetworkTopology: NetworkTopology[] = [
  {
    id: '1',
    name: 'Core Router',
    type: 'core',
    connections: ['Distribution Switch 1', 'Distribution Switch 2', 'Internet Gateway'],
    bandwidth: '10 Gbps',
    latency: 2,
    status: 'active'
  },
  {
    id: '2',
    name: 'Distribution Switch 1',
    type: 'distribution',
    connections: ['Core Router', 'Access Switch A', 'Access Switch B'],
    bandwidth: '1 Gbps',
    latency: 5,
    status: 'active'
  },
  {
    id: '3',
    name: 'Access Switch A',
    type: 'access',
    connections: ['Distribution Switch 1', 'Floor 1 Devices', 'Floor 2 Devices'],
    bandwidth: '100 Mbps',
    latency: 8,
    status: 'active'
  },
  {
    id: '4',
    name: 'Edge Firewall',
    type: 'edge',
    connections: ['Internet Gateway', 'Core Router'],
    bandwidth: '1 Gbps',
    latency: 3,
    status: 'active'
  }
];

const mockMaintenanceSchedule = [
  {
    id: '1',
    component: 'Main Data Center Server',
    type: 'Preventive Maintenance',
    scheduledDate: '2024-04-15',
    estimatedDuration: '4 hours',
    priority: 'high',
    status: 'scheduled'
  },
  {
    id: '2',
    component: 'Network Core Switch',
    type: 'Firmware Update',
    scheduledDate: '2024-04-10',
    estimatedDuration: '2 hours',
    priority: 'medium',
    status: 'scheduled'
  },
  {
    id: '3',
    component: 'Storage Array SAN-01',
    type: 'Hardware Inspection',
    scheduledDate: '2024-04-20',
    estimatedDuration: '6 hours',
    priority: 'medium',
    status: 'scheduled'
  },
  {
    id: '4',
    component: 'Backup Server',
    type: 'Emergency Repair',
    scheduledDate: '2024-01-30',
    estimatedDuration: '8 hours',
    priority: 'critical',
    status: 'in-progress'
  }
];

export default function InfrastructurePage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-5 w-5" />;
      case 'network': return <Network className="h-5 w-5" />;
      case 'storage': return <HardDrive className="h-5 w-5" />;
      case 'database': return <Database className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'server': return 'text-blue-600';
      case 'network': return 'text-green-600';
      case 'storage': return 'text-purple-600';
      case 'database': return 'text-orange-600';
      case 'security': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 75) return 'text-yellow-600';
    if (health >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredInfrastructure = mockInfrastructure.filter(item => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;
    return true;
  });

  const locations = [...new Set(mockInfrastructure.map(item => item.location))];
  const types = [...new Set(mockInfrastructure.map(item => item.type))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <PageTransition>
            <ResponsiveWrapper padding="lg">
              <StaggeredContainer>
                <StaggeredItem>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Infrastructure Management</h1>
                    <p className="text-gray-600 mt-2">Monitor and manage IT infrastructure components, network topology, and maintenance schedules</p>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Type:</span>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Types</option>
                        {types.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Location:</span>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Locations</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg" className="mb-6">
                    {filteredInfrastructure.map((component, index) => (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${getTypeColor(component.type)} bg-opacity-10`}>
                                  {getTypeIcon(component.type)}
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{component.name}</CardTitle>
                                  <p className="text-sm text-gray-500 capitalize">{component.type}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(component.status)}>
                                {component.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Location:</span>
                                <span className="font-medium">{component.location}</span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Uptime:</span>
                                <span className="font-medium">{component.uptime}%</span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Health:</span>
                                <span className={`font-medium ${getHealthColor(component.health)}`}>
                                  {component.health}%
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Capacity</span>
                                  <span>{component.used}/{component.capacity}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      component.used / component.capacity > 0.8 ? 'bg-red-500' :
                                      component.used / component.capacity > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${(component.used / component.capacity) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="pt-2 border-t">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Next Maintenance:</span>
                                  <span>{component.nextMaintenance}</span>
                                </div>
                              </div>
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
                          <GitBranch className="h-5 w-5 text-blue-600" />
                          Network Topology
                        </CardTitle>
                        <p className="text-sm text-gray-600">Network infrastructure and connections</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockNetworkTopology.map((node, index) => (
                            <motion.div
                              key={node.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">{node.name}</h4>
                                  <p className="text-xs text-gray-500 capitalize">{node.type} Node</p>
                                </div>
                                <Badge className={node.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {node.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Bandwidth:</span>
                                  <span className="ml-1 font-medium">{node.bandwidth}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Latency:</span>
                                  <span className="ml-1 font-medium">{node.latency}ms</span>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Connections:</p>
                                <div className="flex flex-wrap gap-1">
                                  {node.connections.map((conn, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {conn}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-orange-600" />
                          Maintenance Schedule
                        </CardTitle>
                        <p className="text-sm text-gray-600">Upcoming and ongoing maintenance tasks</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockMaintenanceSchedule.map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm">{task.component}</h4>
                                  <p className="text-xs text-gray-500">{task.type}</p>
                                </div>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <span className="ml-1 font-medium">{task.scheduledDate}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <span className="ml-1 font-medium">{task.estimatedDuration}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 capitalize">{task.status}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ResponsiveGrid>
                </StaggeredItem>

                <StaggeredItem>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                        System Health Overview
                      </CardTitle>
                      <p className="text-sm text-gray-600">Overall infrastructure health and performance metrics</p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {mockInfrastructure.filter(c => c.status === 'online').length}
                          </div>
                          <div className="text-sm text-green-700">Components Online</div>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {Math.round(mockInfrastructure.reduce((acc, c) => acc + c.health, 0) / mockInfrastructure.length)}
                          </div>
                          <div className="text-sm text-blue-700">Average Health</div>
                        </div>
                        
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600 mb-1">
                            {mockInfrastructure.filter(c => c.status === 'maintenance').length}
                          </div>
                          <div className="text-sm text-yellow-700">Under Maintenance</div>
                        </div>
                        
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            {mockInfrastructure.filter(c => c.status === 'offline').length}
                          </div>
                          <div className="text-sm text-red-700">Components Offline</div>
                        </div>
                      </ResponsiveGrid>
                    </CardContent>
                  </Card>
                </StaggeredItem>
              </StaggeredContainer>
            </ResponsiveWrapper>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
