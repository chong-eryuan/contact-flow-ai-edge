
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
    type: '通话',
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
        type: '通话',
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
          <DialogTitle>新增联系记录</DialogTitle>
          <DialogDescription>
            记录与客户的最新联系情况
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">联系类型</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="通话">📞 通话</SelectItem>
                <SelectItem value="邮件">📧 邮件</SelectItem>
                <SelectItem value="会议">🤝 会议</SelectItem>
                <SelectItem value="微信">💬 微信</SelectItem>
                <SelectItem value="WhatsApp">📱 WhatsApp</SelectItem>
                <SelectItem value="其他">📝 其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">联系内容</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="请详细描述此次联系的内容、讨论的问题和结果..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={createInteraction.isPending}>
              {createInteraction.isPending ? '添加中...' : '添加记录'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
