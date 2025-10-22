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
  Plus, Search, Filter, Eye, Edit, Play, CheckCircle, Trash2, ArrowLeft,
  AlertTriangle, Users, Wifi, Tv, Camera, Phone, Monitor
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLocation } from "wouter";

// Mock data for technical issues
const mockIssues = [
  { id: 1, title: "WiFi slow on Floor 3", service: "WiFi", severity: "medium", status: "investigating", affectedUsers: 45, assignedTo: "Ahmed", reportedAt: "2024-01-15 09:30", description: "Guests experiencing slow WiFi connection on the 3rd floor. Connection speeds are significantly below normal levels.", impact: "Medium impact on guest experience", resolution: "", hotelId: "hotel-1" },
  { id: 2, title: "CCTV camera offline - Pool area", service: "CCTV", severity: "high", status: "open", affectedUsers: 0, assignedTo: "Fatima", reportedAt: "2024-01-15 08:15", description: "Security camera in the pool area is completely offline. This is a security concern that needs immediate attention.", impact: "High security impact", resolution: "", hotelId: "hotel-1" },
  { id: 3, title: "Phone system echo", service: "Telephony", severity: "low", status: "resolved", affectedUsers: 12, assignedTo: "Karim", reportedAt: "2024-01-14 16:45", description: "Several phone extensions experiencing echo during calls. Affecting internal communication.", impact: "Low impact on operations", resolution: "Updated phone system firmware and reset affected extensions.", hotelId: "hotel-1" },
  { id: 4, title: "IPTV channel freezing", service: "IPTV", severity: "medium", status: "investigating", affectedUsers: 23, assignedTo: "Ahmed", reportedAt: "2024-01-15 11:20", description: "Multiple channels experiencing intermittent freezing. Affecting guest entertainment experience.", impact: "Medium impact on guest satisfaction", resolution: "", hotelId: "hotel-1" },
  { id: 5, title: "Digital signage not updating", service: "Digital Signage", severity: "low", status: "open", affectedUsers: 0, assignedTo: "Fatima", reportedAt: "2024-01-15 10:00", description: "Digital signage displays not updating with new content. Content appears to be stuck on old information.", impact: "Low impact on operations", resolution: "", hotelId: "hotel-1" }
];

export default function IssuesPage() {
  const [, setLocation] = useLocation();
  const [issues, setIssues] = useState(mockIssues);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<any>(null);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    service: "",
    severity: "medium",
    status: "open",
    assignedTo: "",
    impact: "",
    resolution: ""
  });

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'investigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'WiFi': return <Wifi className="h-4 w-4" />;
      case 'IPTV': return <Tv className="h-4 w-4" />;
      case 'CCTV': return <Camera className="h-4 w-4" />;
      case 'Telephony': return <Phone className="h-4 w-4" />;
      case 'Digital Signage': return <Monitor className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || issue.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus;
    const matchesService = filterService === "all" || issue.service === filterService;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesService;
  });

  // Issue actions
  const handleViewIssue = (issue: any) => {
    setSelectedIssue(issue);
    setIsViewModalOpen(true);
  };

  const handleEditIssue = (issue: any) => {
    setEditingIssue({ ...issue });
    setIsEditModalOpen(true);
  };

  const handleStartInvestigation = (issueId: number) => {
    setIssues(issues.map(i => 
      i.id === issueId ? { ...i, status: 'investigating' } : i
    ));
    showNotification("Investigation started", "success");
  };

  const handleResolveIssue = (issueId: number) => {
    setIssues(issues.map(i => 
      i.id === issueId ? { ...i, status: 'resolved' } : i
    ));
    showNotification("Issue marked as resolved", "success");
  };

  const handleDeleteIssue = (issueId: number) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      setIssues(issues.filter(i => i.id !== issueId));
      showNotification("Issue deleted successfully", "success");
    }
  };

  const handleSaveEdit = () => {
    setIssues(issues.map(i => 
      i.id === editingIssue.id ? editingIssue : i
    ));
    setIsEditModalOpen(false);
    setEditingIssue(null);
    showNotification("Issue updated successfully", "success");
  };

  const handleCreateIssue = () => {
    const newIssueWithId = {
      ...newIssue,
      id: Math.max(...issues.map(i => i.id)) + 1,
      reportedAt: new Date().toISOString(),
      affectedUsers: 0,
      hotelId: "hotel-1"
    };
    setIssues([...issues, newIssueWithId]);
    setIsNewIssueModalOpen(false);
    setNewIssue({
      title: "",
      description: "",
      service: "",
      severity: "medium",
      status: "open",
      assignedTo: "",
      impact: "",
      resolution: ""
    });
    showNotification("New issue created successfully", "success");
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSeverity("all");
    setFilterStatus("all");
    setFilterService("all");
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
                <h1 className="text-3xl font-bold text-gray-900">Technical Issues</h1>
                <p className="text-gray-600">Track and resolve technical problems and incidents</p>
              </div>
            </div>
            <Button onClick={() => setIsNewIssueModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
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
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
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

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {issue.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    {getServiceIcon(issue.service)}
                    <span className="ml-2">{issue.service}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{issue.affectedUsers} users affected</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Assigned to:</span> {issue.assignedTo}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Reported:</span> {issue.reportedAt}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Impact:</span> {issue.impact}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewIssue(issue)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditIssue(issue)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {issue.status === 'open' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartInvestigation(issue.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {issue.status === 'investigating' && (
                      <Button
                        size="sm"
                        onClick={() => handleResolveIssue(issue.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteIssue(issue.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* View Issue Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Issue Details</DialogTitle>
            </DialogHeader>
            {selectedIssue && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-gray-900 font-medium">{selectedIssue.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-gray-900">{selectedIssue.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Service</Label>
                    <div className="flex items-center">
                      {getServiceIcon(selectedIssue.service)}
                      <span className="ml-2">{selectedIssue.service}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Severity</Label>
                    <Badge className={getSeverityColor(selectedIssue.severity)}>
                      {selectedIssue.severity}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge className={getStatusColor(selectedIssue.status)}>
                      {selectedIssue.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
                    <p className="text-gray-900">{selectedIssue.assignedTo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Affected Users</Label>
                    <p className="text-gray-900">{selectedIssue.affectedUsers}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Reported At</Label>
                    <p className="text-gray-900">{selectedIssue.reportedAt}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Impact</Label>
                  <p className="text-gray-900">{selectedIssue.impact}</p>
                </div>
                {selectedIssue.resolution && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Resolution</Label>
                    <p className="text-gray-900">{selectedIssue.resolution}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Issue Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Issue</DialogTitle>
            </DialogHeader>
            {editingIssue && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingIssue.title}
                    onChange={(e) => setEditingIssue({...editingIssue, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingIssue.description}
                    onChange={(e) => setEditingIssue({...editingIssue, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-service">Service</Label>
                    <Select value={editingIssue.service} onValueChange={(value) => setEditingIssue({...editingIssue, service: value})}>
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
                    <Label htmlFor="edit-severity">Severity</Label>
                    <Select value={editingIssue.severity} onValueChange={(value) => setEditingIssue({...editingIssue, severity: value})}>
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
                    <Select value={editingIssue.status} onValueChange={(value) => setEditingIssue({...editingIssue, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-assigned">Assigned To</Label>
                    <Input
                      id="edit-assigned"
                      value={editingIssue.assignedTo}
                      onChange={(e) => setEditingIssue({...editingIssue, assignedTo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-impact">Impact</Label>
                    <Input
                      id="edit-impact"
                      value={editingIssue.impact}
                      onChange={(e) => setEditingIssue({...editingIssue, impact: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-resolution">Resolution</Label>
                    <Input
                      id="edit-resolution"
                      value={editingIssue.resolution}
                      onChange={(e) => setEditingIssue({...editingIssue, resolution: e.target.value})}
                      placeholder="Enter resolution details"
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

        {/* New Issue Modal */}
        <Dialog open={isNewIssueModalOpen} onOpenChange={setIsNewIssueModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report New Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  placeholder="Enter issue title"
                />
              </div>
              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  placeholder="Describe the issue in detail"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-service">Service</Label>
                  <Select value={newIssue.service} onValueChange={(value) => setNewIssue({...newIssue, service: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
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
                  <Label htmlFor="new-severity">Severity</Label>
                  <Select value={newIssue.severity} onValueChange={(value) => setNewIssue({...newIssue, severity: value})}>
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
                    value={newIssue.assignedTo}
                    onChange={(e) => setNewIssue({...newIssue, assignedTo: e.target.value})}
                    placeholder="Enter assignee name"
                  />
                </div>
                <div>
                  <Label htmlFor="new-impact">Impact</Label>
                  <Input
                    id="new-impact"
                    value={newIssue.impact}
                    onChange={(e) => setNewIssue({...newIssue, impact: e.target.value})}
                    placeholder="Describe the impact"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewIssueModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateIssue}>
                  Report Issue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
