import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wifi, Tv, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

const systemIcons = {
  wifi: Wifi,
  iptv: Tv,
  security: Shield,
};

const severityColors = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

const statusColors = {
  open: "bg-gray-100 text-gray-700",
  investigating: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

export default function AlertsTable() {
  const queryClient = useQueryClient();
  
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 5000,
  });

  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/alerts/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/overview"] });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleStatusUpdate = (id: string, status: string) => {
    updateAlertMutation.mutate({ id, status });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Alerts</CardTitle>
          <Button variant="ghost" size="sm" className="text-vigon-blue hover:text-vigon-dark">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-600">System</TableHead>
                <TableHead className="text-slate-600">Alert</TableHead>
                <TableHead className="text-slate-600">Severity</TableHead>
                <TableHead className="text-slate-600">Time</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts?.map((alert: any) => {
                const IconComponent = systemIcons[alert.systemType as keyof typeof systemIcons] || AlertTriangle;
                return (
                  <TableRow key={alert.id} className="border-slate-100">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-4 w-4 ${
                          alert.severity === "critical" ? "text-red-500" :
                          alert.severity === "warning" ? "text-yellow-500" : "text-blue-500"
                        }`} />
                        <span className="text-sm font-medium text-slate-900">{alert.systemName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{alert.message}</TableCell>
                    <TableCell>
                      <Badge className={severityColors[alert.severity as keyof typeof severityColors]}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[alert.status as keyof typeof statusColors]}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {alert.status !== "resolved" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusUpdate(alert.id, "resolved")}
                          disabled={updateAlertMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
