import React from 'react';
import { Card, Button, Input, Select, Label } from '@/components/ui/core';
import { Plus, Search, Filter, FilterX, Download, Image as ImageIcon } from 'lucide-react';
import { DashboardCard, EmptyState, LoadingState } from '@/components/DashboardComponents';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function PosmList() {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [filterArea, setFilterArea] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('posm_submissions').select('*').order('created_at', { ascending: false });
      
      if (search) {
        query = query.ilike('shop_name', `%${search}%`);
      }
      if (filterArea) {
        query = query.eq('area', filterArea);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const shop_name = formData.get('shop_name') as string;
    const area = formData.get('area') as string;
    const distributor = formData.get('distributor') as string;
    const channel = formData.get('channel') as string;
    const posm_type = formData.get('posm_type') as string;
    const submission_date = formData.get('submission_date') as string;
    const notes = formData.get('notes') as string;

    try {
      const { data, error } = await supabase.from('posm_submissions').insert([
        {
          shop_name,
          area,
          distributor,
          channel,
          posm_type,
          submission_date,
          notes,
          created_at: new Date().toISOString()
        }
      ]).select();

      if (error) throw error;
      
      toast.success('Evidence submitted successfully!');
      if (data) {
        setSubmissions(prev => [data[0], ...prev]);
      }
      setShowForm(false);
    } catch (error: any) {
      toast.error('Submission failed: ' + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const { error } = await supabase.from('posm_submissions').delete().eq('id', id);
      if (error) throw error;
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast.success('Record deleted');
    } catch (error: any) {
      toast.error('Deletion failed: ' + error.message);
    }
  };

  React.useEffect(() => {
    fetchSubmissions();
  }, [search, filterArea]);

  const stats = [
    { title: 'Total Submissions', value: submissions.length, color: 'navy' as const },
    { title: 'Today', value: submissions.filter(s => new Date(s.submission_date).toDateString() === new Date().toDateString()).length, color: 'gold' as const },
    { title: 'Retail', value: submissions.filter(s => s.channel === 'Retail').length, color: 'blue' as const },
    { title: 'LMT', value: submissions.filter(s => s.channel === 'LMT').length, color: 'green' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <DashboardCard key={i} {...stat} />
        ))}
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col gap-4 sticky top-[4.5rem] bg-background/95 backdrop-blur-md py-2 z-30">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search Shop Name..." 
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

      {/* List */}
      {loading ? (
        <LoadingState />
      ) : submissions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <Card key={sub.id} className="p-0 overflow-hidden group hover:border-gold/50 transition-all">
              <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                {sub.images?.[0] ? (
                  <img 
                    src={sub.images[0]} 
                    alt={sub.shop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-navy/80 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                  {sub.channel}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-lg text-navy line-clamp-1">{sub.shop_name}</h3>
                <p className="text-xs font-bold text-gold uppercase tracking-widest mt-1">{sub.area}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <div>
                    <p className="opacity-60">Distributor</p>
                    <p className="text-foreground">{sub.distributor}</p>
                  </div>
                  <div>
                    <p className="opacity-60">POSM Type</p>
                    <p className="text-foreground">{sub.posm_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground italic">
                    {formatDate(sub.submission_date)}
                  </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-[10px] h-7 px-2">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-[10px] h-7 px-2 text-destructive hover:text-white hover:bg-destructive" onClick={() => handleDelete(sub.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
  
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
              <Card className="w-full max-w-xl max-h-[90vh] overflow-auto shadow-2xl animate-in slide-in-from-bottom-10">
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-display font-bold text-navy">New POSM Submission</h2>
                      <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} disabled={isSubmitting}>✕</Button>
                  </div>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <Label htmlFor="shop_name">Shop Name</Label>
                              <Input name="shop_name" id="shop_name" placeholder="Enter shop name" required disabled={isSubmitting} />
                          </div>
                          <div className="space-y-1">
                              <Label htmlFor="area">Area</Label>
                              <Input name="area" id="area" placeholder="Enter area" required disabled={isSubmitting} />
                          </div>
                          <div className="space-y-1">
                              <Label htmlFor="distributor">Distributor</Label>
                              <Select name="distributor" id="distributor" required disabled={isSubmitting}>
                                  <option value="">Select Distributor</option>
                                  <option value="A&H Traders">A&H Traders</option>
                                  <option value="Liaqat Traders">Liaqat Traders</option>
                                  <option value="Others">Others</option>
                              </Select>
                          </div>
                          <div className="space-y-1">
                              <Label htmlFor="channel">Channel</Label>
                              <Select name="channel" id="channel" required disabled={isSubmitting}>
                                  <option value="Retail">Retail</option>
                                  <option value="LMT">LMT</option>
                                  <option value="Whole Sales">Whole Sales</option>
                                  <option value="Institution">Institution</option>
                                  <option value="Others">Others</option>
                              </Select>
                          </div>
                      </div>
                      <div className="space-y-1">
                          <Label htmlFor="posm_type">POSM Type</Label>
                          <Input name="posm_type" id="posm_type" placeholder="e.g. Rack, Banner, Standee" required disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1">
                          <Label htmlFor="submission_date">Submission Date</Label>
                          <Input name="submission_date" id="submission_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1">
                          <Label htmlFor="notes">Notes</Label>
                          <textarea name="notes" id="notes" className="w-full px-3 py-2 border rounded-lg min-h-[80px]" placeholder="Add any notes here..." disabled={isSubmitting} />
                      </div>
                      <div className="pt-4 flex gap-3">
                          <Button variant="outline" className="flex-1" type="button" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
                          <Button variant="navy" className="flex-1" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
                          </Button>
                      </div>
                  </form>
              </Card>
          </div>
        )}
    </div>
  );
}
