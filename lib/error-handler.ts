import { toast } from '@/components/ui/use-toast';

// Add specific type for error handling
interface ErrorContext {
  message?: string;
  code?: string;
  details?: unknown;
}

export function handleError(error: Error | ErrorContext | unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  
  let message = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    message = String(error.message);
  }
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
} 