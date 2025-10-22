import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  Filter, 
  Search, 
  Clock, 
  Shield, 
  Wifi, 
  Server, 
  Tv,
  Bell,
  Eye,
  EyeOff,
  Trash2,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import PageTransition, { StaggeredContainer, StaggeredItem } from '@/components/ui/PageTransition';
import ResponsiveWrapper, { ResponsiveGrid } from '@/components/ui/ResponsiveWrapper';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'network' | 'system' | 'maintenance' | 'user';
  status: 'active' | 'acknowledged' | 'resolved' | 'archived';
  timestamp: Date;
  source: string;
  location?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Unauthorized Access Attempt',
    description: 'Multiple failed login attempts detected on camera system CAM-02-Entrance',
    severity: 'high',
    category: 'security',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    source: 'Security System',
    location: 'Main Entrance',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Network Performance Degradation',
    description: 'WiFi network response time increased by 200% in the last 30 minutes',
    severity: 'medium',
    category: 'network',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    source: 'Network Monitor',
    location: 'Floor 3-5',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Database Connection Timeout',
    description: 'Primary database connection failed. Fallback to secondary database.',
    severity: 'critical',
    category: 'system',
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    source: 'Database Service',
    assignedTo: 'IT Team',
    priority: 'critical'
  },
  {
    id: '4',
    title: 'IPTV Service Interruption',
    description: 'Channel 15 and 23 experiencing intermittent signal loss',
    severity: 'medium',
    category: 'system',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    source: 'IPTV System',
    location: 'Rooms 301-350',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Scheduled Maintenance Completed',
    description: 'Security system firmware update completed successfully',
    severity: 'low',
    category: 'maintenance',
    status: 'resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    source: 'System Admin',
    assignedTo: 'Security Team',
    priority: 'low'
  },
  {
    id: '6',
    title: 'High CPU Usage Alert',
    description: 'Server CPU usage exceeded 90% threshold for more than 10 minutes',
    severity: 'high',
    category: 'system',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    source: 'Server Monitor',
    location: 'Data Center',
    priority: 'high'
  }
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(alerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Alert['status'] | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<Alert['severity'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Alert['category'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { addNotification } = useNotifications();

  useEffect(() => {
    let filtered = alerts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(alert => alert.category === categoryFilter);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, statusFilter, severityFilter, categoryFilter]);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: Alert['category']) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'network': return <Wifi className="h-4 w-4" />;
      case 'system': return <Server className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      case 'user': return <Bell className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleStatusChange = (alertId: string, newStatus: Alert['status']) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));

    // Add notification for status change
    addNotification({
      title: 'Alert Status Updated',
      message: `Alert "${alerts.find(a => a.id === alertId)?.title}" status changed to ${newStatus}`,
      type: 'info',
      category: 'system',
      priority: 'low',
      source: 'Alerts System'
    });
  };

  const handleArchiveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'archived' } : alert
    ));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSeverityFilter('all');
    setCategoryFilter('all');
  };

  const getActiveAlertsCount = () => alerts.filter(alert => alert.status === 'active').length;
  const getCriticalAlertsCount = () => alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active').length;

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
              <h1 className="text-3xl font-bold text-gray-900">System Alerts</h1>
              <p className="text-gray-600 mt-2">Monitor and manage system alerts, security events, and notifications</p>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg" className="mb-6">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">Active Alerts</p>
                      <p className="text-2xl font-bold text-red-900">{getActiveAlertsCount()}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Critical Alerts</p>
                      <p className="text-2xl font-bold text-orange-900">{getCriticalAlertsCount()}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total Alerts</p>
                      <p className="text-2xl font-bold text-blue-900">{alerts.length}</p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Resolved</p>
                      <p className="text-2xl font-bold text-green-900">
                        {alerts.filter(alert => alert.status === 'resolved').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </StaggeredItem>

          <StaggeredItem>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Alert Management</CardTitle>
                    <p className="text-sm text-gray-600">Search, filter, and manage system alerts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t"
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as Alert['status'] | 'all')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="acknowledged">Acknowledged</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Severity</label>
                        <select
                          value={severityFilter}
                          onChange={(e) => setSeverityFilter(e.target.value as Alert['severity'] | 'all')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Severities</option>
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value as Alert['category'] | 'all')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Categories</option>
                          <option value="security">Security</option>
                          <option value="network">Network</option>
                          <option value="system">System</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <div className="space-y-4">
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`border-l-4 ${
                      alert.severity === 'critical' ? 'border-l-red-500' :
                      alert.severity === 'high' ? 'border-l-orange-500' :
                      alert.severity === 'medium' ? 'border-l-yellow-500' :
                      'border-l-blue-500'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-shrink-0 mt-1">
                                {getCategoryIcon(alert.category)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {alert.title}
                                </h3>
                                <p className="text-gray-600 mb-3">{alert.description}</p>
                                
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <Badge className={getSeverityColor(alert.severity)}>
                                    {alert.severity}
                                  </Badge>
                                  <Badge className={getStatusColor(alert.status)}>
                                    {alert.status}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {alert.category}
                                  </Badge>
                                  {alert.location && (
                                    <Badge variant="outline" className="text-xs">
                                      📍 {alert.location}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatTimestamp(alert.timestamp)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>Source: {alert.source}</span>
                                  </div>
                                  {alert.assignedTo && (
                                    <div className="flex items-center gap-1">
                                      <span>Assigned: {alert.assignedTo}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                            {alert.status === 'active' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(alert.id, 'acknowledged')}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Acknowledge
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(alert.id, 'resolved')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Resolve
                                </Button>
                              </>
                            )}
                            
                            {alert.status === 'acknowledged' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(alert.id, 'resolved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchiveAlert(alert.id)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredAlerts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <AlertTriangle className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || categoryFilter !== 'all'
                        ? 'Try adjusting your filters or search terms'
                        : 'All systems are running smoothly with no active alerts'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </StaggeredItem>
        </StaggeredContainer>
            </ResponsiveWrapper>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
