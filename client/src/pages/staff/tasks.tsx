import React, { useState, useEffect } from 'react';
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
  Calendar, User, Clock, AlertTriangle
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLocation } from "wouter";

// Mock data for tasks
const mockTasks = [
  { id: 1, title: "Fix WiFi connectivity on Floor 3", category: "WiFi", priority: "high", status: "in-progress", assignedTo: "Ahmed", dueDate: "2024-01-15", estimatedTime: "2h", description: "Guests reporting slow WiFi connection on the 3rd floor. Need to investigate and resolve connectivity issues.", hotelId: "hotel-1" },
  { id: 2, title: "CCTV camera maintenance - Pool area", category: "CCTV", priority: "critical", status: "pending", assignedTo: "Fatima", dueDate: "2024-01-15", estimatedTime: "1.5h", description: "Pool area CCTV camera is offline. Security concern requires immediate attention.", hotelId: "hotel-1" },
  { id: 3, title: "IPTV system update", category: "IPTV", priority: "medium", status: "scheduled", assignedTo: "Karim", dueDate: "2024-01-16", estimatedTime: "3h", description: "Scheduled system update for IPTV services. Will include new channels and bug fixes.", hotelId: "hotel-1" },
  { id: 4, title: "Telephony backup verification", category: "Telephony", priority: "low", status: "completed", assignedTo: "Ahmed", dueDate: "2024-01-14", estimatedTime: "1h", description: "Verify that telephony system backup was completed successfully.", hotelId: "hotel-1" },
  { id: 5, title: "Digital signage content update", category: "Digital Signage", priority: "medium", status: "pending", assignedTo: "Fatima", dueDate: "2024-01-17", estimatedTime: "2h", description: "Update digital signage content with new hotel promotions and information.", hotelId: "hotel-1" }
];

export default function TasksPage() {
  const [, setLocation] = useLocation();
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    dueDate: "",
    estimatedTime: ""
  });

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Square className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  // Task actions
  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask({ ...task });
    setIsEditModalOpen(true);
  };

  const handleStartTask = (taskId: number) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'in-progress' } : t
    ));
    showNotification("Task started successfully", "success");
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' } : t
    ));
    showNotification("Task completed successfully", "success");
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== taskId));
      showNotification("Task deleted successfully", "success");
    }
  };

  const handleSaveEdit = () => {
    setTasks(tasks.map(t => 
      t.id === editingTask.id ? editingTask : t
    ));
    setIsEditModalOpen(false);
    setEditingTask(null);
    showNotification("Task updated successfully", "success");
  };

  const handleCreateTask = () => {
    const newTaskWithId = {
      ...newTask,
      id: Math.max(...tasks.map(t => t.id)) + 1,
      createdAt: new Date().toISOString(),
      hotelId: "hotel-1"
    };
    setTasks([...tasks, newTaskWithId]);
    setIsNewTaskModalOpen(false);
    setNewTask({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      status: "pending",
      assignedTo: "",
      dueDate: "",
      estimatedTime: ""
    });
    showNotification("New task created successfully", "success");
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
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
                <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
                <p className="text-gray-600">Manage and track all IT tasks and assignments</p>
              </div>
            </div>
            <Button onClick={() => setIsNewTaskModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
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
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="WiFi">WiFi</SelectItem>
                <SelectItem value="IPTV">IPTV</SelectItem>
                <SelectItem value="CCTV">CCTV</SelectItem>
                <SelectItem value="Telephony">Telephony</SelectItem>
                <SelectItem value="Digital Signage">Digital Signage</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(task.status)}
                          <span>{task.status}</span>
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
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Est: {task.estimatedTime}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {task.category}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTask(task)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {task.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {task.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* View Task Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-gray-900 font-medium">{selectedTask.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-gray-900">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <p className="text-gray-900">{selectedTask.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Priority</Label>
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
                    <p className="text-gray-900">{selectedTask.assignedTo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Due Date</Label>
                    <p className="text-gray-900">{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Estimated Time</Label>
                    <p className="text-gray-900">{selectedTask.estimatedTime}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Task Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Select value={editingTask.category} onValueChange={(value) => setEditingTask({...editingTask, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WiFi">WiFi</SelectItem>
                        <SelectItem value="IPTV">IPTV</SelectItem>
                        <SelectItem value="CCTV">CCTV</SelectItem>
                        <SelectItem value="Telephony">Telephony</SelectItem>
                        <SelectItem value="Digital Signage">Digital Signage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({...editingTask, priority: value})}>
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
                    <Select value={editingTask.status} onValueChange={(value) => setEditingTask({...editingTask, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-assigned">Assigned To</Label>
                    <Input
                      id="edit-assigned"
                      value={editingTask.assignedTo}
                      onChange={(e) => setEditingTask({...editingTask, assignedTo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-due">Due Date</Label>
                    <Input
                      id="edit-due"
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-time">Estimated Time</Label>
                    <Input
                      id="edit-time"
                      value={editingTask.estimatedTime}
                      onChange={(e) => setEditingTask({...editingTask, estimatedTime: e.target.value})}
                      placeholder="e.g., 2h, 1.5h"
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

        {/* New Task Modal */}
        <Dialog open={isNewTaskModalOpen} onOpenChange={setIsNewTaskModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-category">Category</Label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WiFi">WiFi</SelectItem>
                      <SelectItem value="IPTV">IPTV</SelectItem>
                      <SelectItem value="CCTV">CCTV</SelectItem>
                      <SelectItem value="Telephony">Telephony</SelectItem>
                      <SelectItem value="Digital Signage">Digital Signage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
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
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    placeholder="Enter assignee name"
                  />
                </div>
                <div>
                  <Label htmlFor="new-due">Due Date</Label>
                  <Input
                    id="new-due"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-time">Estimated Time</Label>
                  <Input
                    id="new-time"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: e.target.value})}
                    placeholder="e.g., 2h, 1.5h"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
