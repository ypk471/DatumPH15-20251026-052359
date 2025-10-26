import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
type EmptyStateProps = {
  onAddDocument: () => void;
};
export function EmptyState({ onAddDocument }: EmptyStateProps) {
  return (
    <div className="text-center py-24 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <FilePlus2 className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No documents yet</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Add your first document to get started.
      </p>
      <div className="mt-6">
        <Button onClick={onAddDocument} size="lg" className="transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5">
          Add Your First Document
        </Button>
      </div>
    </div>
  );
}