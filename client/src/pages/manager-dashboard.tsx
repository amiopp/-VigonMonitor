import { useQuery } from "@tanstack/react-query";
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
  TrendingUp, TrendingDown, Zap, DollarSign, Shield, Wifi, Building2, BarChart3, 
  PieChart, Target, AlertTriangle, AlertCircle, Info, Settings, Download, RefreshCw, Play, Square,
  Eye, BarChart3 as BarChartIcon, FileText, Calendar, Share2, Printer
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ManagerAIChatbot from "@/components/dashboard/ManagerAIChatbot";


 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import HotelSelector from "@/components/dashboard/HotelSelector";

export default function ManagerDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [financialPeriod, setFinancialPeriod] = useState("monthly");
  const [selectedHotel, setSelectedHotel] = useState("hotel-1");
  const [currency, setCurrency] = useState("USD");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSystemDetailsOpen, setIsSystemDetailsOpen] = useState(false);
  const [isScheduleReportOpen, setIsScheduleReportOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [dashboardSettings, setDashboardSettings] = useState({
    defaultTab: "overview",
    refreshInterval: 5000,
    autoRefresh: true,
    showNotifications: true
  });
  
  const [exportSettings, setExportSettings] = useState({
    format: "pdf",
    includeCharts: true,
    includeData: true,
    dateRange: "current"
  });
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: "weekly",
    day: "monday",
    time: "09:00",
    recipients: "",
    format: "pdf"
  });

  const { data: overview, isLoading, refetch } = useQuery({
    queryKey: ["/api/dashboard/overview"],
    refetchInterval: dashboardSettings.autoRefresh ? dashboardSettings.refreshInterval : false,
  });

  const { data: powerData, refetch: refetchPower } = useQuery({
    queryKey: ["/api/power/consumption"],
    refetchInterval: dashboardSettings.autoRefresh ? 10000 : false,
  });

  // Provide default values and type safety
  const safeOverview = overview || {};
  const safePowerData = powerData || [];

  // Calculate period-specific financial data
  const getFinancialData = (period: string) => {
    const baseData = {
      monthly: {
        totalCost: 127400,
        totalRevenue: 89200,
        averageCostPerRoom: 127400 / 3200,
        costBreakdown: [
          { category: 'WiFi Infrastructure', cost: 45000, percentage: 35.3 },
          { category: 'IPTV Systems', cost: 32000, percentage: 25.1 },
          { category: 'CCTV & Security', cost: 18000, percentage: 14.1 },
          { category: 'Telephony', cost: 22000, percentage: 17.3 },
          { category: 'Digital Signage', cost: 10400, percentage: 8.2 },
        ],
        trends: [
          { month: 'Jan', cost: 125000, revenue: 88000, profit: -37000 },
          { month: 'Feb', cost: 128000, revenue: 89000, profit: -39000 },
          { month: 'Mar', cost: 126000, revenue: 92000, profit: -34000 },
          { month: 'Apr', cost: 127400, revenue: 89200, profit: -38200 },
        ]
      },
      yearly: {
        totalCost: 1528800,
        totalRevenue: 1070400,
        averageCostPerRoom: 1528800 / 3200,
        costBreakdown: [
          { category: 'WiFi Infrastructure', cost: 540000, percentage: 35.3 },
          { category: 'IPTV Systems', cost: 384000, percentage: 25.1 },
          { category: 'CCTV & Security', cost: 216000, percentage: 14.1 },
          { category: 'Telephony', cost: 264000, percentage: 17.3 },
          { category: 'Digital Signage', cost: 124800, percentage: 8.2 },
        ],
        trends: [
          { month: 'Q1', cost: 379000, revenue: 269000, profit: -110000 },
          { month: 'Q2', cost: 382000, revenue: 271000, profit: -111000 },
          { month: 'Q3', cost: 384000, revenue: 275000, profit: -109000 },
          { month: 'Q4', cost: 383000, revenue: 255000, profit: -128000 },
        ]
      }
    };

    const periodData = baseData[period as keyof typeof baseData] || baseData.monthly;
    
    return {
      totalCost: periodData.totalCost,
      totalRevenue: periodData.totalRevenue,
      totalProfit: periodData.totalRevenue - periodData.totalCost,
      averageCostPerRoom: periodData.averageCostPerRoom,
      topPerformingHotels: [
        { name: 'Savoy', profitMargin: 15.2, cost: periodData.totalCost * 0.053, revenue: periodData.totalRevenue * 0.11 },
        { name: 'Ritz', profitMargin: 12.8, cost: periodData.totalCost * 0.056, revenue: periodData.totalRevenue * 0.123 },
        { name: 'Marriott', profitMargin: 11.5, cost: periodData.totalCost * 0.067, revenue: periodData.totalRevenue * 0.135 },
      ],
      costBreakdown: periodData.costBreakdown,
      trends: periodData.trends
    };
  };

  const financialData = getFinancialData(financialPeriod);

  // Currency formatting functions
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

  // Action handlers
  const handleRefreshData = () => {
    refetch();
    refetchPower();
    showNotification("Executive Financial Dashboard refreshed successfully", "success");
  };

  const handleSaveSettings = () => {
    localStorage.setItem('dashboardSettings', JSON.stringify(dashboardSettings));
    showNotification("Settings saved successfully", "success");
    setIsSettingsOpen(false);
  };

  const handleSavePeriodSettings = () => {
    localStorage.setItem('financialPeriod', financialPeriod);
    localStorage.setItem('currency', currency);
    showNotification("Period and currency settings saved successfully", "success");
  };

  const handleResetSettings = () => {
    setDashboardSettings({
      defaultTab: "overview",
      refreshInterval: 5000,
      autoRefresh: true,
      showNotifications: true
    });
    showNotification("Settings reset to defaults", "info");
  };

  const handleExportReport = () => {
    // Create export data
    const exportData = {
      hotelId: selectedHotel,
      period: financialPeriod,
      currency: currency,
      timestamp: new Date().toISOString(),
      data: {
        overview: financialData,
        period: financialPeriod,
        currency: currency
      }
    };

    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vigon-financial-report-${selectedHotel}-${financialPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification("Report exported successfully", "success");
    setIsExportOpen(false);
  };

  const handleScheduleReport = () => {
    showNotification("Report scheduling configured", "success");
    setIsScheduleReportOpen(false);
  };

  const handleSystemAction = (action: string, system: any) => {
    switch (action) {
      case 'restart':
        showNotification(`Restarting ${system.name}...`, "info");
        // Simulate restart process
        setTimeout(() => {
          showNotification(`${system.name} restarted successfully`, "success");
          // Update system status to show it's healthy after restart
          if (system.status !== 'healthy') {
            system.status = 'healthy';
            system.uptime = '99.9%';
          }
          // Force re-render to update UI
          setForceUpdate(prev => prev + 1);
        }, 2000);
        break;
      case 'maintenance':
        const isInMaintenance = system.status === 'maintenance';
        if (isInMaintenance) {
          system.status = 'healthy';
          system.uptime = '99.9%';
          showNotification(`${system.name} exited maintenance mode`, "success");
        } else {
          system.status = 'maintenance';
          system.uptime = '0%';
          showNotification(`${system.name} entered maintenance mode`, "warning");
        }
        // Force re-render to update UI
        setForceUpdate(prev => prev + 1);
        break;
      case 'view':
        setSelectedSystem(system);
        setIsSystemDetailsOpen(true);
        break;
      case 'viewLogs':
        showNotification(`Opening logs for ${system.name}...`, "info");
        // Simulate opening logs
        setTimeout(() => {
          showNotification(`Logs for ${system.name} loaded successfully`, "success");
        }, 1000);
        break;
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set notification styles based on type
    switch (type) {
      case 'success':
        notification.className += ' bg-green-500 text-white';
        break;
      case 'error':
        notification.className += ' bg-red-500 text-white';
        break;
      case 'info':
        notification.className += ' bg-blue-500 text-white';
        break;
      case 'warning':
        notification.className += ' bg-yellow-500 text-white';
        break;
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      setDashboardSettings(JSON.parse(savedSettings));
    }
    
    // Load saved period and currency settings
    const savedPeriod = localStorage.getItem('financialPeriod');
    if (savedPeriod) {
      setFinancialPeriod(savedPeriod);
    }
    
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const systemMetrics = (safeOverview as any)?.systemMetrics || [];
  const uptimePercentage = systemMetrics.length > 0 
    ? (systemMetrics.reduce((acc: number, system: any) => acc + system.uptime, 0) / systemMetrics.length).toFixed(1)
    : '0.0';

  const healthySystemsCount = systemMetrics.filter((system: any) => system.status === 'healthy').length;
  const totalSystemsCount = systemMetrics.length;

  const latestPowerConsumption = Array.isArray(safePowerData) && safePowerData.length > 0 ? safePowerData[0] : null;

  // Calculate estimated monthly costs (assuming 8.4 kW average)
  const monthlyKwh = (latestPowerConsumption?.totalUsage || 8.4) * 24 * 30;
  const estimatedMonthlyCost = monthlyKwh * 0.12; // $0.12 per kWh estimate

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Executive Financial Dashboard
              </h2>
              <p className="text-gray-600">
                Financial performance, cost analysis, and portfolio management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <Select value={currency} onValueChange={(value) => {
                setCurrency(value);
                showNotification(`Currency changed to ${value}`, "success");
              }}>
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
              
              {/* Financial Period Selector */}
              <Select value={financialPeriod} onValueChange={(value) => {
                setFinancialPeriod(value);
                showNotification(`Period changed to ${value}`, "success");
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              

              
              {/* Export Button */}
              <Button variant="outline" onClick={() => {
                setIsExportOpen(true);
                showNotification("Export dialog opened", "info");
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              {/* Refresh Button */}
              <Button variant="outline" onClick={handleRefreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              {/* Settings Button */}
              <Button variant="outline" onClick={() => {
                setIsSettingsOpen(true);
                showNotification("Settings dialog opened", "info");
              }}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="systems">Systems</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          


          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Financial KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Monthly Cost */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total {financialPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Cost</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalCost, currency)}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                      <span>+2.4% from last {financialPeriod === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Monthly Revenue */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total {financialPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalRevenue, currency)}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span>+5.2% from last {financialPeriod === 'monthly' ? 'month' : 'year'}</span>
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
                      <p className={`text-2xl font-bold ${financialData.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(financialData.totalProfit, currency)}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${financialData.totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {financialData.totalProfit >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      {financialData.totalProfit >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                      )}
                      <span>{financialData.totalProfit >= 0 ? '+12.8%' : '-8.3%'} from last month</span>
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
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.averageCostPerRoom, currency)}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingDown className="h-4 w-4 mr-1 text-blue-500" />
                      <span>-1.2% from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{financialPeriod === 'monthly' ? 'Monthly' : 'Quarterly'} Financial Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialData.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                      <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={financialData.costBreakdown}
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cost"
                      >
                        {financialData.costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Hotels */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.topPerformingHotels.map((hotel, index) => (
                    <div key={hotel.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{hotel.name}</h4>
                          <p className="text-sm text-gray-600">Profit Margin: {hotel.profitMargin}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(hotel.revenue, currency)}</p>
                        <p className="text-xs text-gray-500">{financialPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="hotels" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotel Portfolio Management</h3>
              <p className="text-gray-600">Select and analyze individual hotels for detailed financial performance and service status.</p>
            </div>
            
            <HotelSelector 
              selectedHotel={selectedHotel}
              onHotelSelect={setSelectedHotel}
              currency={currency}
            />
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            {/* Financial Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Financial Analysis & Reports</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsScheduleReportOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
                <Button variant="outline" onClick={() => setIsExportOpen(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {financialData.costBreakdown.map((category, index) => (
                <Card key={category.category} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{category.category}</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(category.cost, currency)}</p>
                        <p className="text-sm text-gray-500">{category.percentage}% of total</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <BarChartIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Profitability Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Profitability Analysis by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.costBreakdown.map((category) => {
                    const revenue = category.cost * 0.7; // Simulated revenue
                    const profit = revenue - category.cost;
                    const margin = (profit / revenue) * 100;
                    
                    return (
                      <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChartIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{category.category}</h4>
                            <p className="text-sm text-gray-600">Cost: {formatCurrency(category.cost, currency)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(revenue, currency)}</p>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <Badge className={margin >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {margin.toFixed(1)}% Margin
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Systems Tab */}
          <TabsContent value="systems" className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{uptimePercentage}%</div>
                  <p className="text-sm text-gray-600">Overall Uptime</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{healthySystemsCount}</div>
                  <p className="text-sm text-gray-600">Healthy Systems</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{totalSystemsCount - healthySystemsCount}</div>
                  <p className="text-sm text-gray-600">Systems Needing Attention</p>
                </CardContent>
              </Card>
            </div>

            {/* System Status List */}
            <Card>
              <CardHeader>
                <CardTitle>System Status & Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((system: any) => (
                    <div key={system.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          system.status === 'healthy' ? 'bg-green-500' : 
                          system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{system.name}</h4>
                          <p className="text-sm text-gray-600">Uptime: {system.uptime}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          system.status === 'healthy' ? 'bg-green-100 text-green-800' :
                          system.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {system.status}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleSystemAction('view', system)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSystemAction('restart', system)}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSystemAction('maintenance', system)}>
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Energy Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Efficiency & Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Current Power Consumption</h4>
                      <p className="text-sm text-gray-600">Monthly Estimate: {formatCurrency(estimatedMonthlyCost, currency)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{latestPowerConsumption?.totalUsage || 8.4} kW</p>
                      <p className="text-sm text-gray-500">Average Usage</p>
                    </div>
                  </div>
                  

                </div>
              </CardContent>
            </Card>

            {/* Alert Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Alert Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Critical Issues */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h4 className="font-medium text-red-900">Critical Issues</h4>
                      </div>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <p className="text-red-700 mt-2 text-sm">
                      3 critical issues require immediate attention
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                        <span className="text-sm text-red-800">WiFi Network Down - Fairmont</span>
                        <span className="text-xs text-red-600">2 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                        <span className="text-sm text-red-800">Power System Overload - Savoy</span>
                        <span className="text-xs text-red-600">15 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                        <span className="text-sm text-red-800">Security Camera Offline - RITZ</span>
                        <span className="text-xs text-red-600">1 hour ago</span>
                      </div>
                    </div>
                    <Button size="sm" variant="destructive" className="mt-3">
                      View All Critical Issues
                    </Button>
                  </div>

                  {/* Warnings */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-900">Warnings</h4>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">5</Badge>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      5 warnings need monitoring
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                        <span className="text-sm text-yellow-800">High Bandwidth Usage - SAPST</span>
                        <span className="text-xs text-yellow-600">30 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                        <span className="text-sm text-yellow-800">Storage Space Low - CRI</span>
                        <span className="text-xs text-yellow-600">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                        <span className="text-sm text-yellow-800">Temperature Rising - Server Room</span>
                        <span className="text-xs text-yellow-600">4 hours ago</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      View All Warnings
                    </Button>
                  </div>

                  {/* Informational Updates */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Informational Updates</h4>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">7</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      7 informational updates available
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-100 rounded">
                        <span className="text-sm text-blue-800">System Update Available - v2.1.3</span>
                        <span className="text-xs text-blue-600">1 hour ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-100 rounded">
                        <span className="text-sm text-blue-800">Backup Completed Successfully</span>
                        <span className="text-xs text-blue-600">3 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-100 rounded">
                        <span className="text-sm text-blue-800">New User Account Created</span>
                        <span className="text-xs text-blue-600">6 hours ago</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100">
                      View All Updates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultTab">Default Tab</Label>
                    <Select value={dashboardSettings.defaultTab} onValueChange={(value) => setDashboardSettings({...dashboardSettings, defaultTab: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="systems">Systems</SelectItem>
                        <SelectItem value="settings">Settings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="refreshInterval">Refresh Interval (ms)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      value={dashboardSettings.refreshInterval}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, refreshInterval: parseInt(e.target.value)})}
                      min="1000"
                      step="1000"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoRefresh">Auto Refresh</Label>
                      <p className="text-sm text-gray-500">Automatically refresh dashboard data</p>
                    </div>
                    <Switch
                      id="autoRefresh"
                      checked={dashboardSettings.autoRefresh}
                      onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, autoRefresh: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showNotifications">Show Notifications</Label>
                      <p className="text-sm text-gray-500">Display success/error notifications</p>
                    </div>
                    <Switch
                      id="showNotifications"
                      checked={dashboardSettings.showNotifications}
                      onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, showNotifications: checked})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleResetSettings}>
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Advisor Chatbot */}
      <ManagerAIChatbot 
        currency={currency}
        formatCurrency={formatCurrency}
        powerConsumption={latestPowerConsumption}
        estimatedMonthlyCost={estimatedMonthlyCost}
      />

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dashboard Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="modalDefaultTab">Default Tab</Label>
                <Select value={dashboardSettings.defaultTab} onValueChange={(value) => setDashboardSettings({...dashboardSettings, defaultTab: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="systems">Systems</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="modalRefreshInterval">Refresh Interval (ms)</Label>
                <Input
                  id="modalRefreshInterval"
                  type="number"
                  value={dashboardSettings.refreshInterval}
                  onChange={(e) => setDashboardSettings({...dashboardSettings, refreshInterval: parseInt(e.target.value)})}
                  min="1000"
                  step="1000"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="modalAutoRefresh">Auto Refresh</Label>
                  <p className="text-sm text-gray-500">Automatically refresh dashboard data</p>
                </div>
                <Switch
                  id="modalAutoRefresh"
                  checked={dashboardSettings.autoRefresh}
                  onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, autoRefresh: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="modalShowNotifications">Show Notifications</Label>
                  <p className="text-sm text-gray-500">Display success/error notifications</p>
                </div>
                <Switch
                  id="modalShowNotifications"
                  checked={dashboardSettings.showNotifications}
                  onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, showNotifications: checked})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Dashboard Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select value={exportSettings.format} onValueChange={(value) => setExportSettings({...exportSettings, format: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
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
                <Label htmlFor="includeCharts">Include Charts & Graphs</Label>
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
              <Button onClick={handleExportReport}>
                Export Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* System Details Modal */}
      <Dialog open={isSystemDetailsOpen} onOpenChange={setIsSystemDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>System Details: {selectedSystem?.name}</DialogTitle>
          </DialogHeader>
          {selectedSystem && (
            <div className="space-y-4" key={forceUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={
                    selectedSystem.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    selectedSystem.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    selectedSystem.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedSystem.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Uptime</Label>
                  <p className="text-gray-900">{selectedSystem.uptime}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Quick Actions</Label>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleSystemAction('restart', selectedSystem)}>
                    <Play className="h-4 w-4 mr-2" />
                    Restart System
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSystemAction('maintenance', selectedSystem)}>
                    <Square className="h-4 w-4 mr-2" />
                    Maintenance Mode
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSystemAction('viewLogs', selectedSystem)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Report Modal */}
      <Dialog open={isScheduleReportOpen} onOpenChange={setIsScheduleReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Automated Report</DialogTitle>
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
                <Label htmlFor="scheduleDay">Day of Week</Label>
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
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
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
              <Label htmlFor="scheduleRecipients">Recipients (comma-separated)</Label>
              <Input
                id="scheduleRecipients"
                placeholder="email1@example.com, email2@example.com"
                value={scheduleSettings.recipients}
                onChange={(e) => setScheduleSettings({...scheduleSettings, recipients: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="scheduleFormat">Report Format</Label>
              <Select value={scheduleSettings.format} onValueChange={(value) => setScheduleSettings({...scheduleSettings, format: value})}>
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
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsScheduleReportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleReport}>
                Schedule Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Management Assistant */}
    </div>
  );
}