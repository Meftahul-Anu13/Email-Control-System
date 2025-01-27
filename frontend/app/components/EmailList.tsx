'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import EmailActions from './EmailActions';
import type { Email } from '../types/email';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  currentFolder: string;
  onRefresh: () => void;
}

export default function EmailList({ 
  emails, 
  onEmailSelect, 
  currentFolder,
  onRefresh 
}: EmailListProps) {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const toggleEmailSelection = (emailId: string) => {
    const newSelection = new Set(selectedEmails);
    if (newSelection.has(emailId)) {
      newSelection.delete(emailId);
    } else {
      newSelection.add(emailId);
    }
    setSelectedEmails(newSelection);
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <EmailActions 
        selectedEmails={selectedEmails}
        onRefresh={onRefresh}
        currentFolder={currentFolder}
      />
      <ScrollArea className="h-[calc(100%-4rem)]">
        {emails && emails.length > 0 ? (
          emails.map((email) => (
            <div
              key={email.id}
              className="p-4 border-b hover:bg-accent cursor-pointer flex items-center gap-4"
              onClick={() => onEmailSelect(email)}
            >
              <Checkbox
                checked={selectedEmails.has(email.id)}
                onCheckedChange={() => toggleEmailSelection(email.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">{email.sender}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(email.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm font-medium">{email.subject}</div>
                {email.content && (
                  <div className="text-sm text-muted-foreground truncate">
                    {email.content}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Mail className="h-8 w-8 mb-2" />
            <p>No emails found</p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}