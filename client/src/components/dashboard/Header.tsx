import { useState } from "react";
import { Search, Bell, Mic, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isListening, startListening, stopListening } = useVoiceCommand();

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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-vigon-blue rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Vigon Systems</h1>
                <p className="text-sm text-slate-500">Hotel IT Infrastructure Management</p>
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
                  ? 'text-vigon-blue bg-vigon-blue/10' 
                  : 'text-slate-400 hover:text-vigon-blue'
              }`}
            >
              <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 focus:ring-vigon-blue focus:border-vigon-blue"
              />
            </div>
            
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-vigon-blue">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">System Admin</p>
                <p className="text-xs text-slate-500">IT Manager</p>
              </div>
              <div className="w-8 h-8 bg-vigon-blue rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
