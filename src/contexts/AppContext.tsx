import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact: string;
  image: string;
  type: 'lost' | 'found';
  status: 'pending' | 'claimed' | 'completed';
  userId: string;
  userName: string;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  proofImage: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  unread: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  itemsReported: { inProcess: number; completed: number };
  itemsFound: { inProcess: number; completed: number };
}

interface AppContextType {
  isLoggedIn: boolean;
  user: User | null;
  items: Item[];
  claimRequests: ClaimRequest[];
  chats: Chat[];
  messages: Message[];
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  addItem: (item: Omit<Item, 'id' | 'status' | 'userId' | 'userName'>) => void;
  submitClaim: (claim: Omit<ClaimRequest, 'id' | 'status' | 'createdAt'>) => void;
  acceptClaim: (claimId: string) => void;
  rejectClaim: (claimId: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockItems: Item[] = [
  {
    id: '1',
    title: 'Black Leather Wallet',
    description: 'Contains ID cards and some cash. Lost near Central Park.',
    category: 'Wallet',
    location: 'Central Park, NYC',
    date: '2024-01-15',
    contact: 'john@email.com',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    type: 'lost',
    status: 'pending',
    userId: '2',
    userName: 'John Doe'
  },
  {
    id: '2',
    title: 'iPhone 15 Pro',
    description: 'Space black, has a clear case. Found on subway.',
    category: 'Electronics',
    location: 'Subway Station B',
    date: '2024-01-14',
    contact: 'jane@email.com',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
    type: 'found',
    status: 'pending',
    userId: '3',
    userName: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Car Keys - Toyota',
    description: 'Toyota key fob with house keys attached.',
    category: 'Keys',
    location: 'Coffee Shop on 5th Ave',
    date: '2024-01-13',
    contact: 'mike@email.com',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    type: 'lost',
    status: 'pending',
    userId: '4',
    userName: 'Mike Johnson'
  },
  {
    id: '4',
    title: 'Blue Backpack',
    description: 'North Face backpack with laptop inside.',
    category: 'Bags',
    location: 'Library Main Hall',
    date: '2024-01-12',
    contact: 'sarah@email.com',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    type: 'found',
    status: 'pending',
    userId: '5',
    userName: 'Sarah Wilson'
  },
];

const mockChats: Chat[] = [
  {
    id: '1',
    participantId: '2',
    participantName: 'John Doe',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    lastMessage: 'Thanks for finding my wallet!',
    unread: true
  },
  {
    id: '2',
    participantId: '3',
    participantName: 'Jane Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Can we meet at 5pm?',
    unread: false
  }
];

const mockMessages: Message[] = [
  { id: '1', senderId: '2', receiverId: '1', content: 'Hi! I think you found my wallet!', timestamp: '2024-01-15T10:00:00' },
  { id: '2', senderId: '1', receiverId: '2', content: 'Yes! Can you describe it?', timestamp: '2024-01-15T10:05:00' },
  { id: '3', senderId: '2', receiverId: '1', content: 'Its a black leather wallet with my ID inside', timestamp: '2024-01-15T10:10:00' },
  { id: '4', senderId: '1', receiverId: '2', content: 'That matches! Where can we meet?', timestamp: '2024-01-15T10:15:00' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const login = (email: string, password: string) => {
    setUser({
      id: '1',
      name: 'Alex Rivera',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      itemsReported: { inProcess: 2, completed: 3 },
      itemsFound: { inProcess: 1, completed: 2 }
    });
    setIsLoggedIn(true);
  };

  const signup = (name: string, email: string, password: string) => {
    setUser({
      id: '1',
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      itemsReported: { inProcess: 0, completed: 0 },
      itemsFound: { inProcess: 0, completed: 0 }
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const addItem = (item: Omit<Item, 'id' | 'status' | 'userId' | 'userName'>) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      status: 'pending',
      userId: user?.id || '1',
      userName: user?.name || 'Anonymous'
    };
    setItems(prev => [newItem, ...prev]);
  };

  const submitClaim = (claim: Omit<ClaimRequest, 'id' | 'status' | 'createdAt'>) => {
    const newClaim: ClaimRequest = {
      ...claim,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setClaimRequests(prev => [...prev, newClaim]);
  };

  const acceptClaim = (claimId: string) => {
    setClaimRequests(prev => prev.map(c => 
      c.id === claimId ? { ...c, status: 'accepted' as const } : c
    ));
  };

  const rejectClaim = (claimId: string) => {
    setClaimRequests(prev => prev.map(c => 
      c.id === claimId ? { ...c, status: 'rejected' as const } : c
    ));
  };

  const sendMessage = (receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      receiverId,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      user,
      items,
      claimRequests,
      chats,
      messages,
      login,
      signup,
      logout,
      addItem,
      submitClaim,
      acceptClaim,
      rejectClaim,
      sendMessage,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
