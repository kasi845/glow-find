import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiChat } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm Lumi. Need help reporting a lost or found item?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Optimistic update
        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const res = await apiChat(currentInput, messages);
            const botMsg: Message = { role: 'assistant', content: res.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border/50 bg-primary/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-primary" size={18} />
                            <h3 className="font-semibold text-foreground">Lumi AI Assistant</h3>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-muted text-muted-foreground rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-2xl rounded-bl-none flex gap-1 items-center h-10">
                                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border/50 bg-background/50">
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Lumi for help..."
                                className="bg-background/80"
                            />
                            <Button type="submit" size="icon" disabled={isLoading} variant="gradient">
                                <Send size={18} />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <button
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-primary/25 z-50 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-90"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                <Bot size={28} />
            </button>
        </>
    );
};
