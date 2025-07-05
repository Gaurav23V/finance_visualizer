import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8'>
      {/* Hero Section */}
      <div className='text-center space-y-4 max-w-3xl mx-auto'>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
          Finance
          <span className='text-primary'> Visualizer</span>
        </h1>
        <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
          Take control of your personal finances with powerful visualization
          tools, budget tracking, and insightful analytics. Make informed
          decisions about your money.
        </p>
        <div className='flex flex-col gap-2 min-[400px]:flex-row justify-center'>
          <Button size='lg' className='min-[400px]:w-auto'>
            Get Started
          </Button>
          <Button variant='outline' size='lg' className='min-[400px]:w-auto'>
            View Demo
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto'>
        <Card className='relative overflow-hidden'>
          <CardHeader className='pb-2'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2'>
              <Wallet className='w-5 h-5 text-primary' />
            </div>
            <CardTitle className='text-lg'>Transaction Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Easily record and categorize your income and expenses with our
              intuitive interface.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden'>
          <CardHeader className='pb-2'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2'>
              <BarChart3 className='w-5 h-5 text-primary' />
            </div>
            <CardTitle className='text-lg'>Visual Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Interactive charts and graphs help you understand your spending
              patterns and trends.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden'>
          <CardHeader className='pb-2'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2'>
              <PieChart className='w-5 h-5 text-primary' />
            </div>
            <CardTitle className='text-lg'>Budget Management</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Set budgets for different categories and track your progress
              throughout the month.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden'>
          <CardHeader className='pb-2'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2'>
              <TrendingUp className='w-5 h-5 text-primary' />
            </div>
            <CardTitle className='text-lg'>Financial Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get personalized insights and recommendations to improve your
              financial health.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Preview */}
      <div className='w-full max-w-4xl mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>
              Ready to Transform Your Finances?
            </CardTitle>
            <CardDescription className='text-lg'>
              Join thousands of users who have taken control of their financial
              future.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-3xl font-bold text-primary'>10K+</div>
              <div className='text-muted-foreground'>Transactions Tracked</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-primary'>95%</div>
              <div className='text-muted-foreground'>Budget Accuracy</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-primary'>$50K+</div>
              <div className='text-muted-foreground'>Money Saved</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
