
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 在实际应用中，这里会调用 Supabase 插入数据
    console.log('添加联系记录:', { ...formData, clientId });
    
    toast({
      title: "联系记录添加成功",
      description: `已成功添加${formData.type}记录`,
    });

    // 重置表单并关闭对话框
    setFormData({
      type: '通话',
      content: ''
    });
    onOpenChange(false);
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
                <SelectItem value="通话">通话</SelectItem>
                <SelectItem value="邮件">邮件</SelectItem>
                <SelectItem value="会议">会议</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
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
            <Button type="submit">
              添加记录
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
