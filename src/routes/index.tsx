import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { AppShell } from '@/components/AppShell';
import { DashboardCard } from '@/components/DashboardComponents';
import { Button, Card, Input, Label } from '@/components/ui/core';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { LogIn, Target, BarChart3, Clock, LayoutDashboard, ShieldCheck, Download, Plus, UserCircle, Image as ImageIcon } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authLoading, setAuthLoading] = React.useState(false);
  const navigate = useNavigate();

  const isConfigMissing = (!process.env.VITE_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) || 
    (process.env.VITE_SUPABASE_URL?.includes('placeholder') || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder'));

  React.useEffect(() => {
    if (isConfigMissing) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back to HawkSpot');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gold"
        >
          <Target size={64} strokeWidth={1} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        {/* Branding Side */}
        <div className="hidden md:flex md:w-1/2 bg-navy p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-xl shadow-lg">
                <Target size={28} className="text-navy" />
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight">HawkSpot</h1>
            </div>
            <h2 className="text-5xl font-display font-medium leading-[1.1] mb-6">
              Premium Field <br />
              <span className="text-gold">Execution Intelligence</span>
            </h2>
            <p className="text-white/60 max-w-sm leading-relaxed font-sans text-lg">
              Streamlining market reporting for Bunnys Snacks Division with boardroom-grade analytics.
            </p>
          </div>

          <div className="relative pt-12 border-t border-white/10 flex items-center gap-8">
             <div className="flex flex-col">
               <span className="text-gold font-display font-bold text-2xl">3</span>
               <span className="text-[10px] uppercase tracking-widest text-white/40">Core Modules</span>
             </div>
             <div className="flex flex-col">
               <span className="text-gold font-display font-bold text-2xl">100%</span>
               <span className="text-[10px] uppercase tracking-widest text-white/40">Real-time Sync</span>
             </div>
             <div className="flex flex-col">
               <span className="text-gold font-display font-bold text-2xl">PRO</span>
               <span className="text-[10px] uppercase tracking-widest text-white/40">Reporting</span>
             </div>
          </div>
        </div>

        {/* Login Form Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <Card className="w-full max-w-sm shadow-xl border-none p-8">
            <div className="md:hidden flex flex-col items-center mb-8">
               <div className="w-14 h-14 bg-navy flex items-center justify-center rounded-2xl shadow-xl mb-4">
                 <Target size={32} className="text-gold" />
               </div>
               <h1 className="text-3xl font-display font-bold text-navy">HawkSpot</h1>
               <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] mt-1 font-semibold">Field Execution</p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-display font-semibold text-navy">Welcome Back</h3>
              <p className="text-sm text-muted-foreground mt-1">Please enter your credentials to access the portal.</p>
            </div>

            {isConfigMissing && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                 <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">Configuration Required</p>
                 <p className="text-[10px] text-amber-700 leading-tight">
                   Please set your <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in the project secrets to enable authentication and data sync.
                 </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@bunnys.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="password">Security Token</Label>
                  <button type="button" className="text-[10px] font-bold text-gold uppercase hover:underline">Forgot?</button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-base font-bold shadow-navy/20" 
                disabled={authLoading}
              >
                {authLoading ? 'Verifying...' : (
                  <>
                    Authorize Connection
                    <LogIn size={18} className="ml-2" />
                  </>
                )}
              </Button>

              <Button 
                type="button" 
                variant="gold"
                className="w-full py-4 text-xs font-bold" 
                onClick={() => {
                  setUser({ email: 'demo@bunnys.com', user_metadata: { role: 'admin' } });
                  toast.success('Entering Demo Mode...');
                }}
              >
                Try Demo Experience
              </Button>

              <div className="flex items-center gap-2 py-4">
                <div className="h-[1px] flex-1 bg-border/50" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Secure Gateway</span>
                <div className="h-[1px] flex-1 bg-border/50" />
              </div>

              <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
                <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  This application is strictly for authorized personnel only. All access attempts are monitored and logged for security auditing.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AppShell title="Command Center">
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col gap-1">
          <p className="text-gold font-bold uppercase tracking-[0.25em] text-[10px]">Strategic Market Intelligence</p>
          <h2 className="text-3xl font-display font-extrabold text-navy">Executive Command Center</h2>
        </header>

        {/* Bento Grid Top Layer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           <DashboardCard title="Total Executions" value="1,284" icon={<LayoutDashboard size={20} />} subtitle="↑ 12%" color="navy" />
           <DashboardCard title="Expiring Soon" value="42" icon={<Clock size={20} />} subtitle="+5 Critical" color="red" />
           <DashboardCard title="Active Outlets" value="856" icon={<Target size={20} />} subtitle="↑ 4%" color="gold" />
           <DashboardCard title="Field Teams" value="18" icon={<UserCircle size={20} />} subtitle="Active Now" color="blue" />
        </div>

        {/* Bento Grid Main Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="p-8 h-full min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-display font-bold text-navy">Recent POSM Submissions</h3>
                 <button onClick={() => navigate({ to: '/posm' })} className="text-[10px] font-bold text-gold uppercase tracking-widest hover:underline">View Database →</button>
              </div>
              
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center text-navy/40">
                          <ImageIcon size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-navy group-hover:text-gold transition-colors">Imran General Store</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Johar Town • LMT • A&H Traders</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-block px-3 py-1 bg-navy/5 text-navy text-[10px] font-bold rounded-full uppercase">Large Stand</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                 <span>Showing 3 of 1,284 records</span>
                 <span>Last sync: Just now</span>
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-6 bg-red-50/50 border-red-100 min-h-[220px]">
               <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4">Expiry Alerts (Critical)</h3>
               <div className="space-y-3">
                  <div className="p-3 bg-white border border-red-100 rounded-lg shadow-sm border-l-4 border-l-red-500">
                    <p className="font-bold text-xs text-navy">Nimko Classic 50g</p>
                    <p className="text-[10px] text-red-500 font-bold uppercase mt-1">Expired: 12-May-2026</p>
                  </div>
                  <div className="p-3 bg-white border border-gold/20 rounded-lg shadow-sm border-l-4 border-l-gold">
                    <p className="font-bold text-xs text-navy">Party Mix Large</p>
                    <p className="text-[10px] text-gold font-bold uppercase mt-1">Expiring: 2 Days Left</p>
                  </div>
               </div>
            </Card>

            <Card className="p-6 bg-navy text-white min-h-[160px] relative overflow-hidden group">
               <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
               <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-2">Boardroom Export</span>
               <p className="text-sm font-bold leading-tight mb-4">Monthly Field Execution <br/>Strategic Report</p>
               <Button variant="gold" size="sm" className="w-full text-[10px] h-9">
                  Download PPTX
                  <Download size={12} className="ml-2" />
               </Button>
            </Card>
          </div>
        </div>

        {/* Global Action Floating Bar (Desktop) */}
        <div className="hidden lg:flex fixed bottom-8 right-8 z-[60] gap-4">
           <Button variant="gold" size="lg" className="shadow-2xl">
              <Download size={20} className="mr-2" />
              Generate Report
           </Button>
           <Button variant="primary" size="lg" className="shadow-2xl px-10">
              <Plus size={20} className="mr-2" />
              New Submission
           </Button>
        </div>
      </div>
    </AppShell>
  );
}
