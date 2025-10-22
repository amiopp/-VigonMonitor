import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Wifi, Shield, CheckCircle, AlertTriangle } from "lucide-react";

const systemIcons = {
  server: Server,
  database: Database,
  wifi: Wifi,
  security: Shield,
};

const statusColors = {
  healthy: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  critical: "bg-red-50 border-red-200",
};

const statusBadges = {
  healthy: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

export default function SystemStatus() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["/api/dashboard/overview"],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const systems = Array.isArray((overview as any)?.systemMetrics) ? (overview as any).systemMetrics : [];
  const healthyCount = systems.filter((s: any) => s.status === "healthy").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Status</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{healthyCount}/{systems.length} Systems Operational</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system: any) => {
            const IconComponent = systemIcons[system.systemType as keyof typeof systemIcons] || Server;
            return (
              <div
                key={system.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  statusColors[system.status as keyof typeof statusColors]
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-5 w-5 ${
                    system.status === "healthy" ? "text-green-600" :
                    system.status === "warning" ? "text-yellow-600" : "text-red-600"
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">{system.systemName}</p>
                    <p className="text-sm text-slate-600">
                      Uptime: {system.uptime?.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={statusBadges[system.status as keyof typeof statusBadges]}>
                    {system.status === "healthy" ? "Healthy" :
                     system.status === "warning" ? "Warning" : "Critical"}
                  </Badge>
                  {system.status === "healthy" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
