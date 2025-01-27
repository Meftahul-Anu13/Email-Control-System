'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface EmailComposeProps {
  onEmailSent?: () => void;
}

export default function EmailCompose({ onEmailSent }: EmailComposeProps) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!recipient || !subject || !content) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, subject, content }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send email');
      }
      
      setRecipient('');
      setSubject('');
      setContent('');
      onEmailSent?.();
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Input
        placeholder="To"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        disabled={loading}
      />
      <Input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={loading}
      />
      <Textarea
        placeholder="Write your message..."
        className="min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <Button 
        onClick={handleSend} 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Send Email
      </Button>
    </Card>
  );
}