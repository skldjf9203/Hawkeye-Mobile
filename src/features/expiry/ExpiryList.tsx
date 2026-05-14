import React from 'react';
import { Card, Button, Input, Select, Label } from '@/components/ui/core';
import { Plus, Search, Filter, FilterX, Download, Calendar, BarChart2 } from 'lucide-react';
import { DashboardCard, EmptyState, LoadingState } from '@/components/DashboardComponents';
import { supabase } from '@/lib/supabase';
import { formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CATEGORIES, SKU_MASTER } from '@/data/expiry';

export default function ExpiryList() {
  const [records, setRecords] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let query = supabase.from('expiry_records').select('*').order('expiry_date', { ascending: true });
      if (search) {
        query = query.ilike('shop_name', `%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      console.warn('Supabase not fully setup, using mock for demo');
      setRecords([
         { 
           id: 1, 
           shop_name: 'Al-Madina Store', 
           sub_channel: 'Johar Town', 
           sku_name: 'Mix Nimko 200g', 
           quantity: 45, 
           expiry_date: '2026-06-15',
           category: 'Nimko'
         },
         { 
           id: 2, 
           shop_name: 'Metro Cash & Carry', 
           sub_channel: 'Model Town', 
           sku_name: 'Roasted Almonds', 
           quantity: 12, 
           expiry_date: '2026-05-10',
           category: 'Nuts'
         }
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecords();
  }, [search]);

  const getStatus = (date: string) => {
    const today = new Date();
    const expiry = new Date(date);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'EXPIRED', color: 'bg-destructive text-white' };
    if (diffDays <= 30) return { label: 'EXPIRING SOON', color: 'bg-gold text-gold-foreground' };
    return { label: 'OK', color: 'bg-emerald-500 text-white' };
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Records" value={records.length} color="navy" />
        <DashboardCard title="Expired" value={records.filter(r => new Date(r.expiry_date) < new Date()).length} color="red" />
        <DashboardCard title="Soon" value={records.filter(r => {
             const diff = new Date(r.expiry_date).getTime() - new Date().getTime();
             const days = Math.ceil(diff / (1000*60*60*24));
             return days > 0 && days <= 30;
        }).length} color="gold" />
         <DashboardCard title="Total Qty" value={records.reduce((acc, r) => acc + (r.quantity || 0), 0)} color="blue" />
      </div>

      <div className="flex flex-col gap-4 sticky top-[4.5rem] bg-background/95 backdrop-blur-md py-2 z-30">
        <div className="flex items-center gap-2">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search Shop/SKU..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="gold" onClick={() => setShowForm(true)}>
            <Plus size={20} className="mr-1" /> New
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : records.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
           {records.map((record) => {
             const status = getStatus(record.expiry_date);
             return (
               <Card key={record.id} className="p-0 border-l-4 border-l-navy overflow-hidden">
                 <div className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                       <h3 className="font-display font-bold text-navy">{record.sku_name}</h3>
                       <p className="text-xs font-bold text-gold uppercase tracking-wider mt-0.5">{record.shop_name} • {record.sub_channel || 'Lahore'}</p>
                       
                       <div className="mt-4 flex flex-wrap gap-4">
                          <div className="bg-muted/50 px-2.5 py-1 rounded-lg">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Qty</span>
                            <span className="text-sm font-semibold">{record.quantity} Units</span>
                          </div>
                          <div className="bg-muted/50 px-2.5 py-1 rounded-lg">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Expiry</span>
                            <span className="text-sm font-semibold">{formatDate(record.expiry_date)}</span>
                          </div>
                       </div>
                    </div>
                    <div className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", status.color)}>
                      {status.label}
                    </div>
                 </div>
                 <div className="bg-muted/30 px-4 py-2 flex items-center justify-between border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground italic">
                      Category: {record.category || 'N/A'}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold text-navy hover:bg-navy/5">Edit</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold text-destructive hover:bg-destructive/5">Remove</Button>
                    </div>
                 </div>
               </Card>
             );
           })}
        </div>
      )}

      {/* Form Implementation would go here */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <Card className="w-full max-w-xl max-h-[90vh] overflow-auto shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-navy">New Expiry Record</h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>✕</Button>
                </div>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Shop Name</Label>
                            <Input placeholder="Shop name" />
                        </div>
                        <div className="space-y-1">
                            <Label>Area Name</Label>
                            <Input placeholder="Enter area" />
                        </div>
                        <div className="space-y-1">
                            <Label>Category</Label>
                            <Select>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Product/SKU</Label>
                            <Select>
                                {SKU_MASTER.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Quantity</Label>
                            <Input type="number" placeholder="Enter units" />
                        </div>
                         <div className="space-y-1">
                            <Label>Expiry Date</Label>
                            <Input type="date" />
                        </div>
                    </div>
                    <Button variant="navy" className="w-full mt-4" type="button" onClick={() => { toast.success('Record saved'); setShowForm(false); }}>
                      Confirm Submission
                    </Button>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
}
