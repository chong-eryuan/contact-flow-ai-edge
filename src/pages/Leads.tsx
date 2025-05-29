
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Eye, Edit, Trash2, Loader2, Calendar, DollarSign, Phone, Mail } from 'lucide-react';
import { AddLeadDialog } from '@/components/AddLeadDialog';
import { LeadDetailDialog } from '@/components/LeadDetailDialog';
import { useLeads, useDeleteLead, Lead } from '@/hooks/useLeads';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function Leads() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { data: leads = [], isLoading, error } = useLeads();
  const deleteLead = useDeleteLead();

  const getFilteredLeads = () => {
    if (activeTab === 'all') return leads;
    return leads.filter(lead => lead.status === activeTab);
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
      case "new": return "New Lead";
      case "contacted": return "Contacted";
      case "qualified": return "Qualified";
      case "disqualified": return "Disqualified";
      default: return status;
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailDialogOpen(true);
  };

  const filteredLeads = getFilteredLeads();

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading leads data: {error.message}
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
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600">Manage all your sales leads</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Lead List
          </CardTitle>
          <CardDescription>
            View and manage your sales leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="contacted">Contacted</TabsTrigger>
              <TabsTrigger value="qualified">Qualified</TabsTrigger>
              <TabsTrigger value="disqualified">Disqualified</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-6">
            <div className="text-sm text-gray-600">
              Total {filteredLeads.length} leads
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No leads found</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Create your first lead
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{lead.title}</CardTitle>
                      <Badge className={getStatusColor(lead.status)}>
                        {getStatusText(lead.status)}
                      </Badge>
                    </div>
                    {lead.contact_name && (
                      <CardDescription className="text-sm">
                        Contact: {lead.contact_name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lead.company && (
                      <div className="text-sm text-gray-600">
                        Company: {lead.company}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {lead.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-1" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-1" />
                          {lead.email}
                        </div>
                      )}
                    </div>

                    {lead.value && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Estimated Value: ${lead.value.toLocaleString()}
                      </div>
                    )}
                    
                    {lead.target_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        Target Date: {new Date(lead.target_date).toLocaleDateString()}
                      </div>
                    )}

                    {lead.source && (
                      <div className="text-sm text-gray-600">
                        Source: {lead.source}
                      </div>
                    )}

                    {lead.notes && (
                      <div className="text-sm text-gray-600">
                        Notes: {lead.notes.substring(0, 50)}
                        {lead.notes.length > 50 && '...'}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete lead "{lead.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteLead.mutate(lead.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddLeadDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      
      <LeadDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        lead={selectedLead}
      />
    </div>
  );
}
