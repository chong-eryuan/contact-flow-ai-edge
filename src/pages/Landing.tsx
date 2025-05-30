
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
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Customer Relationship Management
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Leverage AI technology to easily manage customer relationships, automate follow-up reminders, and boost sales efficiency.
          A simple and intuitive CRM solution designed for small to medium businesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 w-full sm:w-80"
          />
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Start Using Now
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Free trial • No credit card required • Cancel anytime
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose AI Micro CRM?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We focus on providing simple, efficient customer management tools that let you focus on business growth
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Smart Customer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Centrally manage all customer information with intelligent categorization of prospects, closed deals, and inactive customers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Automated Follow-up Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Based on customer-specific follow-up cycles, automatically remind you of clients who need contact, never miss an opportunity
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Bot className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>AI Smart Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI assistant helps analyze customer data, generate email templates, and provide sales recommendations and strategies
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Data Analytics Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intuitive dashboard displaying key business metrics like customer conversion rates and follow-up status
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Data Security Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enterprise-grade security protection with encrypted data storage to ensure your customer information is safe
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>Simple and Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                No complex training required, intuitive interface design, get up and running in 5 minutes
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using AI technology to improve customer management efficiency
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Sign Up for Free Now
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
              <p>&copy; 2024 AI Micro CRM. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
