import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img 
              src="https://dqcgwmxrlprmqeijjsme.supabase.co/storage/v1/object/public/logos/color-1736899024753-0.5219336404716874.png"
              alt="Vigon Systems"
              className="h-8 w-auto"
            />
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Hotel IT Infrastructure
              </h1>
              <p className="text-sm text-gray-600">Management Dashboard</p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={user.role === 'IT' ? 'default' : 'secondary'}
                        className={user.role === 'IT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      >
                        {user.role}
                      </Badge>
                      <span className="text-xs text-gray-500">@{user.username}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                
                <div className="border-l border-gray-300 pl-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}