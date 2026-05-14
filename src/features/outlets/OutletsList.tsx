import React from 'react';
import { Card, Button, Input, Select, Label } from '@/components/ui/core';
import { Plus, Search, Store, Box, Monitor, MapPin } from 'lucide-react';
import { DashboardCard, EmptyState, LoadingState } from '@/components/DashboardComponents';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { STAND_TYPES, OTHER_TOOLS, DISTRIBUTORS } from '@/data/outlets';

export default function OutletsList() {
  const [outlets, setOutlets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedStands, setSelectedStands] = React.useState<string[]>([]);
  const [selectedTools, setSelectedTools] = React.useState<string[]>([]);

  const fetchOutlets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('outlets_info').select('*').order('shop_name');
      if (error) throw error;
      setOutlets(data || []);
    } catch (error: any) {
      console.warn('Supabase fallback');
      setOutlets([
        { id: 1, shop_name: 'Imran General Store', area: 'Johar Town', distributor: 'A&H Traders', stand_types: ["Small Stand"], other_tools: ["Wall Mount"] },
        { id: 2, shop_name: 'Super Bakers', area: 'DHA Phase 5', distributor: 'Liaqat Traders', stand_types: ["Large Stand"], other_tools: [] },
        { id: 3, shop_name: 'Friends Mart', area: 'Gulberg', distributor: 'Rauf & Sons', stand_types: ["Medium Stand", "Small Stand"], other_tools: ["Basket"] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const { data, error } = await supabase.from('outlets_info').insert([
        {
          shop_name: formData.get('shop_name'),
          shop_code: formData.get('shop_code'),
          area: formData.get('area'),
          distributor: formData.get('distributor'),
          stand_types: selectedStands,
          other_tools: selectedTools,
          created_at: new Date().toISOString()
        }
      ]).select();

      if (error) throw error;
      
      toast.success('Outlet registered successfully');
      if (data) setOutlets(prev => [...prev, data[0]]);
      setShowForm(false);
      setSelectedStands([]);
      setSelectedTools([]);
    } catch (error: any) {
      toast.error('Registration failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  React.useEffect(() => {
    fetchOutlets();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Outlets" value={outlets.length} color="navy" icon={<Store size={20} />} />
        <DashboardCard title="Large Stands" value={outlets.filter(o => o.stand_types?.includes('Large Stand')).length} color="gold" icon={<Box size={20} />} />
        <DashboardCard title="Wall Mounts" value={outlets.filter(o => o.other_tools?.includes('Wall Mount')).length} color="blue" icon={<Monitor size={20} />} />
        <DashboardCard title="Unique Areas" value={new Set(outlets.map(o => o.area)).size} color="green" icon={<MapPin size={20} />} />
      </div>

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
            <Plus size={20} className="mr-1" /> New Outlet
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : outlets.length === 0 ? (
        <EmptyState message="No outlets registered yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outlets.map((outlet) => (
            <Card key={outlet.id} className="hover:border-navy/20 transition-all flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-navy line-clamp-1">{outlet.shop_name}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-widest mt-1">
                    <MapPin size={12} strokeWidth={3} />
                    {outlet.area}
                  </div>
                </div>
                <div className="text-[10px] bg-muted px-2 py-1 rounded font-bold uppercase text-muted-foreground">
                   {outlet.shop_code || 'No Code'}
                </div>
              </div>

              <div className="space-y-4 flex-1">
                 <div className="space-y-2">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">Deployed Stands</p>
                    <div className="flex flex-wrap gap-1.5">
                       {outlet.stand_types?.map((type: string) => (
                         <span key={type} className="px-3 py-1 bg-navy/5 text-navy text-[10px] font-bold rounded-full border border-navy/10">
                           {type}
                         </span>
                       ))}
                       {(!outlet.stand_types || outlet.stand_types.length === 0) && (
                         <span className="text-[10px] text-muted-foreground italic">None active</span>
                       )}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">Field Tools</p>
                    <div className="flex flex-wrap gap-1.5">
                       {outlet.other_tools?.map((tool: string) => (
                         <span key={tool} className="px-3 py-1 bg-gold/5 text-gold-foreground text-[10px] font-bold rounded-full border border-gold/20">
                           {tool}
                         </span>
                       ))}
                        {(!outlet.other_tools || outlet.other_tools.length === 0) && (
                         <span className="text-[10px] text-muted-foreground italic">None active</span>
                       )}
                    </div>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                 <div className="flex flex-col">
                   <p className="text-[9px] uppercase font-bold text-muted-foreground">Distributor</p>
                   <p className="text-xs font-semibold text-navy">{outlet.distributor}</p>
                 </div>
                 <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold px-4">Manage</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
         <div className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <Card className="w-full max-w-xl max-h-[90vh] overflow-auto shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-navy">Register New Outlet</h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>✕</Button>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Shop Name</Label>
                                <Input name="shop_name" placeholder="Outlet name" required disabled={isSubmitting} />
                            </div>
                            <div className="space-y-1">
                                <Label>Shop Code (Optional)</Label>
                                <Input name="shop_code" placeholder="e.g. SHOP-101" disabled={isSubmitting} />
                            </div>
                            <div className="space-y-1">
                                <Label>Area</Label>
                                <Input name="area" placeholder="Sub-city/Area name" required disabled={isSubmitting} />
                            </div>
                            <div className="space-y-1">
                                <Label>Distributor</Label>
                                <Select name="distributor" required disabled={isSubmitting}>
                                    <option value="">Select Partner</option>
                                    {DISTRIBUTORS.map(d => <option key={d} value={d}>{d}</option>)}
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3 p-4 bg-muted/40 rounded-xl">
                            <Label>Stands Selection</Label>
                            <div className="flex flex-wrap gap-2">
                                {STAND_TYPES.map(type => (
                                    <button 
                                      key={type}
                                      type="button"
                                      onClick={() => toggleSelection(type, selectedStands, setSelectedStands)}
                                      disabled={isSubmitting}
                                      className={cn(
                                        "px-4 py-2 border rounded-lg text-sm font-medium transition-all active:scale-95",
                                        selectedStands.includes(type) 
                                          ? "bg-navy text-white border-navy" 
                                          : "bg-white border-border hover:border-navy/50"
                                      )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 p-4 bg-muted/40 rounded-xl">
                            <Label>Other Tools</Label>
                            <div className="flex flex-wrap gap-2">
                                {OTHER_TOOLS.map(tool => (
                                    <button 
                                      key={tool}
                                      type="button"
                                      onClick={() => toggleSelection(tool, selectedTools, setSelectedTools)}
                                      disabled={isSubmitting}
                                      className={cn(
                                        "px-4 py-2 border rounded-lg text-sm font-medium transition-all active:scale-95",
                                        selectedTools.includes(tool) 
                                          ? "bg-gold text-white border-gold" 
                                          : "bg-white border-border hover:border-gold/50"
                                      )}
                                    >
                                        {tool}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                       <Button variant="outline" className="flex-1" type="button" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
                       <Button variant="gold" className="flex-1" type="submit" disabled={isSubmitting}>
                         {isSubmitting ? 'Registering...' : 'Create Record'}
                       </Button>
                    </div>
                </form>
            </Card>
         </div>
      )}
    </div>
  );
}
