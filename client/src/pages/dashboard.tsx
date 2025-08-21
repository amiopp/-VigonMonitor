import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import KPICards from "@/components/dashboard/KPICards";
import SystemStatus from "@/components/dashboard/SystemStatus";
import NetworkPerformance from "@/components/dashboard/NetworkPerformance";
import IPTVPerformance from "@/components/dashboard/IPTVPerformance";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import AlertsTable from "@/components/dashboard/AlertsTable";
import { EnhancedAIChatbot } from "@/components/dashboard/EnhancedAIChatbot";
import VoiceCommandModal from "@/components/dashboard/VoiceCommandModal";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/components/auth/AuthProvider";
import ManagerDashboard from "@/pages/manager-dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    document.title = "Vigon Systems - Hotel IT Infrastructure Management";
  }, []);

  // Show manager dashboard for Manager role
  if (user?.role === 'Manager') {
    return <ManagerDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Infrastructure Dashboard</h2>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-slate-600">Real-time monitoring and management of hotel IT systems</p>
                <div className={`flex items-center space-x-1 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>

            <KPICards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <SystemStatus />
              </div>
              <NetworkPerformance />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <IPTVPerformance />
              <SustainabilityMetrics />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsTable />
            </div>
          </div>
        </main>
      </div>

      <VoiceCommandModal />
      <EnhancedAIChatbot />
    </div>
  );
}
