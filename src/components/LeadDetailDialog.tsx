
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUpdateLead, Lead } from '@/hooks/useLeads';
import { Calendar, DollarSign, Phone, Mail, User, Building, Target, FileText, Tag } from 'lucide-react';

interface LeadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export function LeadDetailDialog({ open, onOpenChange, lead }: LeadDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contact_name: '',
    email: '',
    phone: '',
    company: '',
    value: '',
    status: 'new' as const,
    source: '',
    notes: '',
    target_date: ''
  });

  const updateLead = useUpdateLead();

  useEffect(() => {
    if (lead) {
      setFormData({
        title: lead.title || '',
        contact_name: lead.contact_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        value: lead.value ? lead.value.toString() : '',
        status: lead.status,
        source: lead.source || '',
        notes: lead.notes || '',
        target_date: lead.target_date || ''
      });
    }
  }, [lead]);

  const handleSave = async () => {
    if (!lead) return;
    
    try {
      await updateLead.mutateAsync({
        id: lead.id,
        ...formData,
        contact_name: formData.contact_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        value: formData.value ? parseFloat(formData.value) : null,
        source: formData.source || null,
        notes: formData.notes || null,
        target_date: formData.target_date || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "qualified": return "bg-green-100 text-green-800";
      case "disqualified": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "新线索";
      case "contacted": return "已联系";
      case "qualified": return "已验证";
      case "disqualified": return "已淘汰";
      default: return status;
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{lead.title}</span>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(lead.status)}>
                {getStatusText(lead.status)}
              </Badge>
              <Button 
                variant={isEditing ? "destructive" : "outline"} 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '取消' : '编辑'}
              </Button>
              {isEditing && (
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={updateLead.isPending}
                >
                  {updateLead.isPending ? '保存中...' : '保存'}
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="lead" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lead">线索信息</TabsTrigger>
            <TabsTrigger value="address">地址信息</TabsTrigger>
            <TabsTrigger value="information">详细信息</TabsTrigger>
            <TabsTrigger value="notes">我的备注</TabsTrigger>
          </TabsList>

          <TabsContent value="lead" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">线索标题</Label>
                    {isEditing ? (
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{lead.title}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">状态</Label>
                    {isEditing ? (
                      <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">新线索</SelectItem>
                          <SelectItem value="contacted">已联系</SelectItem>
                          <SelectItem value="qualified">已验证</SelectItem>
                          <SelectItem value="disqualified">已淘汰</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{getStatusText(lead.status)}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      联系人
                    </Label>
                    {isEditing ? (
                      <Input
                        id="contact_name"
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{lead.contact_name || '-'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      公司
                    </Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{lead.company || '-'}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      邮箱
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{lead.email || '-'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      电话
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{lead.phone || '-'}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      预估价值 (¥)
                    </Label>
                    {isEditing ? (
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {lead.value ? `¥${lead.value.toLocaleString()}` : '-'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      目标日期
                    </Label>
                    {isEditing ? (
                      <Input
                        id="target_date"
                        type="date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {lead.target_date ? new Date(lead.target_date).toLocaleDateString('zh-CN') : '-'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source" className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    来源
                  </Label>
                  {isEditing ? (
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">{lead.source || '-'}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>地址信息</CardTitle>
                <CardDescription>联系地址和位置信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  地址信息功能开发中...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="information">
            <Card>
              <CardHeader>
                <CardTitle>详细信息</CardTitle>
                <CardDescription>其他详细信息和设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>创建时间</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {lead.created_at ? new Date(lead.created_at).toLocaleString('zh-CN') : '-'}
                    </div>
                  </div>
                  <div>
                    <Label>更新时间</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {lead.updated_at ? new Date(lead.updated_at).toLocaleString('zh-CN') : '-'}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>联系日期</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {lead.contacted_date ? new Date(lead.contacted_date).toLocaleString('zh-CN') : '未联系'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  我的备注
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="添加备注信息..."
                    rows={10}
                    className="w-full"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded min-h-[200px] whitespace-pre-wrap">
                    {lead.notes || '暂无备注'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
