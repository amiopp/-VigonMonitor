import React from 'react';
import { Building2, Wifi, Tv, Camera, Phone, Monitor, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface HotelService {
  id: string;
  serviceType: string;
  status: 'active' | 'inactive' | 'maintenance';
  monthlyCost: number;
  monthlyRevenue: number;
  uptime: number;
}

export interface HotelOverviewCardProps {
  hotel: {
    id: string;
    name: string;
    code: string;
    location: string;
    rooms: number;
    status: 'active' | 'inactive' | 'maintenance';
  };
  services: HotelService[];
  monthlyCost: number;
  monthlyRevenue: number;
  energyUsage: number;
}

const HotelOverviewCard: React.FC<HotelOverviewCardProps> = ({
  hotel,
  services,
  monthlyCost,
  monthlyRevenue,
  energyUsage
}) => {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'iptv':
        return <Tv className="h-4 w-4" />;
      case 'cctv':
        return <Camera className="h-4 w-4" />;
      case 'telephony':
        return <Phone className="h-4 w-4" />;
      case 'digital signage':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-slate-600" />
            <div>
              <CardTitle className="text-lg">{hotel.name}</CardTitle>
              <p className="text-sm text-slate-600">{hotel.location}</p>
            </div>
          </div>
          <Badge className={getStatusColor(hotel.status)}>
            {getStatusText(hotel.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Hotel Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{hotel.rooms}</div>
            <div className="text-sm text-slate-600">Rooms</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{services.length}</div>
            <div className="text-sm text-slate-600">Services</div>
          </div>
        </div>

        {/* Services Overview */}
        <div>
          <h4 className="text-sm font-medium text-slate-900 mb-3">Services Status</h4>
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                <div className="flex items-center space-x-2">
                  {getServiceIcon(service.serviceType)}
                  <span className="text-sm font-medium text-slate-700">
                    {service.serviceType}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={service.uptime} className="w-16 h-2" />
                  <span className="text-xs text-slate-600">{service.uptime}%</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(service.status)}`}
                  >
                    {getStatusText(service.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Metrics Only */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Total Services</div>
            <div className="text-lg font-bold text-blue-900">
              {services.length}
            </div>
          </div>
          
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Energy Usage</span>
            </div>
            <div className="text-lg font-bold text-orange-900">
              {energyUsage.toFixed(1)} kW
            </div>
          </div>
        </div>

        {/* Service Health Summary */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Service Health Summary</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {services.filter(s => s.status === 'active').length}
              </div>
              <div className="text-xs text-slate-600">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {services.filter(s => s.status === 'maintenance').length}
              </div>
              <div className="text-xs text-slate-600">Maintenance</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">
                {services.filter(s => s.status === 'inactive').length}
              </div>
              <div className="text-xs text-slate-600">Inactive</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelOverviewCard;
