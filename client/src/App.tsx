import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NotificationProvider } from "@/contexts/NotificationContext";
import GlobalNotificationManager from "@/components/dashboard/GlobalNotificationManager";

import Dashboard from "@/pages/dashboard";

import StaffDashboard from "@/pages/staff-dashboard";
import ManagerDashboard from "@/pages/manager-dashboard";
import FinancialReports from "@/pages/financial-reports";
import MultiHotelDashboard from "@/pages/multi-hotel-dashboard";
import MultiHotelAI from "@/pages/multi-hotel-ai";
import AlertsPage from "@/pages/alerts";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";

import InfrastructurePage from "@/pages/infrastructure";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

// IT Infrastructure Dashboard Pages
import ITDashboard from "@/pages/it-dashboard";
import IPTVSystems from "@/pages/iptv-systems";
import WiFiNetwork from "@/pages/wifi-network";
import SecuritySystems from "@/pages/security-systems";

// Staff Dashboard Pages
import TasksPage from "@/pages/staff/tasks";
import IssuesPage from "@/pages/staff/issues";
import OperationsPage from "@/pages/staff/operations";
import ActivityPage from "@/pages/staff/activity";
import ChatPage from "@/pages/staff/chat";

// Manager Dashboard Pages
import FinancialPage from "@/pages/manager/financial";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      

      
      {/* IT Infrastructure Dashboard Routes */}
      <Route path="/it-dashboard">
        <ProtectedRoute>
          <ITDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/iptv">
        <ProtectedRoute>
          <IPTVSystems />
        </ProtectedRoute>
      </Route>
      <Route path="/wifi">
        <ProtectedRoute>
          <WiFiNetwork />
        </ProtectedRoute>
      </Route>
      <Route path="/security">
        <ProtectedRoute>
          <SecuritySystems />
        </ProtectedRoute>
      </Route>
      
      <Route path="/staff-dashboard">
        <ProtectedRoute>
          <StaffDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Staff Dashboard Section Routes */}
      <Route path="/staff/tasks">
        <ProtectedRoute>
          <TasksPage />
        </ProtectedRoute>
      </Route>
      <Route path="/staff/issues">
        <ProtectedRoute>
          <IssuesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/staff/operations">
        <ProtectedRoute>
          <OperationsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/staff/activity">
        <ProtectedRoute>
          <ActivityPage />
        </ProtectedRoute>
      </Route>
      <Route path="/staff/chat">
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager-dashboard">
        <ProtectedRoute>
          <ManagerDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Manager Dashboard Section Routes */}
      <Route path="/manager/financial">
        <ProtectedRoute>
          <FinancialPage />
        </ProtectedRoute>
      </Route>
      <Route path="/financial-reports">
        <ProtectedRoute>
          <FinancialReports />
        </ProtectedRoute>
      </Route>
      <Route path="/multi-hotel-dashboard">
        <ProtectedRoute>
          <MultiHotelDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/multi-hotel-ai">
        <ProtectedRoute>
          <MultiHotelAI />
        </ProtectedRoute>
      </Route>
      
      {/* Main Navigation Routes */}
      <Route path="/alerts">
        <ProtectedRoute>
          <AlertsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/analytics">
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </Route>
      

      
      <Route path="/infrastructure">
        <ProtectedRoute>
          <InfrastructurePage />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <GlobalNotificationManager />
            <Toaster />
            <Router />
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
