'use client';

import { AuthService } from '@fituno/services';
import { Button, Card, CardDescription, CardHeader, CardTitle } from '@fituno/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    const checkAuth = async () => {
      try {
        const { data: userData } = await AuthService.getCurrentUser();
        if (userData.user && AuthService.isEmailVerified(userData.user)) {
          router.push('/dashboard');
        }
      } catch {
        // Ignore errors, user is not authenticated
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold">Fituno</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Transform Your
              <span className="block fitness-gradient-text">Fitness Business</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The complete platform for personal trainers to manage clients, create workout plans,
              and grow their business.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Login to Dashboard
              </Button>
            </Link>
          </div>

          <div className="fitness-gradient h-2 w-32 rounded-full mx-auto" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for personal trainers and fitness professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="workout-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground text-sm">👥</span>
                  </div>
                  <span>Client Management</span>
                </CardTitle>
                <CardDescription>
                  Organize your clients, track progress, and manage relationships all in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="workout-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="text-secondary-foreground text-sm">💪</span>
                  </div>
                  <span>Workout Planning</span>
                </CardTitle>
                <CardDescription>
                  Create custom workout plans and programs tailored to each client's needs and
                  goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="workout-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-accent-foreground text-sm">📊</span>
                  </div>
                  <span>Progress Tracking</span>
                </CardTitle>
                <CardDescription>
                  Monitor client progress with detailed analytics and visual progress reports.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="workout-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground text-sm">📱</span>
                  </div>
                  <span>Mobile Ready</span>
                </CardTitle>
                <CardDescription>
                  Access your trainer dashboard from anywhere with our responsive web platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="workout-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="text-secondary-foreground text-sm">💬</span>
                  </div>
                  <span>Client Communication</span>
                </CardTitle>
                <CardDescription>
                  Stay connected with your clients through integrated messaging and updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="workout-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-accent-foreground text-sm">⚡</span>
                  </div>
                  <span>Performance Analytics</span>
                </CardTitle>
                <CardDescription>
                  Gain insights into your business with detailed performance metrics and reports.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of trainers who are already growing their business with Fituno.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Fituno. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
