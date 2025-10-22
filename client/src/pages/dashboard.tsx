import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import KPICards from "@/components/dashboard/KPICards";
import SystemStatus from "@/components/dashboard/SystemStatus";
import NetworkPerformance from "@/components/dashboard/NetworkPerformance";
import IPTVPerformance from "@/components/dashboard/IPTVPerformance";

import AlertsTable from "@/components/dashboard/AlertsTable";


import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/components/auth/AuthProvider";
import ManagerDashboard from "@/pages/manager-dashboard";
import StaffDashboard from "@/pages/staff-dashboard";
import PageTransition, { StaggeredContainer, StaggeredItem } from "@/components/ui/PageTransition";
import ResponsiveWrapper, { ResponsiveGrid, ResponsiveFlex } from "@/components/ui/ResponsiveWrapper";

export default function Dashboard() {
  const { user } = useAuth();
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    document.title = "Vigon Systems - Hotel IT Infrastructure Management";
  }, []);

  // Route users to role-specific dashboards
  if (user?.role === 'Manager') {
    return <ManagerDashboard />;
  }
  if (user?.role === 'Staff' || user?.role === 'IT') {
    return <StaffDashboard />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 overflow-auto">
            <ResponsiveWrapper padding="lg">
              <StaggeredContainer>
                <StaggeredItem>
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
                </StaggeredItem>

                <StaggeredItem>
                  <KPICards />
                </StaggeredItem>

                <StaggeredItem>
                  <ResponsiveGrid cols={{ sm: 1, lg: 3 }} gap="lg" className="mb-6">
                    <div className="lg:col-span-2">
                      <SystemStatus />
                    </div>
                    <NetworkPerformance />
                  </ResponsiveGrid>
                </StaggeredItem>

                <StaggeredItem>
                  <ResponsiveGrid cols={{ sm: 1, lg: 2 }} gap="lg" className="mb-6">
                    <IPTVPerformance />
                  </ResponsiveGrid>
                </StaggeredItem>

                <StaggeredItem>
                  <ResponsiveGrid cols={{ sm: 1, lg: 2 }} gap="lg">
                    <AlertsTable />
                  </ResponsiveGrid>
                </StaggeredItem>
              </StaggeredContainer>
            </ResponsiveWrapper>
          </main>
        </div>

      </div>
    </PageTransition>
  );
}
