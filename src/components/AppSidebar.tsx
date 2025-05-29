
import { LayoutDashboard, Users, Bot, LogOut, FolderOpen, CheckSquare, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    title: "仪表板",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "客户管理",
    url: "/clients",
    icon: Users,
  },
  {
    title: "项目管理",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "任务管理",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "线索管理",
    url: "/leads",
    icon: Target,
  },
  {
    title: "AI助手历史",
    url: "/assistant/history",
    icon: Bot,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg">AI Micro CRM</h1>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>主要功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
