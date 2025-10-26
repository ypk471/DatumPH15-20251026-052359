import { create } from 'zustand';
import { api } from '@/lib/api-client';
import type { Feedback } from '@shared/types';
import { toast } from 'sonner';
type FeedbackState = {
  feedback: Feedback[];
  isLoading: boolean;
  error: string | null;
  fetchFeedback: (userId: string) => Promise<void>;
  submitFeedback: (newFeedback: Omit<Feedback, 'id' | 'timestamp'>) => Promise<Feedback | undefined>;
};
export const useFeedbackStore = create<FeedbackState>((set) => ({
  feedback: [],
  isLoading: true,
  error: null,
  fetchFeedback: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const feedback = await api<Feedback[]>(`/api/feedback?userId=${userId}`);
      set({ feedback, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feedback';
      set({ error: errorMessage, isLoading: false, feedback: [] }); // Clear feedback on error
      toast.error(errorMessage);
    }
  },
  submitFeedback: async (newFeedback) => {
    try {
      const createdFeedback = await api<Feedback>('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(newFeedback),
      });
      toast.success('Thank you for your feedback!');
      return createdFeedback;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback';
      toast.error(errorMessage);
      return undefined;
    }
  },
}));