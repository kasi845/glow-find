import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Menu, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { TypingIndicator } from '@/components/TypingIndicator';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';

const Messages = () => {
  const { chats, messages, sendMessage, user } = useApp();
  const [selectedChat, setSelectedChat] = useState<string | null>(chats[0]?.participantId || null);
  const [newMessage, setNewMessage] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.participantId === selectedChat);
  const chatMessages = messages.filter(
    m => (m.senderId === selectedChat && m.receiverId === user?.id) ||
         (m.senderId === user?.id && m.receiverId === selectedChat)
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, showTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    
    sendMessage(selectedChat, newMessage);
    setNewMessage('');
    
    // Simulate typing indicator
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2000);
  };

  const handleSelectChat = (participantId: string) => {
    setSelectedChat(participantId);
    setShowMobileChat(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col bg-background">
        <FloatingIcons />
        <Navbar />
      
        <main className="flex-1 pt-16">
          <div className="h-[calc(100vh-64px)] flex">
            {/* Chat List - Hidden on mobile when chat is open */}
            <div className={`${showMobileChat ? 'hidden md:block' : 'block'} w-full md:w-72 lg:w-80 border-r border-border overflow-y-auto bg-background/50 backdrop-blur-sm`}>
              {chats.length > 0 ? (
                chats.map((chat, i) => (
                  <motion.button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.participantId)}
                    className={`w-full p-4 flex items-center gap-3 transition-all duration-300 ${
                      selectedChat === chat.participantId
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="relative">
                      <img 
                        src={chat.participantAvatar} 
                        alt={chat.participantName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{chat.participantName}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread && (
                      <motion.div 
                        className="w-3 h-3 rounded-full gradient-bg flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full p-6">
                  <EmptyState
                    type="messages"
                    title="No chats yet"
                    description="Accept a claim to start chatting"
                  />
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className={`${showMobileChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col bg-background/30`}>
              <AnimatePresence mode="wait">
                {currentChat ? (
                  <motion.div
                    key={selectedChat}
                    className="flex-1 flex flex-col h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border flex items-center gap-3 bg-background/50 backdrop-blur-sm">
                      <button 
                        onClick={() => setShowMobileChat(false)}
                        className="md:hidden p-2 hover:bg-muted/50 rounded-lg"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <img 
                        src={currentChat.participantAvatar} 
                        alt={currentChat.participantName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
                      />
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{currentChat.participantName}</h3>
                        <p className="text-xs text-green-500">Online</p>
                      </div>
                    </div>

                    {/* Messages */}
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
                            onMouseEnter={() => setHoveredMessage(msg.id)}
                            onMouseLeave={() => setHoveredMessage(null)}
                          >
                            <div className="relative">
                              <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                                isOwn 
                                  ? 'gradient-bg text-primary-foreground rounded-br-md' 
                                  : 'bg-muted text-foreground rounded-bl-md'
                              }`}>
                                <p>{msg.content}</p>
                              </div>
                              {/* Timestamp on hover */}
                              <AnimatePresence>
                                {hoveredMessage === msg.id && (
                                  <motion.p
                                    className={`absolute -bottom-5 text-xs text-muted-foreground ${isOwn ? 'right-0' : 'left-0'}`}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                  >
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        );
                      })}
                      
                      {/* Typing Indicator */}
                      <AnimatePresence>
                        {showTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            <TypingIndicator />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
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
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button type="submit" variant="gradient" size="icon">
                          <Send size={20} />
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex-1 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <EmptyState
                      type="messages"
                      title="Select a chat"
                      description="Choose a conversation to start messaging"
                    />
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
