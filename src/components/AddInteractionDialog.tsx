
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateInteraction } from '@/hooks/useInteractions';
import { useUpdateClient } from '@/hooks/useClients';

interface AddInteractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export function AddInteractionDialog({ open, onOpenChange, clientId }: AddInteractionDialogProps) {
  const [formData, setFormData] = useState({
    type: 'Phone Call',
    content: ''
  });

  const createInteraction = useCreateInteraction();
  const updateClient = useUpdateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create the interaction
      await createInteraction.mutateAsync({
        client_id: clientId,
        type: formData.type,
        content: formData.content
      });

      // Update client's last_contact timestamp
      await updateClient.mutateAsync({
        id: clientId,
        last_contact: new Date().toISOString()
      });

      // Reset form and close dialog
      setFormData({
        type: 'Phone Call',
        content: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating interaction:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contact Record</DialogTitle>
          <DialogDescription>
            Record the latest contact with this client
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Contact Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                <SelectItem value="Email">📧 Email</SelectItem>
                <SelectItem value="Meeting">🤝 Meeting</SelectItem>
                <SelectItem value="WeChat">💬 WeChat</SelectItem>
                <SelectItem value="WhatsApp">📱 WhatsApp</SelectItem>
                <SelectItem value="Other">📝 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contact Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Please describe the content of this contact, issues discussed, and outcomes..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createInteraction.isPending}>
              {createInteraction.isPending ? 'Adding...' : 'Add Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
