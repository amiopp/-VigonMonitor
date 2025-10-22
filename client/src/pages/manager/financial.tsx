import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, 
  Download, RefreshCw, Settings, ArrowLeft, Eye, Calculator,
  Target, AlertTriangle, CheckCircle
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock financial data
const mockFinancialData = {
  totalMonthlyCost: 127400,
  totalMonthlyRevenue: 89200,
  totalProfit: 89200 - 127400,
  averageCostPerRoom: 127400 / 3200,
  topPerformingHotels: [
    { name: 'Savoy', profitMargin: 15.2, monthlyCost: 6800, monthlyRevenue: 9800, roomCount: 120, occupancyRate: 87 },
    { name: 'Ritz', profitMargin: 12.8, monthlyCost: 7200, monthlyRevenue: 11000, roomCount: 95, occupancyRate: 92 },
    { name: 'Marriott', profitMargin: 11.5, monthlyCost: 8500, monthlyRevenue: 12000, roomCount: 150, occupancyRate: 89 },
    { name: 'Hilton', profitMargin: 9.8, monthlyCost: 9200, monthlyRevenue: 13500, roomCount: 180, occupancyRate: 85 },
    { name: 'Fairmont', profitMargin: 8.2, monthlyCost: 7800, monthlyRevenue: 10200, roomCount: 110, occupancyRate: 83 }
  ],
  costBreakdown: [
    { category: 'WiFi Infrastructure', cost: 45000, percentage: 35.3, trend: 'up', change: '+2.1%' },
    { category: 'IPTV Systems', cost: 32000, percentage: 25.1, trend: 'down', change: '-1.8%' },
    { category: 'CCTV & Security', cost: 18000, percentage: 14.1, trend: 'stable', change: '0.0%' },
    { category: 'Telephony', cost: 22000, percentage: 17.3, trend: 'up', change: '+0.9%' },
    { category: 'Digital Signage', cost: 10400, percentage: 8.2, trend: 'down', change: '-0.5%' }
  ],
  monthlyTrends: [
    { month: 'Jan', cost: 125000, revenue: 88000, profit: -37000, rooms: 3200, occupancy: 78 },
    { month: 'Feb', cost: 128000, revenue: 89000, profit: -39000, rooms: 3200, occupancy: 81 },
    { month: 'Mar', cost: 126000, revenue: 92000, profit: -34000, rooms: 3200, occupancy: 85 },
    { month: 'Apr', cost: 127400, revenue: 89200, profit: -38200, rooms: 3200, occupancy: 79 }
  ],
  costOptimization: [
    { area: 'WiFi Infrastructure', currentCost: 45000, potentialSavings: 8500, recommendations: ['Optimize bandwidth allocation', 'Implement smart routing', 'Upgrade to more efficient hardware'] },
    { area: 'IPTV Systems', currentCost: 32000, potentialSavings: 4200, recommendations: ['Consolidate channel packages', 'Implement content caching', 'Optimize streaming protocols'] },
    { area: 'Energy Management', currentCost: 18000, potentialSavings: 3600, recommendations: ['Implement smart power management', 'Upgrade to energy-efficient equipment', 'Optimize cooling systems'] }
  ]
};

export default function FinancialPage() {
  const [, setLocation] = useLocation();
  const [financialPeriod, setFinancialPeriod] = useState("monthly");
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isHotelDetailsOpen, setIsHotelDetailsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Helper functions
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getProfitIcon = (profit: number) => {
    return profit >= 0 ? <TrendingUp className="h-6 w-6 text-green-600" /> : <TrendingDown className="h-6 w-6 text-red-600" />;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Chart data preparation
  const costBreakdownData = mockFinancialData.costBreakdown.map(item => ({
    name: item.category,
    value: item.cost,
    percentage: item.percentage
  }));

  const monthlyTrendsData = mockFinancialData.monthlyTrends.map(item => ({
    month: item.month,
    cost: item.cost,
    revenue: item.revenue,
    profit: item.profit,
    occupancy: item.occupancy
  }));

  const handleViewHotelDetails = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsHotelDetailsOpen(true);
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleRefresh = () => {
    console.log("Refreshing financial data...");
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setLocation("/manager-dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Analysis</h1>
                <p className="text-gray-600">Comprehensive financial performance and cost analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={financialPeriod} onValueChange={setFinancialPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Monthly Cost */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${mockFinancialData.totalMonthlyCost.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                  <span>+2.4% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Monthly Revenue */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${mockFinancialData.totalMonthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span>+5.2% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Profit/Loss */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit/Loss</p>
                  <p className={`text-2xl font-bold ${getProfitColor(mockFinancialData.totalProfit)}`}>
                    ${mockFinancialData.totalProfit.toLocaleString()}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${mockFinancialData.totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {getProfitIcon(mockFinancialData.totalProfit)}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  {mockFinancialData.totalProfit >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                  )}
                  <span>{mockFinancialData.totalProfit >= 0 ? '+12.8%' : '-8.3%'} from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Cost per Room */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Cost per Room</p>
                  <p className="text-2xl font-bold text-gray-900">${mockFinancialData.averageCostPerRoom.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <span>-1.2% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cost Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Cost Breakdown by Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monthly Financial Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Cost" />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Hotels */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Top Performing Hotels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFinancialData.topPerformingHotels.map((hotel, index) => (
                <Card key={hotel.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                      <Badge className={index < 3 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin:</span>
                        <span className="font-medium text-green-600">{hotel.profitMargin}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Cost:</span>
                        <span className="font-medium">${hotel.monthlyCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Revenue:</span>
                        <span className="font-medium">${hotel.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-medium">{hotel.roomCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupancy:</span>
                        <span className="font-medium">{hotel.occupancyRate}%</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleViewHotelDetails(hotel)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Optimization Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Cost Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFinancialData.costOptimization.map((optimization) => (
                <div key={optimization.area} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{optimization.area}</h4>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Current Cost: ${optimization.currentCost.toLocaleString()}</p>
                      <p className="text-lg font-bold text-green-600">Potential Savings: ${optimization.potentialSavings.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {optimization.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hotel Details Modal */}
        <Dialog open={isHotelDetailsOpen} onOpenChange={setIsHotelDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Hotel Financial Details</DialogTitle>
            </DialogHeader>
            {selectedHotel && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedHotel.name}</h3>
                  <Badge className="text-lg px-4 py-2">
                    Profit Margin: {selectedHotel.profitMargin}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-xl font-bold text-gray-900">${selectedHotel.monthlyCost.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-xl font-bold text-green-600">${selectedHotel.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Room Count</p>
                    <p className="text-xl font-bold text-gray-900">{selectedHotel.roomCount}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Occupancy Rate</p>
                    <p className="text-xl font-bold text-blue-600">{selectedHotel.occupancyRate}%</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Cost per Room</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(selectedHotel.monthlyCost / selectedHotel.roomCount).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Export Modal */}
        <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Financial Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date Range</Label>
                <Select defaultValue="current">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Period</SelectItem>
                    <SelectItem value="last3">Last 3 Months</SelectItem>
                    <SelectItem value="last6">Last 6 Months</SelectItem>
                    <SelectItem value="year">Full Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log("Exporting financial report...");
                  setIsExportOpen(false);
                }}>
                  Export
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Modal */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Financial Dashboard Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Default Period</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log("Saving financial settings...");
                  setIsSettingsOpen(false);
                }}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
