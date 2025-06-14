import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AuthService } from '@fituno/services';
import { BarChart3, Bell, Calendar, Dumbbell, LogOut, Menu, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Navigation items for the trainer dashboard
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
    badge: '8',
  },
  {
    title: 'Workouts',
    href: '/workouts',
    icon: Dumbbell,
    badge: null,
  },
  {
    title: 'Programs',
    href: '/programs',
    icon: Calendar,
    badge: '3',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: null,
  },
];

async function checkAuth() {
  const { data, error } = await AuthService.getCurrentUser();
  if (error || !data.user) {
    redirect('/auth/login');
  }
  return data.user;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Check authentication - redirect to login if not authenticated
  const user = await checkAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="fitness-gradient h-8 w-8 rounded-lg"></div>
              <span className="text-xl font-bold text-foreground">Fituno</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.user_metadata?.avatar_url} alt="Trainer" />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'T'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">Personal Trainer</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => AuthService.signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                {/* Mobile Logo */}
                <div className="flex h-16 items-center px-6 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="fitness-gradient h-8 w-8 rounded-lg"></div>
                    <span className="text-xl font-bold">Fituno</span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                  {navigationItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile User Profile */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="Trainer" />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">Personal Trainer</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <div className="fitness-gradient h-6 w-6 rounded"></div>
            <span className="text-lg font-bold">Fituno</span>
          </Link>

          <Button variant="ghost" size="sm" className="px-2">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
