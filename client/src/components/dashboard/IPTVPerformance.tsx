import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tv, Signal, AlertCircle } from "lucide-react";

export default function IPTVPerformance() {
  // Mock IPTV data - in production this would come from the API
  const iptvData = {
    activeStreams: 187,
    signalQuality: "Excellent",
    issues: 2,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>IPTV Performance</CardTitle>
          <Button variant="ghost" size="sm" className="text-vigon-blue hover:text-vigon-dark">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Tv className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">Active Streams</span>
            </div>
            <span className="font-semibold text-slate-900">{iptvData.activeStreams}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Signal className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">Signal Quality</span>
            </div>
            <span className="font-semibold text-green-600">{iptvData.signalQuality}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">Connection Issues</span>
            </div>
            <span className="font-semibold text-slate-900">{iptvData.issues}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
