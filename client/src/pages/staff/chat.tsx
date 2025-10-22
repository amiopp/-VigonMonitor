import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Wifi, WifiOff } from "lucide-react";
import ITStaffChat from "@/components/chat/ITStaffChat";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <div className="flex">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">IT Staff Chat</h1>
                  <p className="text-slate-600">Real-time communication and coordination for IT team</p>
                </div>
              </div>
            </div>

            <Card className="h-[calc(100vh-200px)]">
              <CardContent className="h-full p-0">
                <ITStaffChat />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

