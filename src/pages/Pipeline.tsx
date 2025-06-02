
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus, TrendingUp, DollarSign } from 'lucide-react';
import { useDeals, useUpdateDeal } from '@/hooks/useDeals';
import { usePipelineStages } from '@/hooks/usePipelineStages';
import { AddDealDialog } from '@/components/AddDealDialog';

export default function Pipeline() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: deals = [] } = useDeals();
  const { data: stages = [] } = usePipelineStages();
  const updateDeal = useUpdateDeal();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const dealId = draggableId;
    const newStageId = destination.droppableId;

    updateDeal.mutate({
      id: dealId,
      stage_id: newStageId
    });
  };

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage_id === stageId);
  };

  const getTotalValue = () => {
    return deals
      .filter(deal => deal.status === 'active')
      .reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const getStageValue = (stageId: string) => {
    return getDealsByStage(stageId)
      .filter(deal => deal.status === 'active')
      .reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600">Manage your deals and track progress</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Pipeline Value</p>
            <p className="text-2xl font-bold text-green-600">
              ${getTotalValue().toLocaleString()}
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageValue = getStageValue(stage.id);
            
            return (
              <Card key={stage.id} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <Badge variant="secondary">{stageDeals.length}</Badge>
                  </div>
                  <CardDescription>
                    ${stageValue.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <CardContent
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              }`}
                            >
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">{deal.title}</h4>
                                
                                {deal.clients && (
                                  <p className="text-sm text-gray-600">{deal.clients.name}</p>
                                )}
                                
                                {deal.value && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-medium">
                                      ${deal.value.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <Badge 
                                    variant={deal.status === 'active' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {deal.probability}% probability
                                  </Badge>
                                  
                                  {deal.expected_close_date && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(deal.expected_close_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  )}
                </Droppable>
              </Card>
            );
          })}
        </div>
      </DragDropContext>

      <AddDealDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
