import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Download, Calendar, RefreshCw, Settings, Share2, Printer, 
  FileText, BarChart3, TrendingUp, DollarSign, Building2,
  Eye, Clock, Users, Zap
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function FinancialReports() {
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [currency, setCurrency] = useState("USD");
  const [financialPeriod, setFinancialPeriod] = useState("monthly");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [exportSettings, setExportSettings] = useState({
    format: "pdf",
    includeCharts: true,
    includeData: true,
    dateRange: "current",
    recipients: ""
  });
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: "weekly",
    day: "monday",
    time: "09:00",
    recipients: "",
    format: "pdf",
    enabled: false
  });

  // Calculate period-specific financial data
  const getFinancialData = (period: string) => {
    const baseData = {
      monthly: {
        totalRevenue: 892000,
        totalCosts: 1274000,
        netProfit: -382000,
        trends: [
          { month: 'Jan', revenue: 880000, costs: 1250000, profit: -370000 },
          { month: 'Feb', revenue: 890000, costs: 1280000, profit: -390000 },
          { month: 'Mar', revenue: 920000, costs: 1260000, profit: -340000 },
          { month: 'Apr', revenue: 892000, costs: 1274000, profit: -382000 }
        ]
      },
      yearly: {
        totalRevenue: 10704000,
        totalCosts: 15288000,
        netProfit: -4584000,
        trends: [
          { month: 'Q1', revenue: 2690000, costs: 3790000, profit: -1100000 },
          { month: 'Q2', revenue: 2710000, costs: 3820000, profit: -1110000 },
          { month: 'Q3', revenue: 2750000, costs: 3840000, profit: -1090000 },
          { month: 'Q4', revenue: 2550000, costs: 3830000, profit: -1280000 }
        ]
      }
    };

    return baseData[period as keyof typeof baseData] || baseData.monthly;
  };

  const financialData = getFinancialData(financialPeriod);

  // Action handlers
  const handleExport = () => {
    // Create export data
    const exportData = {
      reportType: "financial-report",
      timestamp: new Date().toISOString(),
      settings: exportSettings,
      data: financialData
    };

    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vigon-financial-report-${exportSettings.format}-${exportSettings.dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification("Report exported successfully", "success");
    setIsExportOpen(false);
  };

  const handleSchedule = () => {
    showNotification("Report scheduling configured", "success");
    setIsScheduleOpen(false);
  };

  const handleRefresh = () => {
    showNotification("Data refreshed", "success");
  };

  const handleShare = () => {
    showNotification("Report shared successfully", "success");
  };

  const handlePrint = () => {
    window.print();
    showNotification("Print dialog opened", "info");
  };

  const handleSaveSettings = () => {
    localStorage.setItem('financialReportSettings', JSON.stringify({
      autoRefresh,
      refreshInterval
    }));
    showNotification("Settings saved", "success");
    setIsSettingsOpen(false);
  };

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

  const formatCurrency = (amount: number, currency: string) => {
    const rate = getExchangeRate(currency);
    const converted = amount * rate;
    const symbol = getCurrencySymbol(currency);
    
    if (currency === 'MAD') {
      return `${symbol} ${converted.toLocaleString('ar-MA', { minimumFractionDigits: 2 })}`;
    }
    
    return `${symbol}${converted.toLocaleString()}`;
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  // Load saved settings
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    
    const savedPeriod = localStorage.getItem('financialPeriod');
    if (savedPeriod) {
      setFinancialPeriod(savedPeriod);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600">Comprehensive financial analysis and reporting</p>
            </div>
                         <div className="flex items-center space-x-4">
               {/* Period Selector */}
               <Select value={financialPeriod} onValueChange={setFinancialPeriod}>
                 <SelectTrigger className="w-32">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="monthly">Monthly</SelectItem>
                   <SelectItem value="yearly">Yearly</SelectItem>
                 </SelectContent>
               </Select>
               
               {/* Currency Selector */}
               <Select value={currency} onValueChange={setCurrency}>
                 <SelectTrigger className="w-24">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="USD">USD</SelectItem>
                   <SelectItem value="EUR">EUR</SelectItem>
                   <SelectItem value="GBP">GBP</SelectItem>
                   <SelectItem value="MAD">MAD</SelectItem>
                 </SelectContent>
               </Select>
              
              <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" onClick={() => setIsExportOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
                             {/* Save Period Button */}
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={() => {
                   localStorage.setItem('financialPeriod', financialPeriod);
                   showNotification("Period setting saved successfully", "success");
                 }}
                 className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
               >
                 Save Period
               </Button>
               
               {/* Save Currency Button */}
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={() => {
                   localStorage.setItem('currency', currency);
                   showNotification("Currency setting saved successfully", "success");
                 }}
                 className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
               >
                 Save Currency
               </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.totalRevenue, currency)}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Costs</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(financialData.totalCosts, currency)}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Net Profit</p>
                      <p className={`text-2xl font-bold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(financialData.netProfit, currency)}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${financialData.netProfit >= 0 ? 'bg-green-100' : 'bg-red-600'}`}>
                      <BarChart3 className={`h-6 w-6 ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Properties</p>
                      <p className="text-2xl font-bold text-blue-600">{financialData.hotelPerformance.length}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hotel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.hotelPerformance.map((hotel) => (
                    <div key={hotel.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{hotel.name}</h4>
                          <p className="text-sm text-gray-600">Profit Margin: {hotel.margin}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(hotel.profit, currency)}</p>
                        <p className="text-xs text-gray-500">Net Profit</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={handleShare}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handlePrint}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsExportOpen(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Monthly Financial Summary", type: "summary", icon: FileText, description: "Comprehensive monthly overview" },
                { title: "Cost Analysis Report", type: "costs", icon: BarChart3, description: "Detailed cost breakdown" },
                { title: "Revenue Performance", type: "revenue", icon: TrendingUp, description: "Revenue trends and analysis" },
                { title: "Hotel Comparison", type: "comparison", icon: Building2, description: "Cross-property performance" },
                { title: "Profitability Analysis", type: "profitability", icon: DollarSign, description: "Profit margins and trends" },
                { title: "Energy Cost Report", type: "energy", icon: Zap, description: "Power consumption and costs" }
              ].map((report) => (
                <Card key={report.type} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <report.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setIsExportOpen(true)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scheduled Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
              <Button onClick={() => setIsScheduleOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                New Schedule
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "Weekly Financial Summary", frequency: "Weekly", day: "Monday", time: "09:00", recipients: "finance@company.com", status: "active" },
                    { name: "Monthly Cost Report", frequency: "Monthly", day: "1st", time: "08:00", recipients: "managers@company.com", status: "active" },
                    { name: "Quarterly Review", frequency: "Quarterly", day: "1st", time: "10:00", recipients: "executives@company.com", status: "paused" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                          <p className="text-sm text-gray-600">
                            {schedule.frequency} • {schedule.day} • {schedule.time}
                          </p>
                          <p className="text-xs text-gray-500">{schedule.recipients}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {schedule.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoRefresh">Auto Refresh</Label>
                      <p className="text-sm text-gray-500">Automatically refresh report data</p>
                    </div>
                    <Switch
                      id="autoRefresh"
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="refreshInterval">Refresh Interval</Label>
                      <p className="text-sm text-gray-500">How often to refresh data</p>
                    </div>
                    <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15000">15 seconds</SelectItem>
                        <SelectItem value="30000">30 seconds</SelectItem>
                        <SelectItem value="60000">1 minute</SelectItem>
                        <SelectItem value="300000">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Export Modal */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exportFormat">Format</Label>
              <Select value={exportSettings.format} onValueChange={(value) => setExportSettings({...exportSettings, format: value})}>
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
              <Label htmlFor="exportDateRange">Date Range</Label>
              <Select value={exportSettings.dateRange} onValueChange={(value) => setExportSettings({...exportSettings, dateRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Period</SelectItem>
                  <SelectItem value="last3months">Last 3 Months</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeCharts"
                  checked={exportSettings.includeCharts}
                  onChange={(e) => setExportSettings({...exportSettings, includeCharts: e.target.checked})}
                />
                <Label htmlFor="includeCharts">Include Charts</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeData"
                  checked={exportSettings.includeData}
                  onChange={(e) => setExportSettings({...exportSettings, includeData: e.target.checked})}
                />
                <Label htmlFor="includeData">Include Raw Data</Label>
              </div>
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

      {/* Schedule Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduleFrequency">Frequency</Label>
              <Select value={scheduleSettings.frequency} onValueChange={(value) => setScheduleSettings({...scheduleSettings, frequency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {scheduleSettings.frequency === 'weekly' && (
              <div>
                <Label htmlFor="scheduleDay">Day</Label>
                <Select value={scheduleSettings.day} onValueChange={(value) => setScheduleSettings({...scheduleSettings, day: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="scheduleTime">Time</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={scheduleSettings.time}
                onChange={(e) => setScheduleSettings({...scheduleSettings, time: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="scheduleRecipients">Recipients</Label>
              <Input
                id="scheduleRecipients"
                placeholder="email@example.com"
                value={scheduleSettings.recipients}
                onChange={(e) => setScheduleSettings({...scheduleSettings, recipients: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSchedule}>
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

