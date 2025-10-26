import { useEffect } from 'react';
import { format } from 'date-fns';
import { MessageSquare, User, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeedbackStore } from '@/hooks/use-feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/hooks/use-auth';
export function AdminPage() {
  const { feedback, isLoading, fetchFeedback } = useFeedbackStore();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user?.id) {
      fetchFeedback(user.id);
    }
  }, [fetchFeedback, user]);
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    if (feedback.length === 0) {
      return (
        <div className="text-center py-24 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex justify-center mb-4">
            <MessageSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No Feedback Yet</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Check back later to see what users are saying.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {feedback.map((item) => (
          <Card key={item.id} className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  <span>{item.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(item.timestamp), 'PPP p')}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 whitespace-pre-wrap">{item.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  return (
    <>
      <main className="min-h-screen container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Here you can view all feedback submitted by users.
        </p>
        {renderContent()}
      </main>
      <Toaster richColors position="top-right" />
    </>
  );
}