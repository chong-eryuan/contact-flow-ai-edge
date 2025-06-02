
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDeal } from '@/hooks/useDeals';
import { useClients } from '@/hooks/useClients';
import { usePipelineStages } from '@/hooks/usePipelineStages';
import { Plus } from 'lucide-react';

export function AddDealDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [clientId, setClientId] = useState('');
  const [stageId, setStageId] = useState('');
  const [probability, setProbability] = useState('50');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');

  const createDeal = useCreateDeal();
  const { data: clients } = useClients();
  const { data: stages } = usePipelineStages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createDeal.mutate({
      title,
      description: description || null,
      value: value ? parseFloat(value) : null,
      client_id: clientId || null,
      stage_id: stageId || null,
      probability: parseInt(probability),
      expected_close_date: expectedCloseDate || null,
      actual_close_date: null,
      status: 'active' as const
    });

    // Reset form
    setTitle('');
    setDescription('');
    setValue('');
    setClientId('');
    setStageId('');
    setProbability('50');
    setExpectedCloseDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Deal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stage">Pipeline Stage</Label>
            <Select value={stageId} onValueChange={setStageId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {stages?.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Deal Value</Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deal details..."
            />
          </div>

          <Button type="submit" className="w-full">
            Create Deal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
