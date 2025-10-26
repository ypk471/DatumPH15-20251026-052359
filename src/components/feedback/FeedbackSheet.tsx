import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/hooks/use-auth';
import { useFeedbackStore } from '@/hooks/use-feedback';
const formSchema = z.object({
  comment: z.string().min(10, { message: 'Feedback must be at least 10 characters.' }).max(500, { message: 'Feedback must be 500 characters or less.' }),
});
type FeedbackSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};
export function FeedbackSheet({ isOpen, onOpenChange }: FeedbackSheetProps) {
  const { user } = useAuthStore();
  const { submitFeedback } = useFeedbackStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      console.error("No user found to associate feedback with.");
      return;
    }
    const feedbackData = {
      userId: user.id,
      username: user.username,
      comment: values.comment,
    };
    const result = await submitFeedback(feedbackData);
    if (result) {
      form.reset();
      onOpenChange(false);
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Submit Feedback</SheetTitle>
          <SheetDescription>
            We'd love to hear your thoughts! Let us know what you think or if you've found a bug.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what's on your mind..."
                      className="resize-none"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Feedback
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}