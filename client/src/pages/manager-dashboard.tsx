import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap, DollarSign, Shield, Wifi } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function ManagerDashboard() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["/api/dashboard/overview"],
    refetchInterval: 5000,
  });

  const { data: powerData } = useQuery({
    queryKey: ["/api/power/consumption"],
    refetchInterval: 10000,
  });

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

  const systemMetrics = overview?.systemMetrics || [];
  const uptimePercentage = systemMetrics.length > 0 
    ? (systemMetrics.reduce((acc: number, system: any) => acc + system.uptime, 0) / systemMetrics.length).toFixed(1)
    : '0.0';

  const healthySystemsCount = systemMetrics.filter((system: any) => system.status === 'healthy').length;
  const totalSystemsCount = systemMetrics.length;

  const latestPowerConsumption = powerData?.[0] || null;
  const potentialSavings = latestPowerConsumption?.potentialSavings || 0;

  // Calculate estimated monthly costs (assuming 8.4 kW average)
  const monthlyKwh = (latestPowerConsumption?.totalUsage || 8.4) * 24 * 30;
  const estimatedMonthlyCost = monthlyKwh * 0.12; // $0.12 per kWh estimate

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Executive Dashboard
          </h2>
          <p className="text-gray-600">
            Key performance indicators and operational overview
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* System Uptime */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Overall Uptime
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {uptimePercentage}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {healthySystemsCount}/{totalSystemsCount} systems healthy
              </p>
            </CardContent>
          </Card>

          {/* Monthly IT Costs */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Est. Monthly IT Costs
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${estimatedMonthlyCost.toFixed(0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Power & infrastructure
              </p>
            </CardContent>
          </Card>

          {/* Energy Savings */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Potential Savings
              </CardTitle>
              <Zap className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {potentialSavings}%
              </div>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">
                  ${(estimatedMonthlyCost * (potentialSavings / 100)).toFixed(0)}/month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guest Connectivity */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Guest Connectivity
              </CardTitle>
              <Wifi className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {overview?.networkPerformance?.activeGuests || 0}
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">
                  Active connections
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Systems Health */}
          <Card>
            <CardHeader>
              <CardTitle>Systems Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemMetrics.map((system: any) => (
                  <div key={system.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{system.systemName}</h4>
                      <p className="text-sm text-gray-600 capitalize">{system.systemType}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={system.status === 'healthy' ? 'default' : 
                                system.status === 'warning' ? 'secondary' : 'destructive'}
                        className={system.status === 'healthy' ? 'bg-green-100 text-green-800' :
                                  system.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'}
                      >
                        {system.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{system.uptime}% uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Efficiency Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestPowerConsumption?.recommendations?.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-800">{recommendation}</p>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No energy recommendations available at this time.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}