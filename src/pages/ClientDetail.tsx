
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Mail, Calendar, Plus, MessageCircle, Phone, Video, FileText } from 'lucide-react';
import { mockClients, mockInteractions } from '@/lib/mockData';
import { AddInteractionDialog } from '@/components/AddInteractionDialog';

export default function ClientDetail() {
  const { id } = useParams();
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [client, setClient] = useState(() => mockClients.find(c => c.id === id));

  if (!client) {
    return <Navigate to="/clients" replace />;
  }

  const clientInteractions = mockInteractions.filter(i => i.client_id === client.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "潜在": return "bg-yellow-100 text-yellow-800";
      case "已成交": return "bg-green-100 text-green-800";
      case "冷淡": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "通话": return Phone;
      case "邮件": return Mail;
      case "会议": return Video;
      case "其他": return FileText;
      default: return MessageCircle;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setClient(prev => prev ? { ...prev, status: newStatus } : null);
    console.log('更新客户状态:', newStatus);
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
        <Button onClick={() => setIsAddInteractionOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新增联系记录
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-gray-600">{client.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium">上次联系</p>
                <p className="text-gray-600">
                  {new Date(client.last_contact).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <label className="font-medium">客户状态：</label>
            <Select value={client.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="潜在">潜在</SelectItem>
                <SelectItem value="已成交">已成交</SelectItem>
                <SelectItem value="冷淡">冷淡</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
          </div>
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
          {clientInteractions.length === 0 ? (
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
              {clientInteractions
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((interaction) => {
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
                            {new Date(interaction.created_at).toLocaleString('zh-CN')}
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
