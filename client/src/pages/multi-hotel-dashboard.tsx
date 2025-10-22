import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Search, Filter, Download, RefreshCw, Eye, 
  TrendingUp, TrendingDown, Users, Wifi, Tv, Camera, Phone,
  BarChart3, MapPin, Star, AlertTriangle, CheckCircle
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function MultiHotelDashboard() {
  // State management
  const [viewMode, setViewMode] = useState("overview");
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isHotelDetailOpen, setIsHotelDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Sample hotel data
  const hotels = [
    {
      id: "savoy",
      name: "Savoy Hotel",
      location: "London, UK",
      status: "active",
      rooms: 268,
      guests: 245,
      uptime: 99.2,
      revenue: 98000,
      costs: 68000,
      profit: 30000,
      services: ["WiFi", "IPTV", "CCTV", "Telephony"],
      rating: 4.8,
      issues: 0
    },
    {
      id: "ritz",
      name: "Ritz Paris",
      location: "Paris, France",
      status: "active",
      rooms: 142,
      guests: 138,
      uptime: 98.7,
      revenue: 110000,
      costs: 72000,
      profit: 38000,
      services: ["WiFi", "IPTV", "CCTV", "Telephony", "Digital Signage"],
      rating: 4.9,
      issues: 1
    },
    {
      id: "marriott",
      name: "Marriott Marquis",
      location: "New York, USA",
      status: "maintenance",
      rooms: 1896,
      guests: 1650,
      uptime: 95.3,
      revenue: 120000,
      costs: 85000,
      profit: 35000,
      services: ["WiFi", "IPTV", "CCTV", "Telephony"],
      rating: 4.6,
      issues: 3
    },
    {
      id: "fairmont",
      name: "Fairmont Marrakech",
      location: "Marrakech, Morocco",
      status: "active",
      rooms: 245,
      guests: 189,
      uptime: 97.8,
      revenue: 85000,
      costs: 62000,
      profit: 23000,
      services: ["WiFi", "IPTV", "CCTV", "Telephony"],
      rating: 4.7,
      issues: 2
    }
  ];

  // Filtered hotels based on search and filters
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || hotel.status === filterStatus;
    const matchesLocation = filterLocation === "all" || hotel.location.includes(filterLocation);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Action handlers
  const handleHotelSelect = (hotelId: string) => {
    if (selectedHotels.includes(hotelId)) {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
    } else {
      setSelectedHotels([...selectedHotels, hotelId]);
    }
  };

  const handleViewHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsHotelDetailOpen(true);
  };

  const handleExport = () => {
    showNotification("Export started...", "info");
    setTimeout(() => {
      showNotification("Data exported successfully", "success");
      setIsExportOpen(false);
    }, 2000);
  };

  const handleRefresh = () => {
    showNotification("Data refreshed", "success");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterLocation("all");
    setSelectedHotels([]);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Multi-Hotel Dashboard</h1>
              <p className="text-gray-600">Manage and monitor multiple hotel properties</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setIsExportOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Label className="text-sm font-medium text-gray-700">View Mode:</Label>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "comparison", label: "Comparison", icon: TrendingUp },
                { id: "portfolio", label: "Portfolio", icon: Building2 }
              ].map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode.id)}
                  className="flex items-center space-x-2"
                >
                  <mode.icon className="h-4 w-4" />
                  <span>{mode.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search hotels by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Morocco">Morocco</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Hotel Selection */}
        {viewMode === "comparison" && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Hotels for Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotels.map((hotel) => (
                    <Button
                      key={hotel.id}
                      variant={selectedHotels.includes(hotel.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHotelSelect(hotel.id)}
                    >
                      {hotel.name}
                    </Button>
                  ))}
                </div>
                {selectedHotels.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedHotels.length} hotel(s) selected for comparison
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                      <p className="text-2xl font-bold text-blue-600">{hotels.length}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                      <p className="text-2xl font-bold text-green-600">
                        {hotels.reduce((sum, hotel) => sum + hotel.rooms, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Hotels</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {hotels.filter(h => h.status === 'active').length}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${hotels.reduce((sum, hotel) => sum + hotel.revenue, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hotel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{hotel.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(hotel.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(hotel.status)}
                            <span>{hotel.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Uptime:</span>
                        <span className="font-medium">{hotel.uptime}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-medium">{hotel.rooms}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{hotel.guests}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Revenue: </span>
                        <span className="font-medium text-green-600">${hotel.revenue.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Profit: </span>
                        <span className="font-medium text-blue-600">${hotel.profit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {hotel.services.map((service) => (
                          <div key={service} className="w-2 h-2 bg-blue-500 rounded-full" />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewHotel(hotel)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {hotel.issues > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {hotel.issues} Issues
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            {selectedHotels.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Hotels to Compare</h3>
                  <p className="text-gray-600">Choose 2 or more hotels from the selection above to view detailed comparisons.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Comparison Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Metric</th>
                            {selectedHotels.map(hotelId => {
                              const hotel = hotels.find(h => h.id === hotelId);
                              return (
                                <th key={hotelId} className="text-center py-2">
                                  {hotel?.name}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: 'uptime', label: 'Uptime %', format: (value: number) => `${value}%` },
                            { key: 'rooms', label: 'Total Rooms', format: (value: number) => value.toLocaleString() },
                            { key: 'guests', label: 'Current Guests', format: (value: number) => value.toLocaleString() },
                            { key: 'revenue', label: 'Monthly Revenue', format: (value: number) => `$${value.toLocaleString()}` },
                            { key: 'profit', label: 'Monthly Profit', format: (value: number) => `$${value.toLocaleString()}` },
                            { key: 'rating', label: 'Rating', format: (value: number) => value.toFixed(1) }
                          ].map((metric) => (
                            <tr key={metric.key} className="border-b">
                              <td className="py-2 font-medium">{metric.label}</td>
                              {selectedHotels.map(hotelId => {
                                const hotel = hotels.find(h => h.id === hotelId);
                                return (
                                  <td key={hotelId} className="text-center py-2">
                                    {hotel ? metric.format(hotel[metric.key as keyof typeof hotel] as number) : '-'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {['WiFi', 'IPTV', 'CCTV', 'Telephony', 'Digital Signage'].map((service) => (
                        <div key={service} className="p-4 border rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">{service}</h4>
                          <div className="space-y-2">
                            {selectedHotels.map(hotelId => {
                              const hotel = hotels.find(h => h.id === hotelId);
                              const hasService = hotel?.services.includes(service);
                              return (
                                <div key={hotelId} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">{hotel?.name}</span>
                                  <Badge className={hasService ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                    {hasService ? 'Available' : 'Not Available'}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenue Distribution */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Revenue Distribution</h4>
                    <div className="space-y-3">
                      {hotels.map((hotel) => {
                        const totalRevenue = hotels.reduce((sum, h) => sum + h.revenue, 0);
                        const percentage = ((hotel.revenue / totalRevenue) * 100).toFixed(1);
                        return (
                          <div key={hotel.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{hotel.name}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Profitability Analysis */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Profitability Analysis</h4>
                    <div className="space-y-3">
                      {hotels.map((hotel) => {
                        const margin = ((hotel.profit / hotel.revenue) * 100).toFixed(1);
                        return (
                          <div key={hotel.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{hotel.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${parseFloat(margin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {margin}%
                              </span>
                              <span className="text-sm text-gray-500">
                                ${hotel.profit.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Hotel Detail Modal */}
      <Dialog open={isHotelDetailOpen} onOpenChange={setIsHotelDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedHotel?.name} - Detailed Information</DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <p className="text-gray-900">{selectedHotel.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={getStatusColor(selectedHotel.status)}>
                    {selectedHotel.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Total Rooms</Label>
                  <p className="text-gray-900">{selectedHotel.rooms}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Current Guests</Label>
                  <p className="text-gray-900">{selectedHotel.guests}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Uptime</Label>
                  <p className="text-gray-900">{selectedHotel.uptime}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Rating</Label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{selectedHotel.rating}</span>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Financial Performance</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-lg font-bold text-green-600">${selectedHotel.revenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Costs</p>
                    <p className="text-lg font-bold text-red-600">${selectedHotel.costs.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="text-lg font-bold text-blue-600">${selectedHotel.profit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Available Services</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedHotel.services.map((service: string) => (
                    <Badge key={service} variant="outline" className="bg-blue-50">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Quick Actions</Label>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Performance
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Issues
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Hotel Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exportFormat">Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="exportData">Data to Export</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hotels</SelectItem>
                  <SelectItem value="selected">Selected Hotels</SelectItem>
                  <SelectItem value="filtered">Filtered Results</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

