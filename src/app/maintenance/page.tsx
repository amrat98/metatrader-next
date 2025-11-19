"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, RefreshCw, TrendingUp } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const response = await axios.get(apiConfig.system.siteMaintainence);
        if (response.data.statusCode === 200) {
          const { status, createdAt } = response.data.result;
          if (!status) {
            router.push('/');
            return;
          }

          // Calculate time left from createdAt
          const startTime = new Date(createdAt).getTime();
          const endTime = startTime + (30 * 60 * 1000); // 30 minutes in milliseconds
          const now = new Date().getTime();
          const remaining = Math.max(0, endTime - now);
          
          setTimeLeft(Math.floor(remaining / 1000)); // Convert to seconds
        }
      } catch (error) {
        console.error('Error fetching maintenance status:', error);
      }
    };

    fetchMaintenanceStatus();
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-14">
      <Link href={routes.home} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            Billionaire's Blueprint
          </span>
        </Link>
      </div>
      <Card className="w-full max-w-2xl text-center p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-3xl backdrop-blur-lg shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Under Maintenance
          </CardTitle>
          <CardDescription className="text-lg">
            We&apos;re currently performing scheduled maintenance to improve our
            services. Please check back soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>Estimated time: {formatTime(timeLeft)}</span>
          </div>

          {timeLeft > 0 && (
            <p className="text-xl font-semibold text-primary">
              Estimated time remaining: {formatTime(timeLeft)}
            </p>
          )}

          <div className="flex flex-col items-center space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => router.push('/')}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-amber-600 border-0 text-white"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          If you need immediate assistance, please contact our support team.
        </p>
        <p className="mt-2">Email: info@billionairesblueprint.com</p>
      </div>
    </div>
  );
}
