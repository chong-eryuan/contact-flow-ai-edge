
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Mail, Calendar, Plus, MessageCircle, Phone, Video, FileText, Loader2, ExternalLink } from 'lucide-react';
import { AddInteractionDialog } from '@/components/AddInteractionDialog';
import { useClients, useUpdateClient } from '@/hooks/useClients';
import { useInteractions } from '@/hooks/useInteractions';

export default function ClientDetail() {
  const { id } = useParams();
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: interactions = [], isLoading: interactionsLoading } = useInteractions(id || '');
  const updateClient = useUpdateClient();
  
  const client = clients.find(c => c.id === id);
  
  const [editForm, setEditForm] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    notes: client?.notes || ''
  });

  // Update form when client data loads
  useState(() => {
    if (client) {
      setEditForm({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        notes: client.notes || ''
      });
    }
  });

  if (clientsLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  if (!client) {
    return <Navigate to="/clients" replace />;
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "通话": return Phone;
      case "邮件": return Mail;
      case "会议": return Video;
      case "微信": return MessageCircle;
      case "WhatsApp": return MessageCircle;
      case "其他": return FileText;
      default: return MessageCircle;
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateClient.mutateAsync({
        id: client.id,
        ...editForm,
        email: editForm.email || null,
        phone: editForm.phone || null,
        company: editForm.company || null,
        notes: editForm.notes || null
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'email':
        if (client.email) {
          window.open(`mailto:${client.email}`, '_blank');
        }
        break;
      case 'phone':
        if (client.phone) {
          window.open(`tel:${client.phone}`, '_blank');
        }
        break;
      case 'whatsapp':
        if (client.phone) {
          const cleanPhone = client.phone.replace(/\D/g, '');
          window.open(`https://wa.me/${cleanPhone}`, '_blank');
        }
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">客户详细信息</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                编辑信息
              </Button>
              <Button onClick={() => setIsAddInteractionOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新增联系记录
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateClient.isPending}>
                {updateClient.isPending ? '保存中...' : '保存'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 客户基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">姓名 *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">邮箱</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">电话</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">公司</Label>
                <Input
                  id="edit-company"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-notes">备注</Label>
                <Textarea
                  id="edit-notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">姓名</p>
                    <p className="text-gray-600">{client.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium">邮箱</p>
                    <p className="text-gray-600">{client.email || '未设置'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium">电话</p>
                    <p className="text-gray-600">{client.phone || '未设置'}</p>
                  </div>
                </div>
              </div>

              {client.company && (
                <div className="mb-6">
                  <p className="font-medium">公司</p>
                  <p className="text-gray-600">{client.company}</p>
                </div>
              )}

              {client.notes && (
                <div className="mb-6">
                  <p className="font-medium">备注</p>
                  <p className="text-gray-600 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}

              {/* 快速操作按钮 */}
              <div className="flex gap-2 pt-4 border-t">
                <p className="font-medium mr-4 self-center">快速操作：</p>
                {client.email && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickAction('email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    发邮件
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
                {client.phone && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuickAction('phone')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      拨打电话
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuickAction('whatsapp')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 联系记录时间线 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            联系记录
          </CardTitle>
          <CardDescription>
            按时间顺序查看所有联系记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interactionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">加载中...</span>
            </div>
          ) : interactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无联系记录</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setIsAddInteractionOpen(true)}
              >
                添加第一条记录
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => {
                const Icon = getInteractionIcon(interaction.type);
                return (
                  <div key={interaction.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <span className="text-sm text-gray-500">
                          {interaction.created_at ? new Date(interaction.created_at).toLocaleString('zh-CN') : '未知时间'}
                        </span>
                      </div>
                      <p className="text-gray-700">{interaction.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddInteractionDialog 
        open={isAddInteractionOpen} 
        onOpenChange={setIsAddInteractionOpen}
        clientId={client.id}
      />
    </div>
  );
}
