import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Filter, Eye, Edit, Play, Square, Trash2, ArrowLeft,
  Calendar, Clock, User, Zap, Settings, CheckCircle, AlertTriangle
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLocation } from "wouter";

// Mock data for daily operations
const mockOperations = [
  { id: 1, title: "Daily system backup", type: "backup", priority: "high", status: "completed", scheduledTime: "06:00", duration: "45m", assignedTo: "System", description: "Automated daily backup of all critical systems including databases, configurations, and user data.", category: "Maintenance", estimatedCost: 0, hotelId: "hotel-1" },
  { id: 2, title: "WiFi performance monitoring", type: "monitoring", priority: "medium", status: "in-progress", scheduledTime: "10:00", duration: "1h", assignedTo: "Ahmed", description: "Monitor WiFi network performance across all floors, check for dead zones and optimize signal strength.", category: "Monitoring", estimatedCost: 0, hotelId: "hotel-1" },
  { id: 3, title: "Monthly security audit", type: "audit", priority: "high", status: "scheduled", scheduledTime: "14:00", duration: "4h", assignedTo: "Fatima", description: "Comprehensive security audit of all systems including penetration testing, vulnerability assessment, and access control review.", category: "Security", estimatedCost: 150, hotelId: "hotel-1" },
  { id: 4, title: "IPTV channel update", type: "update", priority: "medium", status: "pending", scheduledTime: "16:00", duration: "2h", assignedTo: "Karim", description: "Update IPTV channel list, add new channels, and remove discontinued ones. Test all channels for quality.", category: "Content", estimatedCost: 50, hotelId: "hotel-1" },
  { id: 5, title: "CCTV camera maintenance", type: "maintenance", priority: "high", status: "scheduled", scheduledTime: "08:00", duration: "3h", assignedTo: "Fatima", description: "Clean and calibrate all CCTV cameras, check recording systems, and verify backup power supplies.", category: "Maintenance", estimatedCost: 200, hotelId: "hotel-1" }
];

export default function OperationsPage() {
  const [, setLocation] = useLocation();
  const [operations, setOperations] = useState(mockOperations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewOperationModalOpen, setIsNewOperationModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<any>(null);
  const [newOperation, setNewOperation] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    priority: "medium",
    status: "scheduled",
    assignedTo: "",
    scheduledTime: "",
    duration: "",
    estimatedCost: ""
  });

  // Helper functions
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'backup': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'monitoring': return 'bg-green-100 text-green-800 border-green-200';
      case 'audit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'update': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Filter operations based on search and filters
  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || operation.type === filterType;
    const matchesStatus = filterStatus === "all" || operation.status === filterStatus;
    const matchesCategory = filterCategory === "all" || operation.category === filterCategory;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  // Operation actions
  const handleViewOperation = (operation: any) => {
    setSelectedOperation(operation);
    setIsViewModalOpen(true);
  };

  const handleEditOperation = (operation: any) => {
    setEditingOperation({ ...operation });
    setIsEditModalOpen(true);
  };

  const handleStartOperation = (operationId: number) => {
    setOperations(operations.map(o => 
      o.id === operationId ? { ...o, status: 'in-progress' } : o
    ));
    showNotification("Operation started successfully", "success");
  };

  const handleCompleteOperation = (operationId: number) => {
    setOperations(operations.map(o => 
      o.id === operationId ? { ...o, status: 'completed' } : o
    ));
    showNotification("Operation completed successfully", "success");
  };

  const handleDeleteOperation = (operationId: number) => {
    if (confirm("Are you sure you want to delete this operation?")) {
      setOperations(operations.filter(o => o.id !== operationId));
      showNotification("Operation deleted successfully", "success");
    }
  };

  const handleSaveEdit = () => {
    setOperations(operations.map(o => 
      o.id === editingOperation.id ? editingOperation : o
    ));
    setIsEditModalOpen(false);
    setEditingOperation(null);
    showNotification("Operation updated successfully", "success");
  };

  const handleCreateOperation = () => {
    const newOperationWithId = {
      ...newOperation,
      id: Math.max(...operations.map(o => o.id)) + 1,
      estimatedCost: parseFloat(newOperation.estimatedCost) || 0,
      hotelId: "hotel-1"
    };
    setOperations([...operations, newOperationWithId]);
    setIsNewOperationModalOpen(false);
    setNewOperation({
      title: "",
      description: "",
      type: "",
      category: "",
      priority: "medium",
      status: "scheduled",
      assignedTo: "",
      scheduledTime: "",
      duration: "",
      estimatedCost: ""
    });
    showNotification("New operation created successfully", "success");
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterCategory("all");
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Daily Operations</h1>
                <p className="text-gray-600">Schedule and manage routine IT operations and maintenance</p>
              </div>
            </div>
            <Button onClick={() => setIsNewOperationModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Operation
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search operations..."
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
                <SelectItem value="backup">Backup</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Monitoring">Monitoring</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Content">Content</SelectItem>
                <SelectItem value="Backup">Backup</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperations.map((operation) => (
            <Card key={operation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {operation.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(operation.type)}>
                        {operation.type}
                      </Badge>
                      <Badge className={getPriorityColor(operation.priority)}>
                        {operation.priority}
                      </Badge>
                      <Badge className={getStatusColor(operation.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(operation.status)}
                          <span>{operation.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{operation.assignedTo}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{operation.scheduledTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Duration: {operation.duration}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {operation.category}
                  </div>
                  {operation.estimatedCost > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Est. Cost:</span> ${operation.estimatedCost}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOperation(operation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOperation(operation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {operation.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartOperation(operation.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {operation.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteOperation(operation.id)}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteOperation(operation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOperations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* View Operation Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Operation Details</DialogTitle>
            </DialogHeader>
            {selectedOperation && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-gray-900 font-medium">{selectedOperation.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-gray-900">{selectedOperation.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Type</Label>
                    <Badge className={getTypeColor(selectedOperation.type)}>
                      {selectedOperation.type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <p className="text-gray-900">{selectedOperation.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Priority</Label>
                    <Badge className={getPriorityColor(selectedOperation.priority)}>
                      {selectedOperation.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge className={getStatusColor(selectedOperation.status)}>
                      {selectedOperation.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
                    <p className="text-gray-900">{selectedOperation.assignedTo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Scheduled Time</Label>
                    <p className="text-gray-900">{selectedOperation.scheduledTime}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Duration</Label>
                    <p className="text-gray-900">{selectedOperation.duration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Estimated Cost</Label>
                    <p className="text-gray-900">${selectedOperation.estimatedCost}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Operation Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Operation</DialogTitle>
            </DialogHeader>
            {editingOperation && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingOperation.title}
                    onChange={(e) => setEditingOperation({...editingOperation, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingOperation.description}
                    onChange={(e) => setEditingOperation({...editingOperation, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-type">Type</Label>
                    <Select value={editingOperation.type} onValueChange={(value) => setEditingOperation({...editingOperation, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="backup">Backup</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Select value={editingOperation.category} onValueChange={(value) => setEditingOperation({...editingOperation, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Monitoring">Monitoring</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Backup">Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select value={editingOperation.priority} onValueChange={(value) => setEditingOperation({...editingOperation, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={editingOperation.status} onValueChange={(value) => setEditingOperation({...editingOperation, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-assigned">Assigned To</Label>
                    <Input
                      id="edit-assigned"
                      value={editingOperation.assignedTo}
                      onChange={(e) => setEditingOperation({...editingOperation, assignedTo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-time">Scheduled Time</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editingOperation.scheduledTime}
                      onChange={(e) => setEditingOperation({...editingOperation, scheduledTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-duration">Duration</Label>
                    <Input
                      id="edit-duration"
                      value={editingOperation.duration}
                      onChange={(e) => setEditingOperation({...editingOperation, duration: e.target.value})}
                      placeholder="e.g., 2h, 45m"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-cost">Estimated Cost</Label>
                    <Input
                      id="edit-cost"
                      type="number"
                      value={editingOperation.estimatedCost}
                      onChange={(e) => setEditingOperation({...editingOperation, estimatedCost: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Operation Modal */}
        <Dialog open={isNewOperationModalOpen} onOpenChange={setIsNewOperationModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Operation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  value={newOperation.title}
                  onChange={(e) => setNewOperation({...newOperation, title: e.target.value})}
                  placeholder="Enter operation title"
                />
              </div>
              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newOperation.description}
                  onChange={(e) => setNewOperation({...newOperation, description: e.target.value})}
                  placeholder="Describe the operation in detail"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-type">Type</Label>
                  <Select value={newOperation.type} onValueChange={(value) => setNewOperation({...newOperation, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backup">Backup</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-category">Category</Label>
                  <Select value={newOperation.category} onValueChange={(value) => setNewOperation({...newOperation, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Monitoring">Monitoring</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="Backup">Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-priority">Priority</Label>
                  <Select value={newOperation.priority} onValueChange={(value) => setNewOperation({...newOperation, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-assigned">Assigned To</Label>
                  <Input
                    id="new-assigned"
                    value={newOperation.assignedTo}
                    onChange={(e) => setNewOperation({...newOperation, assignedTo: e.target.value})}
                    placeholder="Enter assignee name"
                  />
                </div>
                <div>
                  <Label htmlFor="new-scheduled">Scheduled Time</Label>
                  <Input
                    id="new-scheduled"
                    type="time"
                    value={newOperation.scheduledTime}
                    onChange={(e) => setNewOperation({...newOperation, scheduledTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-duration">Duration</Label>
                  <Input
                    id="new-duration"
                    value={newOperation.duration}
                    onChange={(e) => setNewOperation({...newOperation, duration: e.target.value})}
                    placeholder="e.g., 2h, 45m"
                  />
                </div>
                <div>
                  <Label htmlFor="new-cost">Estimated Cost</Label>
                  <Input
                    id="new-cost"
                    type="number"
                    value={newOperation.estimatedCost}
                    onChange={(e) => setNewOperation({...newOperation, estimatedCost: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewOperationModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOperation}>
                  Schedule Operation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
