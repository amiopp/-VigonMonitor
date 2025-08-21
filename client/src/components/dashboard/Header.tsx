import { useState } from "react";
import { Search, Bell, Mic, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isListening, startListening, stopListening } = useVoiceCommand();
  const { user, logout } = useAuth();

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://dqcgwmxrlprmqeijjsme.supabase.co/storage/v1/object/public/logos/color-1736899024753-0.5219336404716874.png"
                alt="Vigon Systems"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-semibold text-gray-900">Hotel IT Infrastructure</h1>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceToggle}
              className={`p-2 transition-colors duration-200 ${
                isListening 
                  ? 'text-blue-600 bg-blue-100' 
                  : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-blue-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
            
            {user && (
              <>
                <div className="flex items-center space-x-3 border-l border-gray-300 pl-4">
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
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
