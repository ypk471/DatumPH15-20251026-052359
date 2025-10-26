import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { AddDocumentSheet } from '@/components/document/AddDocumentSheet';
import { DocumentCard } from '@/components/document/DocumentCard';
import { EmptyState } from '@/components/document/EmptyState';
import { Header } from '@/components/layout/Header';
import { useDocumentsStore } from '@/hooks/use-documents';
import type { Document } from '@shared/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Notifications } from '@/components/document/Notifications';
import { getDocumentStatus } from '@/lib/document-utils';
import { useAuthStore } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { FeedbackSheet } from '@/components/feedback/FeedbackSheet';
export function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFeedbackSheetOpen, setIsFeedbackSheetOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const { user } = useAuthStore();
  const { documents, isLoading, fetchDocuments } = useDocumentsStore();
  useEffect(() => {
    if (user?.id) {
      fetchDocuments(user.id);
    }
  }, [fetchDocuments, user]);
  const expiringDocuments = useMemo(() => {
    return documents.filter(doc => getDocumentStatus(doc).status === 'danger');
  }, [documents]);
  const groupedDocuments = useMemo(() => {
    return documents.reduce((acc, doc) => {
      (acc[doc.personelName] = acc[doc.personelName] || []).push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
  }, [documents]);
  const personnelNames = useMemo(() => Object.keys(groupedDocuments).sort(), [groupedDocuments]);
  const handleAddDocument = () => {
    setDocumentToEdit(null);
    setIsSheetOpen(true);
  };
  const handleEditDocument = (doc: Document) => {
    setDocumentToEdit(doc);
    setIsSheetOpen(true);
  };
  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen);
    if (!isOpen) {
      setDocumentToEdit(null);
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4 p-4 border rounded-lg">
              <Skeleton className="h-8 w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (documents.length === 0) {
      return <EmptyState onAddDocument={handleAddDocument} />;
    }
    return (
      <Accordion type="multiple" defaultValue={personnelNames.length > 0 ? [personnelNames[0]] : []} className="w-full space-y-4">
        {personnelNames.map((personelName) => (
          <AccordionItem value={personelName} key={personelName} className="border dark:border-slate-800 rounded-lg overflow-hidden bg-card">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{personelName}</h2>
                <Badge variant="secondary">{groupedDocuments[personelName].length} document(s)</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {groupedDocuments[personelName].map((doc) => (
                    <DocumentCard key={doc.id} document={doc} onEdit={() => handleEditDocument(doc)} />
                  ))}
                </AnimatePresence>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  return (
    <>
      <main className="min-h-screen container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Header onAddDocument={handleAddDocument} />
        <div className="mt-8 space-y-8">
          <Notifications expiringDocuments={expiringDocuments} />
          {renderContent()}
        </div>
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-24 space-y-4">
          <Button variant="link" onClick={() => setIsFeedbackSheetOpen(true)}>Leave Feedback</Button>
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </main>
      <AddDocumentSheet
        isOpen={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        documentToEdit={documentToEdit}
      />
      <FeedbackSheet
        isOpen={isFeedbackSheetOpen}
        onOpenChange={setIsFeedbackSheetOpen}
      />
      <Toaster richColors position="top-right" />
    </>
  );
}