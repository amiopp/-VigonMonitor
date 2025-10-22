import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, Filter, Eye, ArrowLeft, Activity, User, Clock, 
  CheckCircle, AlertTriangle, Info, XCircle, MessageCircle
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLocation } from "wouter";

// Mock data for recent activity
const mockActivities = [
  { id: 1, action: "Task completed", description: "Telephony backup verification completed successfully. All systems backed up and verified.", user: "Ahmed", timestamp: "2024-01-15 10:30", type: "success", category: "Task", system: "Telephony", details: "Backup verification process completed without errors. All 12 phone extensions backed up successfully.", hotelId: "hotel-1" },
  { id: 2, action: "Issue reported", description: "WiFi slow on Floor 3 - Guests experiencing connectivity issues", user: "Guest", timestamp: "2024-01-15 09:30", type: "warning", category: "Issue", system: "WiFi", details: "Multiple guests reported slow WiFi connection on the 3rd floor. Initial investigation shows high network congestion during peak hours.", hotelId: "hotel-1" },
  { id: 3, action: "Maintenance started", description: "CCTV camera maintenance initiated for pool area", user: "Fatima", timestamp: "2024-01-15 08:15", type: "info", category: "Maintenance", system: "CCTV", details: "Scheduled maintenance started for pool area CCTV cameras. Cleaning and calibration in progress. Expected completion: 2 hours.", hotelId: "hotel-1" },
  { id: 4, action: "System backup", description: "Daily backup completed successfully", user: "System", timestamp: "2024-01-15 06:45", type: "success", category: "System", system: "Backup", details: "Automated daily backup completed successfully. 15.2 GB of data backed up. All critical systems included. Backup verification passed.", hotelId: "hotel-1" },
  { id: 5, action: "User login", description: "IT staff member logged into system", user: "Karim", timestamp: "2024-01-15 08:00", type: "info", category: "Security", system: "Authentication", details: "User Karim logged into the IT management system from IP 192.168.1.45. Session established successfully.", hotelId: "hotel-1" },
  { id: 6, action: "Configuration change", description: "WiFi network settings updated", user: "Ahmed", timestamp: "2024-01-15 07:30", type: "info", category: "Configuration", system: "WiFi", details: "WiFi network configuration updated. Channel optimization applied. Signal strength improved by 15% across affected areas.", hotelId: "hotel-1" },
  { id: 7, action: "Alert resolved", description: "High CPU usage alert resolved", user: "System", timestamp: "2024-01-15 06:15", type: "success", category: "Alert", system: "Server", details: "High CPU usage alert automatically resolved. CPU usage returned to normal levels (45%). Previous peak: 95%.", hotelId: "hotel-1" },
  { id: 8, action: "New user created", description: "New IT staff account created", user: "Admin", timestamp: "2024-01-15 05:30", type: "info", category: "User Management", system: "Authentication", details: "New user account created for IT staff member. Username: newstaff, Role: Technician, Permissions: Basic access granted.", hotelId: "hotel-1" }
];

export default function ActivityPage() {
  const [, setLocation] = useLocation();
  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSystem, setFilterSystem] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Helper functions
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Task': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Issue': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Maintenance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'System': return 'bg-green-100 text-green-800 border-green-200';
      case 'Security': return 'bg-red-100 text-red-800 border-red-200';
      case 'Configuration': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Alert': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'User Management': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.system.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesCategory = filterCategory === "all" || activity.category === filterCategory;
    const matchesSystem = filterSystem === "all" || activity.system === filterSystem;
    
    return matchesSearch && matchesType && matchesCategory && matchesSystem;
  });

  // Activity actions
  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsViewModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterSystem("all");
  };

  // Group activities by date
  const groupActivitiesByDate = (activities: any[]) => {
    const groups: { [key: string]: any[] } = {};
    activities.forEach(activity => {
      const date = activity.timestamp.split(' ')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setLocation("/staff-dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recent Activity</h1>
                <p className="text-gray-600">Track all system activities, user actions, and system events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Task">Task</SelectItem>
                <SelectItem value="Issue">Issue</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Configuration">Configuration</SelectItem>
                <SelectItem value="Alert">Alert</SelectItem>
                <SelectItem value="User Management">User Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSystem} onValueChange={setFilterSystem}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="WiFi">WiFi</SelectItem>
                <SelectItem value="IPTV">IPTV</SelectItem>
                <SelectItem value="CCTV">CCTV</SelectItem>
                <SelectItem value="Telephony">Telephony</SelectItem>
                <SelectItem value="Backup">Backup</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
                <SelectItem value="Authentication">Authentication</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Activities Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-px flex-1 bg-gray-300"></div>
                <h3 className="text-lg font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>
              
              <div className="space-y-4">
                {dateActivities.map((activity) => (
                  <Card key={activity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>
                          {getTypeIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                              <Badge className={getCategoryColor(activity.category)}>
                                {activity.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {activity.system}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{activity.timestamp.split(' ')[1]}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700">{activity.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{activity.user}</span>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewActivity(activity)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Activity className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* View Activity Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Activity Details</DialogTitle>
            </DialogHeader>
            {selectedActivity && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Action</Label>
                  <p className="text-gray-900 font-medium">{selectedActivity.action}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-gray-900">{selectedActivity.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Type</Label>
                    <Badge className={getTypeColor(selectedActivity.type)}>
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(selectedActivity.type)}
                        <span>{selectedActivity.type}</span>
                      </div>
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <Badge className={getCategoryColor(selectedActivity.category)}>
                      {selectedActivity.category}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">System</Label>
                    <p className="text-gray-900">{selectedActivity.system}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">User</Label>
                    <p className="text-gray-900">{selectedActivity.user}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Timestamp</Label>
                    <p className="text-gray-900">{selectedActivity.timestamp}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Detailed Information</Label>
                  <p className="text-gray-900">{selectedActivity.details}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
