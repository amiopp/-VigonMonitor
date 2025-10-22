import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wifi, Tv, Camera, Phone, Monitor, 
  AlertTriangle, CheckCircle, Clock, 
  User, Users, Zap, Settings, 
  Plus, Search, Filter, Calendar,
  MessageCircle, Lightbulb, BarChart3,
  Trash2, Eye, Edit, Play, Square
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
 
import ITStaffChat from "@/components/chat/ITStaffChat";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";

import { useLocation } from "wouter";

// Mock data for all hotels
const hotelData = {
  fairmont: {
  hotel: {
    name: "Fairmont",
    location: "Marrakech, Morocco",
    rooms: 245,
    currentGuests: 189,
    status: "active"
  },
  services: [
    { id: 1, name: "WiFi", status: "active", uptime: 98.5, issues: 2, priority: "medium" },
    { id: 2, name: "IPTV", status: "active", uptime: 99.2, issues: 0, priority: "low" },
    { id: 3, name: "CCTV", status: "maintenance", uptime: 95.8, issues: 1, priority: "high" },
    { id: 4, name: "Telephony", status: "active", uptime: 97.5, issues: 1, priority: "medium" },
    { id: 5, name: "Digital Signage", status: "active", uptime: 98.9, issues: 0, priority: "low" }
  ],
  tasks: [
    { id: 1, title: "Fix WiFi connectivity on Floor 3", category: "WiFi", priority: "high", status: "in-progress", assignedTo: "Ahmed", dueDate: "2024-01-15", estimatedTime: "2h" },
    { id: 2, title: "CCTV camera maintenance - Pool area", category: "CCTV", priority: "critical", status: "pending", assignedTo: "Fatima", dueDate: "2024-01-15", estimatedTime: "1.5h" },
      { id: 3, title: "IPTV system update", category: "IPTV", priority: "medium", status: "scheduled", assignedTo: "Karim", dueDate: "2024-01-16", estimatedTime: "3h" }
  ],
  issues: [
    { id: 1, title: "WiFi slow on Floor 3", service: "WiFi", severity: "medium", status: "investigating", affectedUsers: 45, assignedTo: "Ahmed", reportedAt: "2024-01-15 09:30" },
      { id: 2, title: "CCTV camera offline - Pool area", service: "CCTV", severity: "high", status: "open", affectedUsers: 0, assignedTo: "Fatima", reportedAt: "2024-01-15 08:15" }
  ],
  operations: [
    { id: 1, title: "Daily system backup", type: "backup", priority: "high", status: "completed", scheduledTime: "06:00", duration: "45m", assignedTo: "System" },
      { id: 2, title: "WiFi performance monitoring", type: "monitoring", priority: "medium", status: "in-progress", scheduledTime: "10:00", duration: "1h", assignedTo: "Ahmed" }
  ],
  recentActivity: [
    { id: 1, action: "Task completed", description: "Telephony backup verification completed", user: "Ahmed", timestamp: "2024-01-15 10:30", type: "success" },
      { id: 2, action: "Issue reported", description: "WiFi slow on Floor 3", user: "Guest", timestamp: "2024-01-15 09:30", type: "warning" }
    ]
  },
  savoy: {
    hotel: {
      name: "Savoy",
      location: "Marrakech, Morocco",
      rooms: 267,
      currentGuests: 201,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 99.1, issues: 1, priority: "low" },
      { id: 2, name: "IPTV", status: "active", uptime: 98.8, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 97.2, issues: 2, priority: "medium" },
      { id: 4, name: "Telephony", status: "maintenance", uptime: 96.5, issues: 1, priority: "high" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.5, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Install new security cameras", category: "CCTV", priority: "medium", status: "pending", assignedTo: "Youssef", dueDate: "2024-01-16", estimatedTime: "4h" },
      { id: 2, title: "Update guest WiFi", category: "WiFi", priority: "high", status: "in-progress", assignedTo: "Aicha", dueDate: "2024-01-15", estimatedTime: "2h" },
      { id: 3, title: "Telephony system upgrade", category: "Telephony", priority: "critical", status: "scheduled", assignedTo: "Youssef", dueDate: "2024-01-17", estimatedTime: "6h" }
    ],
    issues: [
      { id: 1, title: "Elevator system malfunction", service: "Elevator", severity: "critical", status: "open", affectedUsers: 0, assignedTo: "Youssef", reportedAt: "2024-01-15 10:30" },
      { id: 2, title: "Pool heating system", service: "HVAC", severity: "medium", status: "investigating", affectedUsers: 0, assignedTo: "Aicha", reportedAt: "2024-01-15 11:30" }
    ],
    operations: [
      { id: 1, title: "Monthly maintenance", type: "maintenance", priority: "low", status: "completed", scheduledTime: "07:00", duration: "2h", assignedTo: "Youssef" },
      { id: 2, title: "Energy audit", type: "audit", priority: "medium", status: "in-progress", scheduledTime: "11:00", duration: "3h", assignedTo: "Aicha" }
    ],
    recentActivity: [
      { id: 1, action: "New security cameras installed", description: "4 new cameras added to lobby area", user: "Youssef", timestamp: "2024-01-15 07:45", type: "info" },
      { id: 2, action: "Issue reported", description: "Elevator system malfunction", user: "Guest", timestamp: "2024-01-15 10:30", type: "warning" }
    ]
  },
  ritz: {
    hotel: {
      name: "RITZ",
      location: "Rabat, Morocco",
      rooms: 180,
      currentGuests: 140,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 97.8, issues: 3, priority: "high" },
      { id: 2, name: "IPTV", status: "active", uptime: 98.5, issues: 1, priority: "medium" },
      { id: 3, name: "CCTV", status: "active", uptime: 96.9, issues: 2, priority: "medium" },
      { id: 4, name: "Telephony", status: "active", uptime: 98.1, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.2, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Conference room setup", category: "AV", priority: "high", status: "in-progress", assignedTo: "Karim", dueDate: "2024-01-15", estimatedTime: "3h" },
      { id: 2, title: "Guest room TV upgrade", category: "IPTV", priority: "medium", status: "pending", assignedTo: "Nadia", dueDate: "2024-01-16", estimatedTime: "6h" },
      { id: 3, title: "WiFi optimization", category: "WiFi", priority: "high", status: "scheduled", assignedTo: "Karim", dueDate: "2024-01-17", estimatedTime: "4h" }
    ],
    issues: [
      { id: 1, title: "Air conditioning failure", service: "HVAC", severity: "high", status: "open", affectedUsers: 0, assignedTo: "Karim", reportedAt: "2024-01-15 11:00" },
      { id: 2, title: "Internet speed issues", service: "WiFi", severity: "medium", status: "investigating", affectedUsers: 25, assignedTo: "Nadia", reportedAt: "2024-01-15 12:00" }
    ],
    operations: [
      { id: 1, title: "Weekly system check", type: "maintenance", priority: "low", status: "completed", scheduledTime: "08:00", duration: "1h", assignedTo: "Karim" },
      { id: 2, title: "Guest satisfaction survey", type: "analysis", priority: "medium", status: "pending", scheduledTime: "15:00", duration: "2h", assignedTo: "Nadia" }
    ],
    recentActivity: [
      { id: 1, action: "Conference room AV setup completed", description: "AV equipment configured for meeting", user: "Karim", timestamp: "2024-01-15 08:45", type: "success" },
      { id: 2, action: "Issue reported", description: "Air conditioning failure in rooms 101-105", user: "Guest", timestamp: "2024-01-15 11:00", type: "warning" }
    ]
  },
  sapst: {
    hotel: {
      name: "SAPST",
      location: "Casablanca, Morocco",
      rooms: 310,
      currentGuests: 256,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 98.2, issues: 1, priority: "low" },
      { id: 2, name: "IPTV", status: "active", uptime: 99.0, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 97.8, issues: 1, priority: "medium" },
      { id: 4, name: "Telephony", status: "active", uptime: 98.7, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.1, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Server room cooling", category: "Infrastructure", priority: "high", status: "in-progress", assignedTo: "Hassan", dueDate: "2024-01-15", estimatedTime: "4h" },
      { id: 2, title: "Backup system test", category: "System", priority: "medium", status: "pending", assignedTo: "Laila", dueDate: "2024-01-16", estimatedTime: "2h" },
      { id: 3, title: "Network security audit", category: "Security", priority: "high", status: "scheduled", assignedTo: "Hassan", dueDate: "2024-01-18", estimatedTime: "5h" }
    ],
    issues: [
      { id: 1, title: "Fire alarm system", service: "Security", severity: "critical", status: "resolved", affectedUsers: 0, assignedTo: "Hassan", reportedAt: "2024-01-15 10:00" },
      { id: 2, title: "Guest WiFi authentication", service: "WiFi", severity: "medium", status: "open", affectedUsers: 15, assignedTo: "Laila", reportedAt: "2024-01-15 11:00" }
    ],
    operations: [
      { id: 1, title: "Daily backup verification", type: "maintenance", priority: "low", status: "completed", scheduledTime: "07:00", duration: "30m", assignedTo: "Hassan" },
      { id: 2, title: "Network performance analysis", type: "analysis", priority: "medium", status: "in-progress", scheduledTime: "09:00", duration: "2h", assignedTo: "Laila" }
    ],
    recentActivity: [
      { id: 1, action: "Server room cooling upgrade completed", description: "Additional cooling installed successfully", user: "Hassan", timestamp: "2024-01-15 07:45", type: "success" },
      { id: 2, action: "Issue resolved", description: "Fire alarm system false alarm resolved", user: "Hassan", timestamp: "2024-01-15 10:30", type: "success" }
    ]
  },
  cri: {
    hotel: {
      name: "Centre Régional d'Investissement",
      location: "Rabat, Morocco",
      rooms: 120,
      currentGuests: 88,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 99.5, issues: 0, priority: "low" },
      { id: 2, name: "IPTV", status: "active", uptime: 98.9, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 99.1, issues: 0, priority: "low" },
      { id: 4, name: "Telephony", status: "active", uptime: 99.3, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.7, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "System maintenance", category: "System", priority: "low", status: "completed", assignedTo: "Omar", dueDate: "2024-01-15", estimatedTime: "1h" },
      { id: 2, title: "Security update", category: "Security", priority: "medium", status: "pending", assignedTo: "Omar", dueDate: "2024-01-16", estimatedTime: "2h" }
    ],
    issues: [
      { id: 1, title: "Minor WiFi issue", service: "WiFi", severity: "low", status: "resolved", affectedUsers: 2, assignedTo: "Omar", reportedAt: "2024-01-15 09:00" }
    ],
    operations: [
      { id: 1, title: "Daily system check", type: "maintenance", priority: "low", status: "completed", scheduledTime: "08:00", duration: "30m", assignedTo: "Omar" }
    ],
    recentActivity: [
      { id: 1, action: "System maintenance completed", description: "All systems running smoothly", user: "Omar", timestamp: "2024-01-15 08:30", type: "success" }
    ]
  },
  fs: {
    hotel: {
      name: "FOUR SEASONS",
      location: "Casablanca, Morocco",
      rooms: 350,
      currentGuests: 278,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 98.8, issues: 1, priority: "low" },
      { id: 2, name: "IPTV", status: "active", uptime: 99.4, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 98.6, issues: 1, priority: "medium" },
      { id: 4, name: "Telephony", status: "active", uptime: 99.1, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.2, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Luxury suite setup", category: "AV", priority: "high", status: "in-progress", assignedTo: "Mehdi", dueDate: "2024-01-15", estimatedTime: "4h" },
      { id: 2, title: "Pool area WiFi", category: "WiFi", priority: "medium", status: "pending", assignedTo: "Mehdi", dueDate: "2024-01-16", estimatedTime: "3h" }
    ],
    issues: [
      { id: 1, title: "Spa area connectivity", service: "WiFi", severity: "medium", status: "investigating", affectedUsers: 8, assignedTo: "Mehdi", reportedAt: "2024-01-15 10:00" }
    ],
    operations: [
      { id: 1, title: "Luxury service check", type: "maintenance", priority: "medium", status: "in-progress", scheduledTime: "09:00", duration: "2h", assignedTo: "Mehdi" }
    ],
    recentActivity: [
      { id: 1, action: "Luxury suite setup started", description: "AV equipment installation in progress", user: "Mehdi", timestamp: "2024-01-15 09:00", type: "info" }
    ]
  },
  essaadi: {
    hotel: {
      name: "Es Saadi",
      location: "Marrakech, Morocco",
      rooms: 240,
      currentGuests: 192,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 97.9, issues: 2, priority: "medium" },
      { id: 2, name: "IPTV", status: "active", uptime: 98.7, issues: 1, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 97.3, issues: 2, priority: "medium" },
      { id: 4, name: "Telephony", status: "active", uptime: 98.4, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.0, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Garden area WiFi", category: "WiFi", priority: "medium", status: "pending", assignedTo: "Rachid", dueDate: "2024-01-16", estimatedTime: "3h" },
      { id: 2, title: "Spa system upgrade", category: "System", priority: "high", status: "scheduled", assignedTo: "Rachid", dueDate: "2024-01-17", estimatedTime: "5h" }
    ],
    issues: [
      { id: 1, title: "Garden WiFi coverage", service: "WiFi", severity: "medium", status: "open", affectedUsers: 12, assignedTo: "Rachid", reportedAt: "2024-01-15 11:00" }
    ],
    operations: [
      { id: 1, title: "Garden area maintenance", type: "maintenance", priority: "medium", status: "pending", scheduledTime: "14:00", duration: "2h", assignedTo: "Rachid" }
    ],
    recentActivity: [
      { id: 1, action: "Garden WiFi issue reported", description: "Poor coverage in garden area", user: "Guest", timestamp: "2024-01-15 11:00", type: "warning" }
    ]
  },
  kenzy: {
    hotel: {
      name: "Kenzy",
      location: "Casablanca, Morocco",
      rooms: 210,
      currentGuests: 167,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 98.3, issues: 1, priority: "low" },
      { id: 2, name: "IPTV", status: "active", uptime: 99.1, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 98.7, issues: 1, priority: "low" },
      { id: 4, name: "Telephony", status: "active", uptime: 98.9, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.3, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Business center setup", category: "AV", priority: "medium", status: "in-progress", assignedTo: "Khalid", dueDate: "2024-01-15", estimatedTime: "3h" },
      { id: 2, title: "Meeting room upgrade", category: "AV", priority: "low", status: "pending", assignedTo: "Khalid", dueDate: "2024-01-18", estimatedTime: "4h" }
    ],
    issues: [
      { id: 1, title: "Business center connectivity", service: "WiFi", severity: "low", status: "resolved", affectedUsers: 3, assignedTo: "Khalid", reportedAt: "2024-01-15 08:00" }
    ],
    operations: [
      { id: 1, title: "Business center maintenance", type: "maintenance", priority: "low", status: "completed", scheduledTime: "08:00", duration: "1h", assignedTo: "Khalid" }
    ],
    recentActivity: [
      { id: 1, action: "Business center setup completed", description: "All equipment installed and tested", user: "Khalid", timestamp: "2024-01-15 08:30", type: "success" }
    ]
  },
  marriott: {
    hotel: {
      name: "Marriott",
      location: "Casablanca, Morocco",
      rooms: 300,
      currentGuests: 230,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 98.6, issues: 1, priority: "low" },
      { id: 2, name: "IPTV", status: "active", uptime: 99.2, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 98.4, issues: 1, priority: "low" },
      { id: 4, name: "Telephony", status: "active", uptime: 98.8, issues: 0, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.4, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Conference room upgrade", category: "AV", priority: "high", status: "in-progress", assignedTo: "Youssef", dueDate: "2024-01-15", estimatedTime: "6h" },
      { id: 2, title: "Guest room WiFi", category: "WiFi", priority: "medium", status: "pending", assignedTo: "Youssef", dueDate: "2024-01-16", estimatedTime: "4h" }
    ],
    issues: [
      { id: 1, title: "Conference room audio", service: "AV", severity: "medium", status: "investigating", affectedUsers: 0, assignedTo: "Youssef", reportedAt: "2024-01-15 10:30" }
    ],
    operations: [
      { id: 1, title: "Conference room maintenance", type: "maintenance", priority: "high", status: "in-progress", scheduledTime: "09:00", duration: "4h", assignedTo: "Youssef" }
    ],
    recentActivity: [
      { id: 1, action: "Conference room upgrade started", description: "AV equipment installation in progress", user: "Youssef", timestamp: "2024-01-15 09:00", type: "info" }
    ]
  },
  radisson: {
    hotel: {
      name: "Radisson",
      location: "Casablanca, Morocco",
      rooms: 260,
      currentGuests: 205,
      status: "active"
    },
    services: [
      { id: 1, name: "WiFi", status: "active", uptime: 98.1, issues: 2, priority: "medium" },
      { id: 2, name: "IPTV", status: "active", uptime: 98.9, issues: 0, priority: "low" },
      { id: 3, name: "CCTV", status: "active", uptime: 97.8, issues: 1, priority: "medium" },
      { id: 4, name: "Telephony", status: "active", uptime: 98.5, issues: 1, priority: "low" },
      { id: 5, name: "Digital Signage", status: "active", uptime: 99.1, issues: 0, priority: "low" }
    ],
    tasks: [
      { id: 1, title: "Restaurant WiFi upgrade", category: "WiFi", priority: "medium", status: "pending", assignedTo: "Amine", dueDate: "2024-01-16", estimatedTime: "3h" },
      { id: 2, title: "Lobby display update", category: "Digital Signage", priority: "low", status: "scheduled", assignedTo: "Amine", dueDate: "2024-01-17", estimatedTime: "2h" }
    ],
    issues: [
      { id: 1, title: "Restaurant WiFi slow", service: "WiFi", severity: "medium", status: "open", affectedUsers: 20, assignedTo: "Amine", reportedAt: "2024-01-15 12:00" }
    ],
    operations: [
      { id: 1, title: "Restaurant area maintenance", type: "maintenance", priority: "medium", status: "pending", scheduledTime: "13:00", duration: "2h", assignedTo: "Amine" }
    ],
    recentActivity: [
      { id: 1, action: "Restaurant WiFi issue reported", description: "Slow connection during peak hours", user: "Guest", timestamp: "2024-01-15 12:00", type: "warning" }
    ]
  }
};

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const hotels = [
    { id: 'fairmont', name: 'Fairmont', location: 'Marrakech, Morocco', rooms: 245, currentGuests: 189, status: 'active' },
    { id: 'savoy', name: 'Savoy', location: 'Marrakech, Morocco', rooms: 267, currentGuests: 201, status: 'active' },
    { id: 'ritz', name: 'RITZ', location: 'Rabat, Morocco', rooms: 180, currentGuests: 140, status: 'active' },
    { id: 'sapst', name: 'SAPST', location: 'Casablanca, Morocco', rooms: 310, currentGuests: 256, status: 'active' },
    { id: 'cri', name: "Centre Régional d'Investissement", location: 'Rabat, Morocco', rooms: 120, currentGuests: 88, status: 'active' },
    { id: 'fs', name: 'FOUR SEASONS', location: 'Casablanca, Morocco', rooms: 350, currentGuests: 278, status: 'active' },
    { id: 'essaadi', name: 'Es Saadi', location: 'Marrakech, Morocco', rooms: 240, currentGuests: 192, status: 'active' },
    { id: 'kenzy', name: 'Kenzy', location: 'Casablanca, Morocco', rooms: 210, currentGuests: 167, status: 'active' },
    { id: 'marriott', name: 'Marriott', location: 'Casablanca, Morocco', rooms: 300, currentGuests: 230, status: 'active' },
    { id: 'radisson', name: 'Radisson', location: 'Casablanca, Morocco', rooms: 260, currentGuests: 205, status: 'active' },
  ];
  const [selectedHotelId, setSelectedHotelId] = useState<string>('fairmont');
  const selectedHotel = hotels.find(h => h.id === selectedHotelId) || hotels[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  // Get current hotel data
  const currentHotelData = hotelData[selectedHotelId as keyof typeof hotelData] || hotelData.fairmont;
  
  // State for modals and data management
  const [tasks, setTasks] = useState(currentHotelData.tasks);
  const [issues, setIssues] = useState(currentHotelData.issues);
  const [operations, setOperations] = useState(currentHotelData.operations);

  // Update data when hotel changes
  useEffect(() => {
    const newHotelData = hotelData[selectedHotelId as keyof typeof hotelData] || hotelData.fairmont;
    setTasks(newHotelData.tasks);
    setIssues(newHotelData.issues);
    setOperations(newHotelData.operations);
  }, [selectedHotelId]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState<any>({});

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
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
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'wifi': return <Wifi className="h-5 w-5" />;
      case 'iptv': return <Tv className="h-5 w-5" />;
      case 'cctv': return <Camera className="h-5 w-5" />;
      case 'telephony': return <Phone className="h-5 w-5" />;
      case 'digital signage': return <Monitor className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Action handlers
  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = (item: any, type: 'task' | 'issue' | 'operation') => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      switch (type) {
        case 'task':
          setTasks(tasks.filter(t => t.id !== item.id));
          break;
        case 'issue':
          setIssues(issues.filter(i => i.id !== item.id));
          break;
        case 'operation':
          setOperations(operations.filter(o => o.id !== item.id));
          break;
      }
    }
  };

  const handleStartTask = (task: any) => {
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, status: 'in-progress' } : t
    ));
  };

  const handleCompleteTask = (task: any) => {
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, status: 'completed' } : t
    ));
  };

  const handleStartOperation = (operation: any) => {
    setOperations(operations.map(o => 
      o.id === operation.id ? { ...o, status: 'in-progress' } : o
    ));
  };

  const handleCompleteOperation = (operation: any) => {
    setOperations(operations.map(o => 
      o.id === operation.id ? { ...o, status: 'completed' } : o
    ));
  };

  const handleUpdateIssueStatus = (issue: any, newStatus: string) => {
    setIssues(issues.map(i => 
      i.id === issue.id ? { ...i, status: newStatus } : i
    ));
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      if (editingItem.title && editingItem.title.trim()) {
        if (tasks.find(t => t.id === editingItem.id)) {
          setTasks(tasks.map(t => t.id === editingItem.id ? editingItem : t));
        } else if (issues.find(i => i.id === editingItem.id)) {
          setIssues(issues.map(i => i.id === editingItem.id ? editingItem : i));
        } else if (operations.find(o => o.id === editingItem.id)) {
          setOperations(operations.map(o => o.id === editingItem.id ? editingItem : o));
        }
        setIsEditModalOpen(false);
        setEditingItem(null);
      }
    }
  };

  const handleCreateNewItem = () => {
    if (newItem.title && newItem.title.trim()) {
      const item = {
        ...newItem,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (activeTab === 'tasks') {
        setTasks(prev => [...prev, item]);
      } else if (activeTab === 'issues') {
        setIssues(prev => [...prev, item]);
      } else if (activeTab === 'operations') {
        setOperations(prev => [...prev, item]);
      }
      
      // Reset form and close modal
      setNewItem({});
      setIsNewItemModalOpen(false);
      
      // Optional: Show success message
      console.log(`${activeTab === 'tasks' ? 'Task' : activeTab === 'issues' ? 'Issue' : 'Operation'} created successfully!`);
    } else {
      // Show validation error
      console.error('Title is required');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setFilterStatus("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-gray-600 mt-2">
                {selectedHotel.name} • {selectedHotel.location} • {selectedHotel.rooms} Rooms
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <NotificationDropdown />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{selectedHotel.currentGuests}</div>
                <div className="text-sm text-gray-600">Guests Online</div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {selectedHotel.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="issues">Technical Issues</TabsTrigger>
            <TabsTrigger value="operations">Daily Operations</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          {/* Navigation Buttons for Each Tab */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/staff/tasks")}
              className="flex items-center space-x-2"
            >
              <span>Go to Tasks Page</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/staff/issues")}
              className="flex items-center space-x-2"
            >
              <span>Go to Issues Page</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/staff/operations")}
              className="flex items-center space-x-2"
            >
              <span>Go to Operations Page</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/staff/activity")}
              className="flex items-center space-x-2"
            >
              <span>Go to Activity Page</span>
            </Button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Service Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {currentHotelData.services.map((service) => (
                <Card key={service.id} className="text-center cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-2">
                      {getServiceIcon(service.name)}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{service.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(service.status)}
                    </div>
                    <Badge className={`mb-2 ${getStatusColor(service.status)}`}>
                      {service.status}
                    </Badge>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {service.uptime}%
                    </div>
                    <div className="text-sm text-gray-600">Uptime</div>
                    {service.issues > 0 && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">
                          {service.issues} Issues
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('tasks')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Active Tasks</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('issues')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Open Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">
                    {issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('operations')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Today's Operations</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">
                    {operations.filter(o => o.status === 'scheduled' || o.status === 'in-progress').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Guests Online</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">
                    {currentHotelData.hotel.currentGuests}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Uptime Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Service Uptime Monitoring</CardTitle>
                <p className="text-sm text-gray-600">Real-time service health status</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentHotelData.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getServiceIcon(service.name)}
                        <span className="font-medium text-gray-900">{service.name}</span>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress value={service.uptime} className="w-32" />
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {service.uptime}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {/* Task Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Task Management</CardTitle>
                    <p className="text-sm text-gray-600">Manage and track assigned tasks</p>
                  </div>
                  <Button onClick={() => setIsNewItemModalOpen(true)} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Task</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge variant="outline">
                              {task.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Due: {task.dueDate}</span>
                            <span>Est. Time: {task.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleViewItem(task)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditItem(task)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {task.status === 'pending' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleStartTask(task)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {task.status === 'in-progress' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleCompleteTask(task)}>
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteItem(task, 'task')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Technical Issues</CardTitle>
                    <p className="text-sm text-gray-600">Track and manage reported technical problems</p>
                  </div>
                  <Button onClick={() => setIsNewItemModalOpen(true)} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Report Issue</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{issue.title}</h4>
                            <Badge className={getPriorityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <Badge variant="outline">
                              {issue.service}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>Status: {issue.status}</span>
                            <span>Assigned to: {issue.assignedTo}</span>
                            <span>Affected users: {issue.affectedUsers}</span>
                            <span>Reported: {issue.reportedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleViewItem(issue)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditItem(issue)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {issue.status === 'open' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleUpdateIssueStatus(issue, 'investigating')}>
                              Start Investigation
                            </Button>
                          )}
                          {issue.status === 'investigating' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateIssueStatus(issue, 'resolved')}>
                              Resolve
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteItem(issue, 'issue')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Operations</CardTitle>
                    <p className="text-sm text-gray-600">Scheduled and ongoing operational tasks</p>
                  </div>
                  <Button onClick={() => setIsNewItemModalOpen(true)} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Schedule Operation</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operations.map((operation) => (
                    <div key={operation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{operation.title}</h4>
                            <Badge className={getPriorityColor(operation.priority)}>
                              {operation.priority}
                            </Badge>
                            <Badge variant="outline">
                              {operation.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Scheduled: {operation.scheduledTime}</span>
                            <span>Duration: {operation.duration}</span>
                            <span>Assigned to: {operation.assignedTo}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(operation.status)}>
                            {operation.status}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleViewItem(operation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {operation.status === 'scheduled' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleStartOperation(operation)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {operation.status === 'in-progress' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleCompleteOperation(operation)}>
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteItem(operation, 'operation')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-gray-600">Chronological view of all system activities</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {currentHotelData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{activity.action}</h4>
                            <span className="text-sm text-gray-500">{activity.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[calc(100vh-260px)]">
              <CardHeader>
                <CardTitle>Staff Chat</CardTitle>
                <p className="text-sm text-gray-600">Collaborate in real time and declare alerts</p>
              </CardHeader>
              <CardContent className="h-full p-0">
                <ITStaffChat />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <p className="text-gray-900">{selectedItem.title}</p>
              </div>
              {selectedItem.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-gray-900">{selectedItem.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <Badge className={getPriorityColor(selectedItem.priority || selectedItem.severity)}>
                    {selectedItem.priority || selectedItem.severity}
                  </Badge>
                </div>
              </div>
              {selectedItem.assignedTo && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
                  <p className="text-gray-900">{selectedItem.assignedTo}</p>
                </div>
              )}
              {selectedItem.dueDate && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Due Date</Label>
                  <p className="text-gray-900">{selectedItem.dueDate}</p>
                </div>
              )}
              {selectedItem.estimatedTime && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Estimated Time</Label>
                  <p className="text-gray-900">{selectedItem.estimatedTime}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={editingItem.priority || editingItem.severity || 'medium'} onValueChange={(value) => setEditingItem({ ...editingItem, priority: value, severity: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={editingItem.status || 'pending'} onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={editingItem.assignedTo || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, assignedTo: e.target.value })}
                  />
                </div>
                {editingItem.category && (
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WiFi">WiFi</SelectItem>
                        <SelectItem value="IPTV">IPTV</SelectItem>
                        <SelectItem value="CCTV">CCTV</SelectItem>
                        <SelectItem value="Telephony">Telephony</SelectItem>
                        <SelectItem value="Digital Signage">Digital Signage</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              {editingItem.estimatedTime && (
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time</Label>
                  <Input
                    id="estimatedTime"
                    value={editingItem.estimatedTime || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, estimatedTime: e.target.value })}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
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

      {/* New Item Modal */}
      <Dialog open={isNewItemModalOpen} onOpenChange={setIsNewItemModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New {activeTab === 'tasks' ? 'Task' : activeTab === 'issues' ? 'Issue' : 'Operation'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newTitle">Title *</Label>
              <Input
                id="newTitle"
                value={newItem.title || ''}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter title..."
                className={!newItem.title ? 'border-red-300' : ''}
              />
              {!newItem.title && (
                <p className="text-sm text-red-500 mt-1">Title is required</p>
              )}
            </div>
            <div>
              <Label htmlFor="newDescription">Description</Label>
              <Textarea
                id="newDescription"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPriority">Priority</Label>
                <Select value={newItem.priority || 'medium'} onValueChange={(value) => setNewItem({ ...newItem, priority: value, severity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newStatus">Status</Label>
                <Select value={newItem.status || 'pending'} onValueChange={(value) => setNewItem({ ...newItem, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newAssignedTo">Assigned To</Label>
                <Input
                  id="newAssignedTo"
                  value={newItem.assignedTo || ''}
                  onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
                  placeholder="Enter assignee..."
                />
              </div>
              {activeTab === 'tasks' && (
                <div>
                  <Label htmlFor="newCategory">Category</Label>
                  <Select value={newItem.category || 'General'} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WiFi">WiFi</SelectItem>
                      <SelectItem value="IPTV">IPTV</SelectItem>
                      <SelectItem value="CCTV">CCTV</SelectItem>
                      <SelectItem value="Telephony">Telephony</SelectItem>
                      <SelectItem value="Digital Signage">Digital Signage</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {activeTab === 'tasks' && (
              <div>
                <Label htmlFor="newEstimatedTime">Estimated Time</Label>
                <Input
                  id="newEstimatedTime"
                  value={newItem.estimatedTime || ''}
                  onChange={(e) => setNewItem({ ...newItem, estimatedTime: e.target.value })}
                  placeholder="e.g., 2h, 1.5h..."
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewItemModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateNewItem}
                disabled={!newItem.title || !newItem.title.trim()}
              >
                Create {activeTab === 'tasks' ? 'Task' : activeTab === 'issues' ? 'Issue' : 'Operation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      

    </div>
  );
}
