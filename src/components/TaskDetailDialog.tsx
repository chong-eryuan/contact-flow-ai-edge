
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUpdateTask, useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { Calendar, User, FolderOpen, FileText, CheckSquare, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
  status: 'new' | 'in_progress' | 'testing' | 'awaiting_feedback' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent' | null;
  due_date: string | null;
  assigned_to: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  projects?: { title: string } | null;
  clients?: { name: string } | null;
}

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function TaskDetailDialog({ open, onOpenChange, task }: TaskDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new' as Task['status'],
    priority: 'normal' as Task['priority'],
    due_date: '',
    assigned_to: '',
    project_id: '',
    client_id: ''
  });

  const updateTask = useUpdateTask();
  const { data: projects = [] } = useProjects();
  const { data: clients = [] } = useClients();

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'normal',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        assigned_to: task.assigned_to || '',
        project_id: task.project_id || '',
        client_id: task.client_id || ''
      });
      setIsEditing(false);
    }
  }, [task, open]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "testing": return "bg-purple-100 text-purple-800";
      case "awaiting_feedback": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "New";
      case "in_progress": return "In Progress";
      case "testing": return "Testing";
      case "awaiting_feedback": return "Awaiting Feedback";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string | null) => {
    switch (priority) {
      case "urgent": return "Urgent";
      case "high": return "High";
      case "normal": return "Normal";
      case "low": return "Low";
      default: return "Normal";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      await updateTask.mutateAsync({
        id: task.id,
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
        assigned_to: formData.assigned_to || null,
        project_id: formData.project_id || null,
        client_id: formData.client_id || null
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            {isEditing ? 'Edit Task' : 'Task Details'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update task information' : 'View task details and progress'}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="awaiting_feedback">Awaiting Feedback</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority || 'normal'} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_id">Project</Label>
                <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_id">Client</Label>
                <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="Enter assignee name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Task description and requirements..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateTask.isPending}>
                {updateTask.isPending ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <div className="flex gap-2">
                <Badge className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {getPriorityText(task.priority)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {task.projects && (
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Project</p>
                    <p className="font-medium">{task.projects.title}</p>
                  </div>
                </div>
              )}

              {task.clients && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium">{task.clients.name}</p>
                  </div>
                </div>
              )}

              {task.due_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{new Date(task.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {task.assigned_to && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-medium">{task.assigned_to}</p>
                  </div>
                </div>
              )}

              {task.created_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">{new Date(task.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {task.updated_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{new Date(task.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {task.description && (
              <div className="border-t pt-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{task.description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Task
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
