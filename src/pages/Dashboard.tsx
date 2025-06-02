
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Users, Calendar, TrendingUp, Clock, DollarSign, Target } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useDeals } from '@/hooks/useDeals';
import { useFollowUps } from '@/hooks/useFollowUps';
import { useTasks } from '@/hooks/useTasks';
import { useCompleteFollowUp } from '@/hooks/useFollowUps';
import { TodaysMeetings } from '@/components/TodaysMeetings';

export default function Dashboard() {
  const { data: clients = [] } = useClients();
  const { data: deals = [] } = useDeals();
  const { data: followUps = [] } = useFollowUps();
  const { data: tasks = [] } = useTasks();
  const completeFollowUp = useCompleteFollowUp();

  // Calculate statistics from real data
  const totalClients = clients.length;
  const activeDeals = deals.filter(deal => deal.status === 'active').length;
  const wonDeals = deals.filter(deal => deal.status === 'won').length;
  const totalDealValue = deals
    .filter(deal => deal.status === 'active')
    .reduce((sum, deal) => sum + (deal.value || 0), 0);

  // Get pending follow-ups (not completed)
  const pendingFollowUps = followUps.filter(followUp => !followUp.completed_at);
  
  // Get overdue follow-ups
  const now = new Date();
  const overdueFollowUps = pendingFollowUps.filter(followUp => 
    new Date(followUp.scheduled_for) <= now
  );

  // Get pending tasks
  const pendingTasks = tasks.filter(task => 
    task.status !== 'completed'
  );

  const handleCompleteFollowUp = (id: string) => {
    completeFollowUp.mutate(id);
  };

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Deals",
      value: activeDeals,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Won Deals",
      value: wonDeals,
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Pipeline Value",
      value: `$${totalDealValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      title: "Pending Follow-ups",
      value: pendingFollowUps.length,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Pending Tasks",
      value: pendingTasks.length,
      icon: Calendar,
      color: "text-red-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "qualified": return "bg-yellow-100 text-yellow-800";
      case "contacted": return "bg-green-100 text-green-800";
      case "disqualified": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "normal": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Today's Meetings - AI Meeting Prep */}
      <TodaysMeetings />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Overdue Follow-ups
            </CardTitle>
            <CardDescription>
              These follow-ups are past their scheduled time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overdueFollowUps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No overdue follow-ups</p>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueFollowUps.slice(0, 5).map((followUp) => (
                  <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{followUp.title}</p>
                      <p className="text-sm text-gray-600">{followUp.description}</p>
                      <p className="text-xs text-red-600">
                        Due: {new Date(followUp.scheduled_for).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleCompleteFollowUp(followUp.id)}
                    >
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Recent Deals
            </CardTitle>
            <CardDescription>
              Latest deals in your pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No deals yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deals.slice(0, 5).map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-sm text-gray-600">{deal.clients?.name || 'No client'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(deal.status)}>
                          {deal.status}
                        </Badge>
                        {deal.value && (
                          <span className="text-sm font-medium text-green-600">
                            ${deal.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* High Priority Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            High Priority Tasks
          </CardTitle>
          <CardDescription>
            Tasks that need immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTasks.filter(task => task.priority === 'high' || task.priority === 'urgent').length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No high priority tasks</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks
                .filter(task => task.priority === 'high' || task.priority === 'urgent')
                .slice(0, 5)
                .map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getPriorityColor(task.priority || 'normal')}>
                        {task.priority || 'normal'}
                      </Badge>
                      {task.due_date && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
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
