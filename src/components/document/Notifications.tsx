import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import type { Document } from "@shared/types";
type NotificationsProps = {
  expiringDocuments: Document[];
};
export function Notifications({ expiringDocuments }: NotificationsProps) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible || expiringDocuments.length === 0) {
    return null;
  }
  return (
    <Alert variant="destructive" className="relative animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Expiring Soon!</AlertTitle>
      <AlertDescription>
        You have {expiringDocuments.length} document(s) that require your attention:
        <ul className="list-disc pl-5 mt-2">
          {expiringDocuments.map((doc) => (
            <li key={doc.id}>
              <strong>{doc.name}</strong> for {doc.personelName}
            </li>
          ))}
        </ul>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </Alert>
  );
}