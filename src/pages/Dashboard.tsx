
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Users, Calendar, TrendingUp, Clock } from 'lucide-react';
import { mockClients } from '@/lib/mockData';

export default function Dashboard() {
  const [followUpClients, setFollowUpClients] = useState<any[]>([]);

  useEffect(() => {
    // Filter clients that need follow-up
    const now = new Date();
    const clientsNeedingFollowUp = mockClients.filter(client => {
      const lastContact = new Date(client.last_contact);
      const followUpDate = new Date(lastContact.getTime() + client.follow_up_days * 24 * 60 * 60 * 1000);
      return followUpDate <= now;
    });
    setFollowUpClients(clientsNeedingFollowUp);
  }, []);

  const handleMarkContacted = (clientId: string) => {
    // Update client's last contact time
    setFollowUpClients(prev => prev.filter(client => client.id !== clientId));
    console.log('Mark client as contacted:', clientId);
  };

  const stats = [
    {
      title: "Total Clients",
      value: mockClients.length,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Closed Deals",
      value: mockClients.filter(c => c.status === "已成交").length,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Prospects",
      value: mockClients.filter(c => c.status === "潜在").length,
      icon: Calendar,
      color: "text-yellow-600"
    },
    {
      title: "Follow-up Required",
      value: followUpClients.length,
      icon: Clock,
      color: "text-red-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "潜在": return "bg-yellow-100 text-yellow-800";
      case "已成交": return "bg-green-100 text-green-800";
      case "冷淡": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back to AI Micro CRM</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follow-up Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Follow-up Required
          </CardTitle>
          <CardDescription>
            These clients need timely follow-up contact
          </CardDescription>
        </CardHeader>
        <CardContent>
          {followUpClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No clients require follow-up at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {followUpClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Last Contact</p>
                      <p className="text-sm text-gray-600">
                        {new Date(client.last_contact).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleMarkContacted(client.id)}
                    >
                      Mark as Contacted
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
