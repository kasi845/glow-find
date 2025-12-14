import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';

const Messages = () => {
  const { chats, messages, sendMessage, user } = useApp();
  const [selectedChat, setSelectedChat] = useState<string | null>(chats[0]?.participantId || null);
  const [newMessage, setNewMessage] = useState('');

  const currentChat = chats.find(c => c.participantId === selectedChat);
  const chatMessages = messages.filter(
    m => (m.senderId === selectedChat && m.receiverId === user?.id) ||
         (m.senderId === user?.id && m.receiverId === selectedChat)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    sendMessage(selectedChat, newMessage);
    setNewMessage('');
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col bg-background">
        <FloatingIcons />
        <Navbar />
      
        {/* Main content area - accounts for navbar height */}
        <main className="flex-1 pt-16">
          <div className="h-[calc(100vh-64px)] flex">
            {/* Chat List - Fixed width sidebar */}
            <div className="w-72 md:w-80 border-r border-border overflow-y-auto bg-background/50 backdrop-blur-sm">
              {chats.length > 0 ? (
                chats.map((chat, i) => (
                  <motion.button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.participantId)}
                    className={`w-full p-4 flex items-center gap-3 transition-colors ${
                      selectedChat === chat.participantId
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <img 
                      src={chat.participantAvatar} 
                      alt={chat.participantName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{chat.participantName}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread && (
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageCircle className="text-muted-foreground mb-3" size={32} />
                  <p className="text-muted-foreground text-sm">No chats yet</p>
                </div>
              )}
            </div>

            {/* Chat Area - Flexible width */}
            <div className="flex-1 flex flex-col bg-background/30">
              <AnimatePresence mode="wait">
                {currentChat ? (
                  <motion.div
                    key={selectedChat}
                    className="flex-1 flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border flex items-center gap-3 bg-background/50 backdrop-blur-sm">
                      <img 
                        src={currentChat.participantAvatar} 
                        alt={currentChat.participantName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <h3 className="font-display font-semibold text-foreground">{currentChat.participantName}</h3>
                    </div>

                    {/* Messages - Scrollable area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((msg, i) => {
                        const isOwn = msg.senderId === user?.id;
                        return (
                          <motion.div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              isOwn 
                                ? 'gradient-bg text-primary-foreground rounded-br-md' 
                                : 'bg-muted text-foreground rounded-bl-md'
                            }`}>
                              <p>{msg.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Input - Fixed at bottom */}
                    <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-3 bg-background/50 backdrop-blur-sm">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button type="submit" variant="gradient" size="icon">
                        <Send size={20} />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex-1 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <MessageCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">Select a chat to start messaging</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Messages;
