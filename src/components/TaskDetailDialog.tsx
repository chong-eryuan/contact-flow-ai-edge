
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
import { useUpdateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { Calendar, User, FolderOpen, CheckSquare, Clock, Flag, FileText, Paperclip } from 'lucide-react';

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
    project_id: '',
    client_id: '',
    status: 'new' as const,
    priority: 'normal' as const,
    due_date: '',
    assigned_to: ''
  });

  const updateTask = useUpdateTask();
  const { data: projects = [] } = useProjects();
  const { data: clients = [] } = useClients();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        project_id: task.project_id || '',
        client_id: task.client_id || '',
        status: task.status,
        priority: task.priority || 'normal',
        due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
        assigned_to: task.assigned_to || ''
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    try {
      await updateTask.mutateAsync({
        id: task.id,
        ...formData,
        project_id: formData.project_id || null,
        client_id: formData.client_id || null,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        assigned_to: formData.assigned_to || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
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
      case "new": return "新建";
      case "in_progress": return "进行中";
      case "testing": return "测试中";
      case "awaiting_feedback": return "等待反馈";
      case "completed": return "已完成";
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
      case "urgent": return "紧急";
      case "high": return "高";
      case "normal": return "普通";
      case "low": return "低";
      default: return "普通";
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{task.title}</span>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {getPriorityText(task.priority)}
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
                  disabled={updateTask.isPending}
                >
                  {updateTask.isPending ? '保存中...' : '保存'}
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="task" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="task">任务</TabsTrigger>
            <TabsTrigger value="information">信息</TabsTrigger>
            <TabsTrigger value="notes">备注</TabsTrigger>
            <TabsTrigger value="relations">关联</TabsTrigger>
          </TabsList>

          <TabsContent value="task" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  任务详情
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">任务标题</Label>
                  {isEditing ? (
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">{task.title}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">任务描述</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded min-h-[100px]">
                      {task.description || '无描述'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">状态</Label>
                    {isEditing ? (
                      <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">新建</SelectItem>
                          <SelectItem value="in_progress">进行中</SelectItem>
                          <SelectItem value="testing">测试中</SelectItem>
                          <SelectItem value="awaiting_feedback">等待反馈</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{getStatusText(task.status)}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      优先级
                    </Label>
                    {isEditing ? (
                      <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="normal">普通</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="urgent">紧急</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{getPriorityText(task.priority)}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      截止日期
                    </Label>
                    {isEditing ? (
                      <Input
                        id="due_date"
                        type="datetime-local"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {task.due_date ? new Date(task.due_date).toLocaleString('zh-CN') : '无截止日期'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assigned_to" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      负责人
                    </Label>
                    {isEditing ? (
                      <Input
                        id="assigned_to"
                        value={formData.assigned_to}
                        onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{task.assigned_to || '未分配'}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="information">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>创建时间</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {task.created_at ? new Date(task.created_at).toLocaleString('zh-CN') : '-'}
                    </div>
                  </div>
                  <div>
                    <Label>更新时间</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {task.updated_at ? new Date(task.updated_at).toLocaleString('zh-CN') : '-'}
                    </div>
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
                  备注与附件
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>任务备注</Label>
                  <Textarea 
                    placeholder="添加任务备注..." 
                    rows={6}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    附件
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                    拖拽文件到此处或点击上传
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relations">
            <Card>
              <CardHeader>
                <CardTitle>关联项目和客户</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_id" className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      关联项目
                    </Label>
                    {isEditing ? (
                      <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择项目（可选）" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">无关联项目</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {task.projects?.title || '无关联项目'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_id" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      关联客户
                    </Label>
                    {isEditing ? (
                      <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择客户（可选）" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">无关联客户</SelectItem>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {task.clients?.name || '无关联客户'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
