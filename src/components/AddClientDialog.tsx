
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '潜在',
    followUpDays: 7
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 在实际应用中，这里会调用 Supabase 插入数据
    console.log('添加新客户:', formData);
    
    toast({
      title: "客户添加成功",
      description: `已成功添加客户 ${formData.name}`,
    });

    // 重置表单并关闭对话框
    setFormData({
      name: '',
      email: '',
      status: '潜在',
      followUpDays: 7
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新客户</DialogTitle>
          <DialogDescription>
            填写客户基本信息以添加到系统中
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">客户姓名</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入客户姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮箱地址"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">客户状态</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="潜在">潜在</SelectItem>
                <SelectItem value="已成交">已成交</SelectItem>
                <SelectItem value="冷淡">冷淡</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDays">跟进间隔（天）</Label>
            <Input
              id="followUpDays"
              type="number"
              value={formData.followUpDays}
              onChange={(e) => setFormData({ ...formData, followUpDays: parseInt(e.target.value) || 7 })}
              min="1"
              max="365"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              添加客户
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
