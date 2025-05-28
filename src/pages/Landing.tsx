
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, Calendar, BarChart3, Shield, Zap } from 'lucide-react';

export default function Landing() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AI Micro CRM</span>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link to="/login">
              <Button>免费开始</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          智能客户关系管理系统
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          借助AI技术，轻松管理客户关系，自动跟进提醒，提升销售效率。
          专为中小企业打造的简单易用的CRM解决方案。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <input
            type="email"
            placeholder="输入您的邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 w-full sm:w-80"
          />
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto">
              立即开始使用
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          免费试用 • 无需信用卡 • 随时可以取消
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">为什么选择 AI Micro CRM？</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            我们专注于提供简单、高效的客户管理工具，让您专注于业务增长
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>智能客户管理</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                集中管理所有客户信息，智能分类潜在客户、已成交客户和冷淡客户
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle>自动跟进提醒</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                基于客户设置的跟进周期，自动提醒需要联系的客户，不错过任何机会
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Bot className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>AI智能助手</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI助手帮您分析客户数据，生成邮件模板，提供销售建议和策略
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>数据分析洞察</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                直观的仪表板展示客户转化率、跟进情况等关键业务指标
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle>数据安全保障</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                企业级安全保护，数据加密存储，确保您的客户信息安全
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>简单易用</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                无需复杂培训，直观的界面设计，5分钟即可上手使用
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备开始了吗？</h2>
          <p className="text-xl mb-8 opacity-90">
            加入数千家企业的行列，用AI技术提升您的客户管理效率
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              立即免费注册
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Micro CRM</span>
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2024 AI Micro CRM. 保留所有权利。</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
