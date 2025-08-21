import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Tv, Shield, Slash } from "lucide-react";

const alertIcons = {
  wifi: Wifi,
  iptv: Tv,
  security: Shield
};

const severityColors = {
  info: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
  critical: "bg-red-100 text-red-700"
};

const statusColors = {
  open: "bg-gray-100 text-gray-700",
  investigating: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700"
};

export default function RecentAlerts() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: systems } = useQuery({
    queryKey: ["/api/systems"]
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Alerts</CardTitle>
          <Button variant="link" className="text-vigon-blue hover:text-vigon-dark p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-sm font-medium text-slate-600">System</th>
                <th className="text-left py-3 text-sm font-medium text-slate-600">Alert</th>
                <th className="text-left py-3 text-sm font-medium text-slate-600">Severity</th>
                <th className="text-left py-3 text-sm font-medium text-slate-600">Time</th>
                <th className="text-left py-3 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts?.slice(0, 5).map((alert) => {
                const system = systems?.find(s => s.id === alert.systemId);
                const systemType = system?.type || 'wifi';
                const IconComponent = alertIcons[systemType as keyof typeof alertIcons] || Wifi;
                
                return (
                  <tr key={alert.id} className="border-b border-slate-100">
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-4 w-4 ${
                          alert.severity === 'high' || alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} />
                        <span className="text-sm font-medium text-slate-900">
                          {system?.name || 'Unknown System'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-slate-600">{alert.message}</td>
                    <td className="py-3">
                      <Badge className={severityColors[alert.severity as keyof typeof severityColors]}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      {alert.createdAt ? Slash(new Date(alert.createdAt), { addSuffix: true }) : 'Unknown'}
                    </td>
                    <td className="py-3">
                      <Badge className={statusColors[alert.status as keyof typeof statusColors]}>
                        {alert.status.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {!alerts?.length && (
            <div className="text-center py-8 text-slate-500">
              No alerts at this time
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
