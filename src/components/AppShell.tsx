import { ChevronLeft, Cloud, CloudOff, LogOut, Menu, UserCircle } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Link, useLocation } from '@tanstack/react-router';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function AppShell({ children, title, showBack, onBack }: AppShellProps) {
  const [user, setUser] = React.useState<any>(null);
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    // Check for demo mode session
    const demoUser = localStorage.getItem('hawkspot_demo_user');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
    }

    // Check connection
    supabase.from('posm_submissions').select('id', { count: 'exact', head: true })
      .then(({ error }) => {
        setIsConnected(!error || error.code !== 'PGRST301'); 
      })
      .catch(() => setIsConnected(false));
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (!localStorage.getItem('hawkspot_demo_user')) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('hawkspot_demo_user');
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navItems = [
    { label: 'POSM', path: '/posm', icon: 'clipboard' },
    { label: 'Expiry', path: '/expiry', icon: 'calendar' },
    { label: 'Outlets', path: '/outlets', icon: 'store' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground safe-area-inset font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy text-white px-6 py-4 flex items-center justify-between border-b-2 border-gold">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-navy font-black text-lg">H</div>
            <div>
              <h1 className="text-lg font-display font-bold leading-none tracking-tight">
                HAWKSPOT
              </h1>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gold opacity-80 block mt-0.5">Bunnys Snacks Division</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected !== null && (
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider",
              isConnected ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
            )}>
              {isConnected ? <Cloud size={10} /> : <CloudOff size={10} />}
              {isConnected ? 'Sync Online' : 'Sync Offline'}
            </div>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold">{user.email?.split('@')[0]}</div>
                <div className="text-[8px] uppercase tracking-widest opacity-60">Field Lead</div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center text-gold hover:bg-gold/20 transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-auto">
        <div className="max-w-7xl mx-auto p-5 md:p-8">
          {children}
        </div>
      </main>

      {/* Navigation Tabs - Bento Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy text-white px-2 flex justify-center border-t border-white/5 shadow-2xl">
        <div className="flex w-full max-w-lg">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 py-4 transition-all border-b-4",
                  isActive 
                    ? "text-white bg-white/5 border-gold" 
                    : "text-white/40 border-transparent hover:text-white/60"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
