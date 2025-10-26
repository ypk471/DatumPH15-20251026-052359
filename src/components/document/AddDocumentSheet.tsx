import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useDocumentsStore } from '@/hooks/use-documents';
import { cn } from '@/lib/utils';
import type { Document } from '@shared/types';
import { useAuthStore } from '@/hooks/use-auth';
const formSchema = z.object({
  personelName: z.string().min(2, { message: 'Personel name must be at least 2 characters.' }),
  name: z.string().min(2, { message: 'Document name must be at least 2 characters.' }),
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date.',
  path: ['endDate'],
});
type AddDocumentSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  documentToEdit?: Document | null;
};
export function AddDocumentSheet({ isOpen, onOpenChange, documentToEdit }: AddDocumentSheetProps) {
  const addDocument = useDocumentsStore((state) => state.addDocument);
  const updateDocument = useDocumentsStore((state) => state.updateDocument);
  const { user } = useAuthStore();
  const isEditMode = !!documentToEdit;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personelName: '',
      name: '',
    },
  });
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        form.reset({
          personelName: documentToEdit.personelName,
          name: documentToEdit.name,
          startDate: new Date(documentToEdit.startDate),
          endDate: new Date(documentToEdit.endDate),
        });
      } else {
        form.reset({
          personelName: '',
          name: '',
          startDate: undefined,
          endDate: undefined,
        });
      }
    }
  }, [documentToEdit, form, isEditMode, isOpen]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      // This should not happen if the form is only accessible to logged-in users
      console.error("No user found to associate the document with.");
      return;
    }
    const documentData = {
      personelName: values.personelName,
      name: values.name,
      startDate: values.startDate.getTime(),
      endDate: values.endDate.getTime(),
      userId: user.id,
    };
    let result;
    if (isEditMode && documentToEdit) {
      result = await updateDocument(documentToEdit.id, documentData);
    } else {
      result = await addDocument(documentData);
    }
    if (result) {
      onOpenChange(false);
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Document' : 'Add a New Document'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update the details of your document.' : 'Enter the details of your document to start tracking its expiration.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="personelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Passport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={1990}
                        toYear={new Date().getFullYear() + 20}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={1990}
                        toYear={new Date().getFullYear() + 20}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Save Document'}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}