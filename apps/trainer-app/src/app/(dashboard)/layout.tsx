'use client';

import { AuthService } from '@fituno/services';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@fituno/ui';
import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Navigation items for the trainer dashboard - updated to match wireframe
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    badge: null,
  },
  {
    title: 'Clientes',
    href: '/dashboard/clients',
    icon: Users,
    badge: null,
  },
  {
    title: 'Agenda',
    href: '/dashboard/schedule',
    icon: Calendar,
    badge: null,
  },
  {
    title: 'Biblioteca',
    href: '/dashboard/library',
    icon: FileText,
    badge: null,
  },
  {
    title: 'Relatórios',
    href: '/dashboard/reports',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = async () => {
      try {
        const { data, error } = await AuthService.getCurrentUser();
        if (error || !data.user) {
          router.push('/auth/login');
          return;
        }
        setUser(data.user);
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      router.push('/auth/login');
    } catch {
      // Handle error silently
    }
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/clients':
        return 'Clientes';
      case '/dashboard/schedule':
        return 'Agenda';
      case '/dashboard/library':
        return 'Biblioteca';
      case '/dashboard/reports':
        return 'Relatórios';
      case '/dashboard/settings':
        return 'Configurações';
      default:
        return 'Dashboard';
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="fitness-gradient h-12 w-12 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (should redirect to login)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-white border-r border-gray-200 lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="fitness-gradient h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
              <span className="text-xl font-bold text-gray-900">Fituno</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile at bottom */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.user_metadata?.avatar_url} alt="Trainer" />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {user.user_metadata?.full_name?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase() ||
                    'T'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">Personal Trainer</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white lg:hidden">
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
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="fitness-gradient h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      F
                    </div>
                    <span className="text-xl font-bold">Fituno</span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                  {navigationItems.map(item => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
                          />
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
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {user.user_metadata?.full_name?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase() ||
                          'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">Personal Trainer</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="fitness-gradient h-6 w-6 rounded flex items-center justify-center text-white font-bold text-xs">
              F
            </div>
            <span className="text-lg font-bold">Fituno</span>
          </Link>

          <Button variant="ghost" size="sm" className="px-2">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Page Header - visible on all pages */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt="Trainer" />
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                    {user.user_metadata?.full_name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      'T'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'João Silva'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
