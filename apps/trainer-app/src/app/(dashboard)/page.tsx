import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Clock, Dumbbell, Plus, Target, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your training business.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Button>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="workout-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold metric-highlight">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="workout-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold metric-highlight">8</div>
            <p className="text-xs text-muted-foreground">3 ending this week</p>
          </CardContent>
        </Card>

        <Card className="workout-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold metric-highlight">24</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>

        <Card className="workout-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold metric-highlight">$2,400</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="workout-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your upcoming training sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Upper Body Strength</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">9:00 AM</p>
                <Badge variant="secondary">60 min</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium">Mike Chen</p>
                <p className="text-sm text-muted-foreground">HIIT Cardio</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">10:30 AM</p>
                <Badge variant="secondary">45 min</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium">Emma Rodriguez</p>
                <p className="text-sm text-muted-foreground">Core & Flexibility</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">2:00 PM</p>
                <Badge variant="secondary">30 min</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="workout-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Sarah Johnson</span> completed
                  <span className="font-medium"> Upper Body Workout</span>
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Mike Chen</span> achieved new PR in
                  <span className="font-medium">Deadlift (225 lbs)</span>
                </p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Emma Rodriguez</span> started new program
                  <span className="font-medium"> "Summer Shred"</span>
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Alex Thompson</span> missed
                  <span className="font-medium">scheduled workout</span>
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks for managing your training business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Add New Client</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Dumbbell className="h-6 w-6" />
              <span>Create Workout</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Session</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
