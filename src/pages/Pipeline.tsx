
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus, TrendingUp, DollarSign, Calendar, User, Loader2 } from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';
import { usePipelineStages } from '@/hooks/usePipelineStages';
import { AddDealDialog } from '@/components/AddDealDialog';

export default function Pipeline() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: deals = [], isLoading: dealsLoading } = useDeals();
  const { data: stages = [], isLoading: stagesLoading } = usePipelineStages();

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => deal.stage_id === stageId && deal.status === 'active');
  };

  const getTotalValue = (stageDeals: any[]) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "won": return "bg-green-100 text-green-800";
      case "lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (dealsLoading || stagesLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600">Manage your deals through the sales funnel</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold">{deals.filter(d => d.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold">
                  ${deals.filter(d => d.status === 'active').reduce((sum, deal) => sum + (deal.value || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Won This Month</p>
                <p className="text-2xl font-bold">{deals.filter(d => d.status === 'won').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Deal Size</p>
                <p className="text-2xl font-bold">
                  ${deals.filter(d => d.status === 'active' && d.value).length > 0 
                    ? Math.round(deals.filter(d => d.status === 'active' && d.value).reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.filter(d => d.status === 'active' && d.value).length).toLocaleString()
                    : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const stageValue = getTotalValue(stageDeals);
          
          return (
            <Card key={stage.id} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg" style={{ color: stage.color }}>
                    {stage.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {stageDeals.length}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  ${stageValue.toLocaleString()} total value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageDeals.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <Card key={deal.id} className="border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{deal.title}</h4>
                            <Badge className={getStatusColor(deal.status)} variant="outline">
                              {deal.status}
                            </Badge>
                          </div>
                          
                          {deal.clients && (
                            <div className="flex items-center text-xs text-gray-600">
                              <User className="w-3 h-3 mr-1" />
                              {deal.clients.name}
                            </div>
                          )}
                          
                          {deal.value && (
                            <div className="flex items-center text-xs text-gray-600">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${deal.value.toLocaleString()}
                            </div>
                          )}
                          
                          {deal.probability && (
                            <div className="text-xs text-gray-600">
                              {deal.probability}% probability
                            </div>
                          )}
                          
                          {deal.expected_close_date && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              Expected: {new Date(deal.expected_close_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddDealDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
}
