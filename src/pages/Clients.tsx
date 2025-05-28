
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Eye } from 'lucide-react';
import { mockClients } from '@/lib/mockData';
import { AddClientDialog } from '@/components/AddClientDialog';

export default function Clients() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredClients = () => {
    if (activeTab === 'all') return mockClients;
    return mockClients.filter(client => client.status === activeTab);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "潜在": return "bg-yellow-100 text-yellow-800";
      case "已成交": return "bg-green-100 text-green-800";
      case "冷淡": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const filteredClients = getFilteredClients();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">客户管理</h1>
            <p className="text-gray-600">管理您的所有客户信息</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加客户
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            客户列表
          </CardTitle>
          <CardDescription>
            按状态查看和管理您的客户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">全部 ({mockClients.length})</TabsTrigger>
              <TabsTrigger value="潜在">潜在 ({mockClients.filter(c => c.status === "潜在").length})</TabsTrigger>
              <TabsTrigger value="已成交">已成交 ({mockClients.filter(c => c.status === "已成交").length})</TabsTrigger>
              <TabsTrigger value="冷淡">冷淡 ({mockClients.filter(c => c.status === "冷淡").length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">上次联系</p>
                        <p className="text-sm text-gray-600">
                          {new Date(client.last_contact).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/clients/${client.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddClientDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
}
