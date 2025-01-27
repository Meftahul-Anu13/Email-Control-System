'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import EmailList from './EmailList';
import EmailCompose from './EmailCompose';
import type { Email, EmailResponse } from '../types/email';
import { Forward, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmailDashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentFolder, setCurrentFolder] = useState('INBOX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [replyTo, setReplyTo] = useState<Email | null>(null);

  const decodeEmailSubject = (subject: string) => {
    if (!subject) return '';
    
    // Handle multi-part UTF-8 encoded subjects
    if (subject.includes('=?utf-8?')) {
      try {
        // Split into parts and decode each part
        const parts = subject.split(/\r\n\s?/);
        return parts.map(part => {
          if (!part.includes('=?utf-8?')) return part;
          
          const encoding = part.includes('?B?') ? 'base64' : 'quoted-printable';
          const matches = part.match(/=\?utf-8\?[BQ]\?(.*?)\?=/i);
          
          if (!matches || !matches[1]) return part;
          
          if (encoding === 'base64') {
            return decodeURIComponent(escape(atob(matches[1])));
          } else {
            // Handle quoted-printable encoding
            return decodeURIComponent(
              matches[1].replace(/=([0-9A-F]{2})/gi, (_, p1) => 
                String.fromCharCode(parseInt(p1, 16))
              )
            );
          }
        }).join('');
      } catch (error) {
        console.error('Error decoding subject:', error);
        return subject;
      }
    }
    return subject;
  };

  const transformEmailData = (emailData: EmailResponse[]): Email[] => {
    if (!Array.isArray(emailData)) return [];
    
    return emailData.map(email => ({
      id: email.id,
      subject: decodeEmailSubject(email.subject),
      sender: email.from.replace(/"/g, ''), // Remove quotes from sender name
      timestamp: email.date * 1000, // Convert to milliseconds
      folder: currentFolder,
      read: false,
      content: '' // Will be populated when email is selected
    }));
  };

  const fetchEmails = async (folder: string) => {
    try {
      setLoading(true);
      setError(null);
      // http://localhost:3000/api/emails/read?folder=inbox&limit=10
      const response = await fetch(`http://localhost:3000/api/emails/read?folder=${folder}&limit=10`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.emails)) {
        const transformedEmails = transformEmailData(data.emails);
        setEmails(transformedEmails);
      } else {
        throw new Error(data.message || 'Failed to fetch emails');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to load emails. Please try again later.');
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };
  const handleReply = async () => {
    if (selectedEmail) {
      setReplyTo(selectedEmail);
      setActiveTab('compose');
    }
  };

  const handleForward = () => {
    if (selectedEmail) {
      setReplyTo({
        ...selectedEmail,
        subject: `Fwd: ${selectedEmail.subject}`,
        sender: '', // Clear sender for forwarding
      });
      setActiveTab('compose');
    }
  };

  useEffect(() => {
    fetchEmails(currentFolder);
  }, [currentFolder]);

  const handleFolderChange = (folder: string) => {
    const folderMap: Record<string, string> = {
      'inbox': 'INBOX',
      'spam': 'SPAM',
      'sent': 'SENT'
    };
    setCurrentFolder(folderMap[folder] || 'INBOX');
    setSelectedEmail(null);
    setActiveTab(folder);
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox" onClick={() => handleFolderChange('inbox')}>
            Inbox
          </TabsTrigger>
          <TabsTrigger value="spam" onClick={() => handleFolderChange('spam')}>
            Spam
          </TabsTrigger>
          <TabsTrigger value="sent" onClick={() => handleFolderChange('sent')}>
            Sent
          </TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && (
            <div className="col-span-2 bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          )}
          
          <div className="col-span-2 md:col-span-1">
            {loading ? (
              <Card className="p-4">Loading emails...</Card>
            ) : (
              <>
                <TabsContent value="inbox" className="m-0">
                  <EmailList 
                    emails={emails} 
                    onEmailSelect={setSelectedEmail}
                    currentFolder={currentFolder}
                    onRefresh={() => fetchEmails(currentFolder)}
                  />
                </TabsContent>
                
                <TabsContent value="spam" className="m-0">
                  <EmailList 
                    emails={emails} 
                    onEmailSelect={setSelectedEmail}
                    currentFolder={currentFolder}
                    onRefresh={() => fetchEmails(currentFolder)}
                  />
                </TabsContent>
                
                <TabsContent value="sent" className="m-0">
                  <EmailList 
                    emails={emails} 
                    onEmailSelect={setSelectedEmail}
                    currentFolder={currentFolder}
                    onRefresh={() => fetchEmails(currentFolder)}
                  />
                </TabsContent>
                
                <TabsContent value="compose" className="m-0">
                  <EmailCompose onEmailSent={() => fetchEmails('SENT')} />
                </TabsContent>
              </>
            )}
          </div>

          <div className="col-span-2 md:col-span-1">
            {selectedEmail && (
              <Card className="p-4 space-y-4">
                <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>From: {selectedEmail.sender}</span>
                  <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                  <span>Folder: {selectedEmail.folder}</span>
                  {/* <span>Status: {selectedEmail.read ? 'Read' : 'Unread'}</span>
                  <span> Compose</span> */}
                  {/* here write some code to reply to the same sender  */}
                  
                </div>
                <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReply}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleForward}
                    >
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </div>
                <div className="whitespace-pre-wrap">{selectedEmail.content}</div>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}