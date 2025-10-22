import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Loader2 } from "lucide-react";
import { loginSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { AnimatedBackground, FloatingOrbs, GradientMesh } from "@/components/ui/animated-background";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();





  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: (data) => {
      console.log("Login success:", data);
      // Store authentication data
      localStorage.setItem("vigon_token", data.token);
      localStorage.setItem("vigon_user", JSON.stringify(data.user));
      
      // Force a page reload to trigger auth provider refresh
      window.location.href = "/dashboard";
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      if (error.status === 401) {
        setError("Invalid username or password. Please check your credentials and try again.");
      } else if (error.status === 400) {
        setError("Please fill in all required fields correctly.");
      } else if (error.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Components */}
      <GradientMesh />
      <FloatingOrbs />
      <AnimatedBackground />
      
      {/* Additional Animated Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/6 w-3 h-3 bg-indigo-400 rounded-full animate-float-delay-1 opacity-60"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-delay-2 opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-purple-400 rounded-full animate-float-delay-3 opacity-60"></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
            <img 
              src="https://dqcgwmxrlprmqeijjsme.supabase.co/storage/v1/object/public/logos/color-1736899024753-0.5219336404716874.png"
              alt="Vigon Systems"
              className="w-20 h-auto"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              VIGON SYSTEMS
            </h1>
            <p className="text-blue-200">
              Hotel IT Infrastructure Management
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 hover:bg-white/98 transition-all duration-300 hover:shadow-3xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Access your IT management dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your username"
                          className="h-11 transition-all duration-300 hover:shadow-lg focus:shadow-xl focus:ring-2 focus:ring-blue-500/50"
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="h-11 transition-all duration-300 hover:shadow-lg focus:shadow-xl focus:ring-2 focus:ring-blue-500/50"
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium animate-glow transition-all duration-300 hover:scale-105"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>


          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-blue-200 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>© 2024 Vigon Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}