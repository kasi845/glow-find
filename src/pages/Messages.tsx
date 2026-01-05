import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { TypingIndicator } from '@/components/TypingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { apiGetMessagesForClaim, apiSendMessage } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  content: string;
  createdAt: string;
  claimId: string;
}

const Messages = () => {
  const { conversations, user, token, loadConversations } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.claimId === selectedConversation);

  // Load conversations on mount
  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].claimId);
    }
  }, [conversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation || !token) return;

      setLoadingMessages(true);
      try {
        const msgs = await apiGetMessagesForClaim(selectedConversation, token);
        setMessages(msgs);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive'
        });
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversation, token]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !token || !currentConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Send message to backend
      await apiSendMessage({
        receiverEmail: currentConversation.otherUserEmail,
        content: messageContent,
        claimId: selectedConversation
      }, token);

      // Reload messages
      const msgs = await apiGetMessagesForClaim(selectedConversation, token);
      setMessages(msgs);

      // Reload conversations to update last message
      loadConversations();

      // Simulate typing indicator
      setShowTyping(true);
      setTimeout(() => setShowTyping(false), 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
      // Restore message on error
      setNewMessage(messageContent);
    }
  };

  const handleSelectConversation = (claimId: string) => {
    setSelectedConversation(claimId);
    setShowMobileChat(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col bg-background">
        <FloatingIcons />
        <Navbar />

        <main className="flex-1 pt-20">
          <div className="h-[calc(100vh-80px)] flex">
            {/* Conversation List - Hidden on mobile when chat is open */}
            <div className={`${showMobileChat ? 'hidden md:block' : 'block'} w-full md:w-72 lg:w-80 border-r border-border overflow-y-auto bg-background/50 backdrop-blur-sm`}>
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <button
                    key={conversation.claimId}
                    onClick={() => handleSelectConversation(conversation.claimId)}
                    className={`w-full p-4 flex items-center gap-3 transition-all duration-300 hover:bg-muted/50 ${selectedConversation === conversation.claimId
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : ''
                      }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-border">
                        <span className="text-lg font-bold text-primary">
                          {conversation.otherUserName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{conversation.otherUserName}</h3>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {conversation.itemTitle}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div
                        className="w-3 h-3 rounded-full gradient-bg flex-shrink-0 animate-pulse"
                      />
                    )}
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full p-6">
                  <EmptyState
                    type="messages"
                    title="No conversations yet"
                    description="Accept a claim to start chatting"
                  />
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className={`${showMobileChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col bg-background/30`}>
              {currentConversation ? (
                <div
                  key={selectedConversation}
                  className="flex-1 flex flex-col h-full"
                >
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3 bg-background/50 backdrop-blur-sm">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-2 hover:bg-muted/50 rounded-lg"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-primary/30">
                      <span className="text-sm font-bold text-primary">
                        {currentConversation.otherUserName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{currentConversation.otherUserName}</h3>
                      <p className="text-xs text-muted-foreground">{currentConversation.itemTitle}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => {
                        const isOwn = msg.senderEmail === user?.email;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            onMouseEnter={() => setHoveredMessage(msg.id)}
                            onMouseLeave={() => setHoveredMessage(null)}
                          >
                            <div className="relative">
                              <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${isOwn
                                ? 'gradient-bg text-primary-foreground rounded-br-md'
                                : 'bg-muted text-foreground rounded-bl-md'
                                }`}>
                                <p>{msg.content}</p>
                              </div>
                              {/* Timestamp on hover */}
                              {hoveredMessage === msg.id && (
                                <p
                                  className={`absolute -bottom-5 text-xs text-muted-foreground ${isOwn ? 'right-0' : 'left-0'}`}
                                >
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <EmptyState
                          type="messages"
                          title="No messages yet"
                          description="Start the conversation!"
                        />
                      </div>
                    )}

                    {/* Typing Indicator */}
                    {showTyping && (
                      <div>
                        <TypingIndicator />
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-3 bg-background/50 backdrop-blur-sm">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <div className="hover:scale-105 transition-transform active:scale-95">
                      <Button type="submit" variant="gradient" size="icon" disabled={!newMessage.trim()}>
                        <Send size={20} />
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div
                  className="flex-1 flex items-center justify-center p-6"
                >
                  <EmptyState
                    type="messages"
                    title="Select a conversation"
                    description="Choose a conversation to start messaging"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Messages;
