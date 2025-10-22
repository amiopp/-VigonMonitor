import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function NetworkPerformance() {
  const { data: networkHistory, isLoading } = useQuery({
    queryKey: ["/api/network/performance"],
    refetchInterval: 5000,
  });

  const { data: overview } = useQuery({
    queryKey: ["/api/dashboard/overview"],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Network Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const latest = (overview as any)?.networkPerformance;
  const chartData = Array.isArray(networkHistory) ? networkHistory.slice(-7) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Network Performance</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>+5.2% from yesterday</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">Last 24 hours</p>
          <div className="h-32 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-end justify-between p-2">
            {chartData.map((point: any, index: number) => (
              <div
                key={index}
                className="w-4 bg-blue-500 rounded-t"
                style={{ height: `${(point.currentLoad / 100) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Current Load</span>
            <span className="font-semibold text-slate-900">
              {latest?.currentLoad?.toFixed(0) || '73'}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Throughput</span>
            <span className="font-semibold text-slate-900">
              {latest?.throughput?.toFixed(1) || '1.2'}GB/s
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Latency</span>
            <span className="font-semibold text-slate-900">
              {latest?.latency || '12'}ms
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
