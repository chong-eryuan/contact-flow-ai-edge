
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUpdateLead, Lead } from '@/hooks/useLeads';
import { Calendar, DollarSign, Phone, Mail, Building, User, Tag, FileText, Target as TargetIcon } from 'lucide-react';

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
    status: 'new' as Lead['status'],
    source: '',
    notes: '',
    target_date: ''
  });

  const updateLead = useUpdateLead();

  useEffect(() => {
    if (lead && open) {
      setFormData({
        title: lead.title || '',
        contact_name: lead.contact_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        value: lead.value?.toString() || '',
        status: lead.status,
        source: lead.source || '',
        notes: lead.notes || '',
        target_date: lead.target_date ? lead.target_date.split('T')[0] : ''
      });
      setIsEditing(false);
    }
  }, [lead, open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    try {
      await updateLead.mutateAsync({
        id: lead.id,
        title: formData.title,
        contact_name: formData.contact_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        value: formData.value ? parseFloat(formData.value) : null,
        status: formData.status,
        source: formData.source || null,
        notes: formData.notes || null,
        target_date: formData.target_date || null
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5" />
            {isEditing ? 'Edit Lead' : 'Lead Details'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update lead information' : 'View lead details and contact information'}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Lead Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Lead['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Lead</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="disqualified">Disqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Estimated Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_date">Target Date</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g., Website, Referral, Cold Call"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Additional notes about this lead..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLead.isPending}>
                {updateLead.isPending ? 'Updating...' : 'Update Lead'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{lead.title}</h2>
              <Badge className={getStatusColor(lead.status)}>
                {getStatusText(lead.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lead.contact_name && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Name</p>
                    <p className="font-medium">{lead.contact_name}</p>
                  </div>
                </div>
              )}

              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{lead.company}</p>
                  </div>
                </div>
              )}

              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                </div>
              )}

              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                </div>
              )}

              {lead.value && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Value</p>
                    <p className="font-medium">${lead.value.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {lead.target_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Target Date</p>
                    <p className="font-medium">{new Date(lead.target_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {lead.source && (
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Source</p>
                    <p className="font-medium">{lead.source}</p>
                  </div>
                </div>
              )}
            </div>

            {lead.notes && (
              <div className="border-t pt-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Lead
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
