'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Trash, Archive } from 'lucide-react';

interface EmailActionsProps {
  selectedEmails: Set<string>;
  onRefresh: () => void;
  currentFolder: string;
}

export default function EmailActions({ selectedEmails, onRefresh, currentFolder }: EmailActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleSpamRecovery = async () => {
    if (currentFolder !== 'spam' || selectedEmails.size === 0) return;

    try {
      setLoading(true);
      const response = await fetch('/api/emails/spam', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: Array.from(selectedEmails) })
      });

      const data = await response.json();
      if (data.success) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error recovering from spam:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 p-2 border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>

      {currentFolder === 'spam' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpamRecovery}
          disabled={loading || selectedEmails.size === 0}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Archive className="h-4 w-4 mr-2" />
          )}
          Recover from Spam
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={selectedEmails.size === 0 || loading}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}