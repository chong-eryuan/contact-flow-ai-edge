
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Eye, Loader2 } from 'lucide-react';
import { AddClientDialog } from '@/components/AddClientDialog';
import { useClients } from '@/hooks/useClients';

export default function Clients() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { data: clients = [], isLoading, error } = useClients();

  const getFilteredClients = () => {
    if (activeTab === 'all') return clients;
    // Since we don't have status in the database schema, we'll use all clients for now
    // You can add a status column later if needed
    return clients;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Prospect": return "bg-yellow-100 text-yellow-800";
      case "Closed": return "bg-green-100 text-green-800";
      case "Cold": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const filteredClients = getFilteredClients();

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading client data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600">Manage all your client information</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Client List
          </CardTitle>
          <CardDescription>
            View and manage your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              Total {clients.length} clients
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No clients found</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add your first client
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.email || 'No email'}</p>
                      {client.company && (
                        <p className="text-sm text-gray-500">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-gray-600">
                        {client.created_at ? new Date(client.created_at).toLocaleDateString('en-US') : 'Unknown'}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/clients/${client.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddClientDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
}
