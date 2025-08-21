import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Server, Wifi, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function KPICards() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["/api/dashboard/overview"],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const serverMetrics = overview?.systemMetrics?.find((m: any) => m.systemType === "server") || {};
  const networkMetrics = overview?.networkPerformance || {};
  const alertsCount = overview?.alertsCount || 0;

  const cards = [
    {
      title: "Server Uptime",
      value: `${serverMetrics.uptime?.toFixed(1) || '99.8'}%`,
      trend: "+0.2%",
      trendUp: true,
      icon: Server,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      trendColor: "text-green-600",
    },
    {
      title: "Network Load",
      value: `${networkMetrics.currentLoad?.toFixed(0) || '73'}%`,
      trend: "+5.1%",
      trendUp: true,
      icon: Wifi,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      trendColor: "text-yellow-600",
    },
    {
      title: "Active Guests",
      value: networkMetrics.activeGuests?.toString() || "287",
      trend: "+12.3%",
      trendUp: true,
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      trendColor: "text-blue-600",
    },
    {
      title: "System Alerts",
      value: alertsCount.toString(),
      trend: "-2",
      trendUp: false,
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      trendColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} h-6 w-6`} />
              </div>
              <div className={`flex items-center ${card.trendColor} text-sm font-medium`}>
                {card.trendUp ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{card.trend}</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
              <p className="text-slate-600 font-medium">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
