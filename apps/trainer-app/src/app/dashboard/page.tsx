import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Trainer Dashboard</h1>
          <p className="text-xl text-muted-foreground">Welcome to your fitness training platform</p>
          <div className="fitness-gradient h-2 w-full rounded-full" />
        </div>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Buttons Card */}
          <Card className="workout-card">
            <CardHeader>
              <CardTitle>Action Buttons</CardTitle>
              <CardDescription>Primary actions for trainers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Start Workout</Button>
              <Button variant="secondary" className="w-full">
                View Progress
              </Button>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card className="workout-card">
            <CardHeader>
              <CardTitle>Trainer Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">JT</span>
                </div>
                <div>
                  <p className="font-medium">John Trainer</p>
                  <p className="text-sm text-muted-foreground">Certified Trainer</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">Pro Plan</Badge>
                <Badge variant="secondary">5 Clients</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="workout-card">
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
              <CardDescription>Quick performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold metric-highlight">12</p>
                  <p className="text-sm text-muted-foreground">Workouts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold metric-highlight">8</p>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold metric-highlight">45m</p>
                  <p className="text-sm text-muted-foreground">Avg Session</p>
                </div>
                <div>
                  <p className="text-2xl font-bold metric-highlight">98%</p>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="workout-card md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common trainer tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-search">Find Client</Label>
                  <Input
                    id="client-search"
                    placeholder="Search by name or email..."
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    Add New Client
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button variant="secondary" className="w-full">
                    Create Workout Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Testing Section */}
        <Card className="workout-card">
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>Fituno custom color palette in action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center space-y-2">
                <div className="h-16 w-full bg-primary rounded-lg"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">Energetic Orange</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 w-full bg-secondary rounded-lg"></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">Vibrant Green</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 w-full bg-accent rounded-lg"></div>
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">Electric Blue</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 w-full bg-muted rounded-lg"></div>
                <p className="text-sm font-medium">Muted</p>
                <p className="text-xs text-muted-foreground">Soft Gray</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-16 w-full bg-destructive rounded-lg"></div>
                <p className="text-sm font-medium">Destructive</p>
                <p className="text-xs text-muted-foreground">Warning Red</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
