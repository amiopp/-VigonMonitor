import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, DollarSign, TrendingUp, TrendingDown, 
  Wifi, Tv, Shield, Phone, Monitor, Users, Zap,
  Download, BarChart3, Calendar, Star, AlertTriangle,
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  CheckCircle, XCircle, Clock, Target, Award
} from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  code: string;
  location: string;
  rooms: number;
  status: string;
  rating: number;
  occupancyRate: number;
  financials: {
    monthlyCost: number;
    monthlyRevenue: number;
    profitMargin: number;
    energyCost: number;
    maintenanceCost: number;
    staffCost: number;
    marketingCost: number;
    previousMonthRevenue: number;
    revenueGrowth: number;
    costEfficiency: number;
  };
  services: {
    wifi: { status: string; uptime: number; cost: number; revenue: number; issues: number };
    iptv: { status: string; uptime: number; cost: number; revenue: number; issues: number };
    cctv: { status: string; uptime: number; cost: number; revenue: number; issues: number };
    telephony: { status: string; uptime: number; cost: number; revenue: number; issues: number };
    signage: { status: string; uptime: number; cost: number; revenue: number; issues: number };
  };
  performance: {
    customerSatisfaction: number;
    staffPerformance: number;
    energyEfficiency: number;
    maintenanceScore: number;
    overallScore: number;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
  };
}

interface HotelSelectorProps {
  selectedHotel: string;
  onHotelSelect: (hotelId: string) => void;
  currency: string;
}

export default function HotelSelector({ selectedHotel, onHotelSelect, currency }: HotelSelectorProps) {
  // Sample hotel data - in real app, this would come from API
  const hotels: Hotel[] = [
    {
      id: "hotel-1",
      name: "Fairmont Royal Palm",
      code: "FAIRMONT",
      location: "Marrakech, Morocco",
      rooms: 250,
      status: "active",
      rating: 4.8,
      occupancyRate: 87,
      financials: {
        monthlyCost: 45000,
        monthlyRevenue: 68000,
        profitMargin: 33.8,
        energyCost: 12000,
        maintenanceCost: 8000,
        staffCost: 15000,
        marketingCost: 5000,
        previousMonthRevenue: 65000,
        revenueGrowth: 4.6,
        costEfficiency: 85.2
      },
      services: {
        wifi: { status: "active", uptime: 99.2, cost: 15000, revenue: 22000, issues: 2 },
        iptv: { status: "active", uptime: 98.7, cost: 12000, revenue: 18000, issues: 1 },
        cctv: { status: "active", uptime: 99.9, cost: 8000, revenue: 12000, issues: 0 },
        telephony: { status: "active", uptime: 99.5, cost: 7000, revenue: 10000, issues: 1 },
        signage: { status: "active", uptime: 97.8, cost: 3000, revenue: 6000, issues: 3 }
      },
      performance: {
        customerSatisfaction: 92,
        staffPerformance: 88,
        energyEfficiency: 85,
        maintenanceScore: 90,
        overallScore: 89
      },
      alerts: {
        critical: 0,
        warning: 2,
        info: 5
      }
    },
    {
      id: "hotel-2",
      name: "Savoy Le Grand",
      code: "SAVOY",
      location: "Marrakech, Morocco",
      rooms: 180,
      status: "active",
      rating: 4.6,
      occupancyRate: 82,
      financials: {
        monthlyCost: 38000,
        monthlyRevenue: 58000,
        profitMargin: 34.5,
        energyCost: 10000,
        maintenanceCost: 7000,
        staffCost: 12000,
        marketingCost: 4000,
        previousMonthRevenue: 55000,
        revenueGrowth: 5.5,
        costEfficiency: 87.1
      },
      services: {
        wifi: { status: "active", uptime: 98.9, cost: 12000, revenue: 19000, issues: 1 },
        iptv: { status: "active", uptime: 99.1, cost: 10000, revenue: 16000, issues: 0 },
        cctv: { status: "active", uptime: 99.8, cost: 7000, revenue: 11000, issues: 1 },
        telephony: { status: "active", uptime: 99.3, cost: 6000, revenue: 9000, issues: 2 },
        signage: { status: "active", uptime: 98.2, cost: 3000, revenue: 5000, issues: 2 }
      },
      performance: {
        customerSatisfaction: 89,
        staffPerformance: 85,
        energyEfficiency: 82,
        maintenanceScore: 87,
        overallScore: 86
      },
      alerts: {
        critical: 1,
        warning: 3,
        info: 4
      }
    },
    {
      id: "hotel-3",
      name: "RITZ Paris",
      code: "RITZ",
      location: "Paris, France",
      rooms: 142,
      status: "active",
      rating: 4.9,
      occupancyRate: 94,
      financials: {
        monthlyCost: 52000,
        monthlyRevenue: 85000,
        profitMargin: 38.8,
        energyCost: 14000,
        maintenanceCost: 9000,
        staffCost: 18000,
        marketingCost: 6000,
        previousMonthRevenue: 82000,
        revenueGrowth: 3.7,
        costEfficiency: 89.3
      },
      services: {
        wifi: { status: "active", uptime: 99.5, cost: 18000, revenue: 28000, issues: 0 },
        iptv: { status: "active", uptime: 99.2, cost: 15000, revenue: 24000, issues: 1 },
        cctv: { status: "active", uptime: 99.9, cost: 9000, revenue: 14000, issues: 0 },
        telephony: { status: "active", uptime: 99.7, cost: 8000, revenue: 12000, issues: 0 },
        signage: { status: "active", uptime: 98.9, cost: 2000, revenue: 7000, issues: 1 }
      },
      performance: {
        customerSatisfaction: 95,
        staffPerformance: 92,
        energyEfficiency: 88,
        maintenanceScore: 93,
        overallScore: 92
      },
      alerts: {
        critical: 0,
        warning: 1,
        info: 3
      }
    },
    {
      id: "hotel-4",
      name: "SAPST",
      code: "SAPST",
      location: "Casablanca, Morocco",
      rooms: 120,
      status: "active",
      rating: 4.3,
      occupancyRate: 75,
      financials: {
        monthlyCost: 28000,
        monthlyRevenue: 42000,
        profitMargin: 33.3,
        energyCost: 8000,
        maintenanceCost: 5000,
        staffCost: 9000,
        marketingCost: 3000,
        previousMonthRevenue: 40000,
        revenueGrowth: 5.0,
        costEfficiency: 83.7
      },
      services: {
        wifi: { status: "active", uptime: 97.8, cost: 9000, revenue: 14000, issues: 4 },
        iptv: { status: "active", uptime: 98.2, cost: 8000, revenue: 12000, issues: 2 },
        cctv: { status: "active", uptime: 99.5, cost: 6000, revenue: 9000, issues: 1 },
        telephony: { status: "active", uptime: 98.9, cost: 4000, revenue: 6000, issues: 3 },
        signage: { status: "active", uptime: 97.1, cost: 1000, revenue: 1000, issues: 5 }
      },
      performance: {
        customerSatisfaction: 84,
        staffPerformance: 81,
        energyEfficiency: 78,
        maintenanceScore: 82,
        overallScore: 81
      },
      alerts: {
        critical: 2,
        warning: 4,
        info: 6
      }
    },
    {
      id: "hotel-5",
      name: "CRI",
      code: "CRI",
      location: "Rabat, Morocco",
      rooms: 95,
      status: "active",
      rating: 4.1,
      occupancyRate: 68,
      financials: {
        monthlyCost: 22000,
        monthlyRevenue: 32000,
        profitMargin: 31.3,
        energyCost: 6000,
        maintenanceCost: 4000,
        staffCost: 7000,
        marketingCost: 2000,
        previousMonthRevenue: 30000,
        revenueGrowth: 6.7,
        costEfficiency: 80.2
      },
      services: {
        wifi: { status: "active", uptime: 97.2, cost: 7000, revenue: 10000, issues: 5 },
        iptv: { status: "active", uptime: 97.8, cost: 6000, revenue: 9000, issues: 3 },
        cctv: { status: "active", uptime: 99.2, cost: 5000, revenue: 7000, issues: 2 },
        telephony: { status: "active", uptime: 98.5, cost: 3000, revenue: 4000, issues: 4 },
        signage: { status: "active", uptime: 96.8, cost: 1000, revenue: 2000, issues: 6 }
      },
      performance: {
        customerSatisfaction: 81,
        staffPerformance: 78,
        energyEfficiency: 75,
        maintenanceScore: 79,
        overallScore: 78
      },
      alerts: {
        critical: 3,
        warning: 5,
        info: 7
      }
    },
    {
      id: "hotel-6",
      name: "Four Seasons",
      code: "FS",
      location: "Marrakech, Morocco",
      rooms: 200,
      status: "active",
      rating: 4.7,
      occupancyRate: 89,
      financials: {
        monthlyCost: 48000,
        monthlyRevenue: 72000,
        profitMargin: 33.3,
        energyCost: 13000,
        maintenanceCost: 8000,
        staffCost: 16000,
        marketingCost: 5000,
        previousMonthRevenue: 68000,
        revenueGrowth: 5.9,
        costEfficiency: 86.8
      },
      services: {
        wifi: { status: "active", uptime: 99.3, cost: 16000, revenue: 24000, issues: 1 },
        iptv: { status: "active", uptime: 98.9, cost: 13000, revenue: 20000, issues: 2 },
        cctv: { status: "active", uptime: 99.8, cost: 8000, revenue: 12000, issues: 0 },
        telephony: { status: "active", uptime: 99.4, cost: 7000, revenue: 11000, issues: 1 },
        signage: { status: "active", uptime: 98.5, cost: 4000, revenue: 7000, issues: 2 }
      },
      performance: {
        customerSatisfaction: 91,
        staffPerformance: 87,
        energyEfficiency: 84,
        maintenanceScore: 89,
        overallScore: 88
      },
      alerts: {
        critical: 0,
        warning: 2,
        info: 4
      }
    }
  ];

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'MAD': return 'MAD';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const getExchangeRate = (currency: string) => {
    switch (currency) {
      case 'MAD': return 10.5; // 1 USD = 10.5 MAD
      case 'USD': return 1;
      case 'EUR': return 0.85;
      case 'GBP': return 0.73;
      default: return 1;
    }
  };

  const convertCurrency = (amount: number, currency: string) => {
    const rate = getExchangeRate(currency);
    return amount * rate;
  };

  const formatCurrency = (amount: number, currency: string) => {
    const converted = convertCurrency(amount, currency);
    const symbol = getCurrencySymbol(currency);
    
    if (currency === 'MAD') {
      return `${symbol} ${converted.toLocaleString('ar-MA', { minimumFractionDigits: 2 })}`;
    }
    
    return `${symbol}${converted.toLocaleString()}`;
  };

  const selectedHotelData = hotels.find(hotel => hotel.id === selectedHotel);

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'iptv': return <Tv className="h-4 w-4" />;
      case 'cctv': return <Shield className="h-4 w-4" />;
      case 'telephony': return <Phone className="h-4 w-4" />;
      case 'signage': return <Monitor className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportPortfolio = () => {
    const exportData = {
      exportType: "hotel-portfolio-management",
      timestamp: new Date().toISOString(),
      currency: currency,
      selectedHotel: selectedHotel,
      portfolioData: {
        hotels: hotels,
        selectedHotel: selectedHotelData,
        summary: {
          totalHotels: hotels.length,
          totalRooms: hotels.reduce((sum, hotel) => sum + hotel.rooms, 0),
          averageRating: hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length,
          averageOccupancy: hotels.reduce((sum, hotel) => sum + hotel.occupancyRate, 0) / hotels.length,
          totalRevenue: hotels.reduce((sum, hotel) => sum + hotel.financials.monthlyRevenue, 0),
          totalCosts: hotels.reduce((sum, hotel) => sum + hotel.financials.monthlyCost, 0)
        }
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vigon-hotel-portfolio-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">


      {/* Hotel Selector with Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Hotel:</label>
          <Select value={selectedHotel} onValueChange={onHotelSelect}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Choose a hotel to analyze" />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id}>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{hotel.name}</span>
                    <span className="text-gray-500">({hotel.code})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleExportPortfolio}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Portfolio
        </Button>
      </div>

      {/* Hotel Details */}
      {selectedHotelData && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {selectedHotelData.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{selectedHotelData.code}</p>
                <p className="text-xs text-gray-500">{selectedHotelData.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(selectedHotelData.status)}>
                  {selectedHotelData.status}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{selectedHotelData.rating}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">Rooms</p>
                <p className="text-lg font-bold text-blue-600">{selectedHotelData.rooms}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">Occupancy</p>
                <p className="text-lg font-bold text-green-600">{selectedHotelData.occupancyRate}%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">Rating</p>
                <p className="text-lg font-bold text-yellow-600">{selectedHotelData.rating}/5</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">Overall Score</p>
                <p className={`text-lg font-bold ${getPerformanceColor(selectedHotelData.performance.overallScore)}`}>
                  {selectedHotelData.performance.overallScore}%
                </p>
              </div>
            </div>

            {/* Tabs for Detailed Information */}
            <Tabs defaultValue="financials" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              {/* Financials Tab */}
              <TabsContent value="financials" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Monthly Revenue</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedHotelData.financials.monthlyRevenue, currency)}
                      </p>
                      <div className="flex items-center text-xs">
                        {selectedHotelData.financials.revenueGrowth >= 0 ? (
                          <TrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={selectedHotelData.financials.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {selectedHotelData.financials.revenueGrowth}% vs last month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Monthly Costs</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(selectedHotelData.financials.monthlyCost, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Profit Margin</p>
                      <p className={`text-lg font-bold ${
                        selectedHotelData.financials.profitMargin >= 30 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {selectedHotelData.financials.profitMargin}%
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Cost Efficiency</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(selectedHotelData.financials.costEfficiency)}`}>
                        {selectedHotelData.financials.costEfficiency}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cost Breakdown */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Energy Costs</span>
                      <span className="font-medium">{formatCurrency(selectedHotelData.financials.energyCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Maintenance</span>
                      <span className="font-medium">{formatCurrency(selectedHotelData.financials.maintenanceCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Staff</span>
                      <span className="font-medium">{formatCurrency(selectedHotelData.financials.staffCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marketing</span>
                      <span className="font-medium">{formatCurrency(selectedHotelData.financials.marketingCost, currency)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-4">
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(selectedHotelData.services).map(([serviceType, service]) => (
                    <div key={serviceType} className="text-center p-3 bg-white rounded-lg">
                      <div className="flex justify-center mb-2">
                        {getServiceIcon(serviceType)}
                      </div>
                      <p className="text-xs font-medium text-gray-700 capitalize">{serviceType}</p>
                      <div className={`w-3 h-3 rounded-full mx-auto my-1 ${
                        service.status === 'active' ? 'bg-green-500' : 
                        service.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <p className="text-xs text-gray-500">{service.uptime}% uptime</p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(service.revenue, currency)} revenue
                      </p>
                      {service.issues > 0 && (
                        <div className="flex items-center justify-center mt-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
                          <span className="text-xs text-orange-600">{service.issues} issues</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Customer Satisfaction</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(selectedHotelData.performance.customerSatisfaction)}`}>
                        {selectedHotelData.performance.customerSatisfaction}%
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Staff Performance</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(selectedHotelData.performance.staffPerformance)}`}>
                        {selectedHotelData.performance.staffPerformance}%
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Energy Efficiency</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(selectedHotelData.performance.energyEfficiency)}`}>
                        {selectedHotelData.performance.energyEfficiency}%
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600">Maintenance Score</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(selectedHotelData.performance.maintenanceScore)}`}>
                        {selectedHotelData.performance.maintenanceScore}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Overall Performance Chart */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Overview</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getPerformanceColor(selectedHotelData.performance.overallScore).replace('text-', 'bg-')}`}
                            style={{ width: `${selectedHotelData.performance.overallScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{selectedHotelData.performance.overallScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Alerts Tab */}
              <TabsContent value="alerts" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{selectedHotelData.alerts.critical}</p>
                    <p className="text-sm text-gray-600">Critical</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{selectedHotelData.alerts.warning}</p>
                    <p className="text-sm text-gray-600">Warning</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedHotelData.alerts.info}</p>
                    <p className="text-sm text-gray-600">Info</p>
                  </div>
                </div>
                
                {/* Alert Summary */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Alert Summary</h4>
                  <div className="space-y-2">
                    {selectedHotelData.alerts.critical > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">{selectedHotelData.alerts.critical} critical issues require immediate attention</span>
                      </div>
                    )}
                    {selectedHotelData.alerts.warning > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-700">{selectedHotelData.alerts.warning} warnings need monitoring</span>
                      </div>
                    )}
                    {selectedHotelData.alerts.info > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-700">{selectedHotelData.alerts.info} informational updates available</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {!selectedHotelData && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please select a hotel to view its detailed financial analysis and performance metrics.</p>
        </div>
      )}
    </div>
  );
}

