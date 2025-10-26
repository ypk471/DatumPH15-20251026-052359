import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Pencil, Trash2, User } from 'lucide-react';
import { useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentsStore } from '@/hooks/use-documents';
import { getDocumentStatus } from '@/lib/document-utils';
import { cn } from '@/lib/utils';
import type { Document } from '@shared/types';
import { useAuthStore } from '@/hooks/use-auth';
type DocumentCardProps = {
  document: Document;
  onEdit: () => void;
};
export function DocumentCard({ document, onEdit }: DocumentCardProps) {
  const deleteDocument = useDocumentsStore((state) => state.deleteDocument);
  const { user } = useAuthStore();
  const { daysRemaining, status, isExpired } = useMemo(
    () => getDocumentStatus(document),
    [document]
  );
  const statusBorderColor = {
    safe: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    danger: 'border-l-red-500',
    expired: 'border-l-gray-500',
  }[status];
  const handleDelete = () => {
    if (user?.id) {
      deleteDocument(document.id, user.id);
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className={cn("flex flex-col h-full overflow-hidden transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 border-l-4", statusBorderColor)}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{document.name}</CardTitle>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pt-1">
            <User className="mr-2 h-4 w-4" />
            <span>{document.personelName}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="text-sm">
              Expires on {format(new Date(document.endDate), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-full text-center font-bold text-2xl",
            isExpired ? "bg-gray-100 dark:bg-gray-800 text-gray-500" : "bg-opacity-10",
            status === 'danger' && "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
            status === 'warning' && "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
            status === 'safe' && "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
          )}>
            {isExpired ? 'Expired' : `${daysRemaining} days left`}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end bg-slate-50 dark:bg-slate-800/50 p-3 space-x-2">
          <Button variant="ghost" size="icon" onClick={onEdit} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the document "{document.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}