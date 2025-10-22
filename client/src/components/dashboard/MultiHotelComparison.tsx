import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface HotelComparisonData {
  id: string;
  name: string;
  code: string;
  monthlyCost: number;
  monthlyRevenue: number;
  uptime: number;
  rooms: number;
  energyUsage: number;
  profitMargin: number;
}

interface MultiHotelComparisonProps {
  hotels: HotelComparisonData[];
}

const MultiHotelComparison: React.FC<MultiHotelComparisonProps> = ({ hotels }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Prepare data for charts - only technical metrics
  const uptimeData = hotels.map(hotel => ({
    name: hotel.code,
    uptime: hotel.uptime,
    rooms: hotel.rooms
  }));

  const energyData = hotels.map(hotel => ({
    name: hotel.code,
    energy: hotel.energyUsage,
    rooms: hotel.rooms
  }));

  const roomsData = hotels.map(hotel => ({
    name: hotel.code,
    rooms: hotel.rooms,
    uptime: hotel.uptime
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards - Only Technical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{hotels.length}</div>
            <div className="text-sm text-slate-600">Total Hotels</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {hotels.reduce((sum, h) => sum + h.rooms, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Rooms</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {(hotels.reduce((sum, h) => sum + h.uptime, 0) / hotels.length).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">Average Uptime</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {(hotels.reduce((sum, h) => sum + h.energyUsage, 0) / hotels.length).toFixed(1)} kW
            </div>
            <div className="text-sm text-slate-600">Avg Energy Usage</div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime Performance Analysis</CardTitle>
          <p className="text-sm text-slate-600">
            Compare system uptime across hotels
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="uptime" fill="#82ca9d" name="Uptime (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Technical Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Usage Comparison</CardTitle>
            <p className="text-sm text-slate-600">Energy consumption by hotel</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="energy" fill="#f59e0b" name="Energy (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Capacity vs Uptime</CardTitle>
            <p className="text-sm text-slate-600">Hotel size vs system reliability</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roomsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="rooms" fill="#8884d8" name="Rooms" />
                <Bar yAxisId="right" dataKey="uptime" fill="#82ca9d" name="Uptime (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Technical Performance Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Performance Rankings</CardTitle>
          <p className="text-sm text-slate-600">Top performing hotels by technical metrics</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Uptime */}
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-3">Best Uptime</h4>
              <div className="space-y-2">
                {hotels
                  .sort((a, b) => b.uptime - a.uptime)
                  .slice(0, 3)
                  .map((hotel, index) => (
                    <div key={hotel.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{hotel.code}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {hotel.uptime.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Most Energy Efficient */}
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-3">Most Energy Efficient</h4>
              <div className="space-y-2">
                {hotels
                  .sort((a, b) => a.energyUsage - b.energyUsage)
                  .slice(0, 3)
                  .map((hotel, index) => (
                    <div key={hotel.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{hotel.code}</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {hotel.energyUsage.toFixed(1)} kW
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Best Uptime per Room */}
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-3">Best Uptime per Room</h4>
              <div className="space-y-2">
                {hotels
                  .sort((a, b) => (b.uptime / b.rooms) - (a.uptime / a.rooms))
                  .slice(0, 3)
                  .map((hotel, index) => (
                    <div key={hotel.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{hotel.code}</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {(hotel.uptime / hotel.rooms).toFixed(3)}%/room
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiHotelComparison;
