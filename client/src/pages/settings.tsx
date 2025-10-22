import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Lock,
  Sun,
  Moon
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    alerts: true
  });

  const [privacy, setPrivacy] = useState({
    analytics: true,
    cookies: true,
    location: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="Enter your department" />
                </div>
                <Button className="w-full md:w-auto">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about important events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Alerts</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive critical system alerts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.alerts}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, alerts: checked }))
                      }
                    />
                  </div>
                </div>
                <Button className="w-full md:w-auto">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your privacy settings and data preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics Data</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Allow collection of usage analytics
                      </p>
                    </div>
                    <Switch
                      checked={privacy.analytics}
                      onCheckedChange={(checked) =>
                        setPrivacy(prev => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cookie Preferences</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Accept cookies for enhanced functionality
                      </p>
                    </div>
                    <Switch
                      checked={privacy.cookies}
                      onCheckedChange={(checked) =>
                        setPrivacy(prev => ({ ...prev, cookies: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Location Services</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Allow location-based features
                      </p>
                    </div>
                    <Switch
                      checked={privacy.location}
                      onCheckedChange={(checked) =>
                        setPrivacy(prev => ({ ...prev, location: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full md:w-auto">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button variant="outline" size="sm">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button variant="outline" size="sm">
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <div className="flex gap-2">
                      <Badge variant="secondary">English</Badge>
                      <Badge variant="outline">Français</Badge>
                      <Badge variant="outline">Español</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Dashboard Layout</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Compact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Monitor className="h-4 w-4 mr-2" />
                        Standard
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Endpoint</Label>
                    <Input placeholder="https://api.vigonmonitor.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>WebSocket URL</Label>
                    <Input placeholder="wss://ws.vigonmonitor.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Refresh Interval</Label>
                    <Input type="number" placeholder="30" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Refresh interval in seconds
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Backup Settings</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Database className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <Database className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="w-full md:w-auto">Save System Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
