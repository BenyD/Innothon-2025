import { toast } from '@/components/ui/use-toast';

export function handleError(error: any, context: string) {
  console.error(`Error in ${context}:`, error);
  
  const message = error.message || 'An unexpected error occurred';
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
} 