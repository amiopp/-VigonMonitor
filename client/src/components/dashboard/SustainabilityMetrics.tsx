import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, TrendingUp, PiggyBank, Lightbulb } from "lucide-react";

export default function SustainabilityMetrics() {
  const { data: powerData, isLoading } = useQuery({
    queryKey: ["/api/power/consumption"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Power Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const latest = powerData?.[powerData.length - 1];
  const dailyAverage = 9.2; // Mock daily average

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Power Consumption</CardTitle>
          <Button variant="ghost" size="sm" className="text-vigon-blue hover:text-vigon-dark">
            Optimize
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-900">Current Usage</span>
            </div>
            <span className="font-semibold text-slate-900">
              {latest?.totalUsage?.toFixed(1) || '8.4'} kW
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-900">Daily Average</span>
            </div>
            <span className="font-semibold text-slate-900">{dailyAverage} kW</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <PiggyBank className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-900">Potential Savings</span>
            </div>
            <span className="font-semibold text-green-600">
              {latest?.potentialSavings || '12'}%
            </span>
          </div>
        </div>
        
        {latest?.recommendations?.[0] && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">AI Recommendation</p>
                <p className="text-xs text-blue-700 mt-1">{latest.recommendations[0]}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
