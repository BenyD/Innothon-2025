import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/error-handler';
import { toast } from '@/components/ui/use-toast';

interface AdminActionsProps {
  id: string;
  type: 'registration' | 'message';
  status: string;
  onStatusChange: () => void;
}

export function AdminActions({ id, type, status, onStatusChange }: AdminActionsProps) {
  const handleAction = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from(type === 'registration' ? 'registrations' : 'contact_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${type} ${newStatus} successfully`,
        variant: 'success',
      });

      onStatusChange();
    } catch (error) {
      handleError(error, `updating ${type}`);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => handleAction('approved')}
        disabled={status === 'approved'}
      >
        Approve
      </Button>
      <Button
        variant="destructive"
        onClick={() => handleAction('rejected')}
        disabled={status === 'rejected'}
      >
        Reject
      </Button>
    </div>
  );
} 