
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckSquare, Eye, Edit, Trash2, Loader2, Calendar, User, FolderOpen } from 'lucide-react';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

export default function Tasks() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { data: tasks = [], isLoading, error } = useTasks();
  const deleteTask = useDeleteTask();

  const getFilteredTasks = () => {
    if (activeTab === 'all') return tasks;
    return tasks.filter(task => task.status === activeTab);
  };

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

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };

  const filteredTasks = getFilteredTasks();

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading tasks data: {error.message}
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
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Manage all your tasks</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Task List
          </CardTitle>
          <CardDescription>
            View and manage your tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="awaiting_feedback">Awaiting Feedback</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-6">
            <div className="text-sm text-gray-600">
              Total {filteredTasks.length} tasks
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks found</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-lg">{task.title}</h3>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {task.description.substring(0, 150)}
                            {task.description.length > 150 && '...'}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {task.projects && (
                            <div className="flex items-center">
                              <FolderOpen className="w-4 h-4 mr-1" />
                              {task.projects.title}
                            </div>
                          )}
                          
                          {task.clients && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {task.clients.name}
                            </div>
                          )}
                          
                          {task.due_date && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}

                          {task.assigned_to && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              Assigned: {task.assigned_to}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTask(task)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTask(task)}
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
                                Are you sure you want to delete task "{task.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTask.mutate(task.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTaskDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      
      <TaskDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        task={selectedTask}
      />
    </div>
  );
}
