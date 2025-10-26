import { differenceInDays, isPast } from 'date-fns';
import type { Document } from '@shared/types';
export type DocumentStatus = 'safe' | 'warning' | 'danger' | 'expired';
export interface DocumentStatusInfo {
  daysRemaining: number;
  status: DocumentStatus;
  isExpired: boolean;
}
export function getDocumentStatus(document: Document): DocumentStatusInfo {
  const now = new Date();
  const startDate = new Date(document.startDate);
  const endDate = new Date(document.endDate);
  const days = differenceInDays(endDate, now);
  const expired = isPast(endDate);
  if (expired) {
    return { daysRemaining: days, status: 'expired', isExpired: true };
  }
  const totalDurationDays = differenceInDays(endDate, startDate);
  let redThreshold = 30; // Default
  if (totalDurationDays >= 365) {
    redThreshold = 90;
  } else if (totalDurationDays <= 182) { // Approx 6 months
    redThreshold = 45;
  }
  let status: DocumentStatus = 'safe';
  if (days <= redThreshold) {
    status = 'danger';
  } else if (days <= 90) {
    status = 'warning';
  }
  return { daysRemaining: days, status, isExpired: false };
}