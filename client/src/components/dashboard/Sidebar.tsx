import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Tv, 
  Wifi, 
  Shield, 
  Server, 
  Leaf, 
  AlertTriangle, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "IPTV Systems", href: "/iptv", icon: Tv },
  { name: "WiFi Network", href: "/wifi", icon: Wifi },
  { name: "Security Systems", href: "/security", icon: Shield },
  { name: "Infrastructure", href: "/infrastructure", icon: Server },
  { name: "Sustainability", href: "/sustainability", icon: Leaf },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-slate-200">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-vigon-blue text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
