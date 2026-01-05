import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiAcceptClaim, apiCreateClaim, apiCreateItem, apiGetClaims, apiGetItems, apiLogin, apiMe, apiRejectClaim, apiSignup, apiUploadImage, apiGetNotifications, apiMarkNotificationRead, apiMarkClaimDone, apiGetConversations } from '@/lib/api';
import { socketService } from '@/lib/socket';

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
  status: 'pending' | 'claimed' | 'completed' | 'accepted';
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
  status: 'pending' | 'accepted' | 'rejected' | 'done';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'claim_received' | 'claim_accepted' | 'claim_declined' | 'claim_done';
  claimId: string;
  itemId: string;
  itemTitle: string;
  senderName: string;
  senderEmail: string;
  message: string;
  read: boolean;
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

export interface Conversation {
  claimId: string;
  itemTitle: string;
  otherUserEmail: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  itemsReported: { inProcess: number; completed: number };
  itemsFound: { inProcess: number; completed: number };
  isAdmin?: boolean;
}

interface AppContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  items: Item[];
  claimRequests: ClaimRequest[];
  notifications: Notification[];
  conversations: Conversation[];
  chats: Chat[];
  messages: Message[];
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  reportItem: (item: {
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    contact: string;
    image: string;
    type: 'lost' | 'found';
  }) => Promise<void>;
  submitClaim: (claim: Omit<ClaimRequest, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  acceptClaim: (claimId: string) => Promise<void>;
  rejectClaim: (claimId: string) => Promise<void>;
  markClaimDone: (claimId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => void;
  updateUser: (updates: Partial<User>) => void;
  searchItems: (status?: 'lost' | 'found', searchQuery?: string) => Promise<void>;
  loadItems: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// No mock data - all data comes from backend

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const toUser = (data: { name: string; email: string; avatar?: string; createdAt?: string; isAdmin?: boolean }): User => ({
    name: data.name,
    email: data.email,
    itemsReported: { inProcess: 0, completed: 0 },
    itemsFound: { inProcess: 0, completed: 0 },
    avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    isAdmin: data.isAdmin
  });

  const login = async (email: string, password: string) => {
    const tokenRes = await apiLogin({ email, password });
    const accessToken = tokenRes.access_token;
    setToken(accessToken);
    localStorage.setItem('auth_token', accessToken);

    const me = await apiMe(accessToken);
    const userObj = toUser(me);
    setUser(userObj);
    setIsLoggedIn(true);

    // Connect socket
    socketService.connect(me.email);

    return userObj;
  };

  const signup = async (name: string, email: string, password: string) => {
    await apiSignup({ name, email, password });
    await login(email, password); // obtain token after signup
  };

  // Auto-login if token exists
  React.useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const me = await apiMe(token);
        setUser(toUser(me));
        setIsLoggedIn(true);
      } catch (err) {
        setToken(null);
        localStorage.removeItem('auth_token');
      }
    };
    load();
  }, [token]);

  // Load items from backend on first mount
  const loadItems = React.useCallback(async () => {
    try {
      const data = await apiGetItems(undefined, undefined, true);
      const mapped: Item[] = data.map((it: any) => ({
        id: it.id,
        title: it.itemtitle,
        description: it.description,
        category: it.category,
        location: it.location,
        date: it.date,
        contact: it.contact,
        image: it.imageurl,
        // Use type if available, otherwise fallback to status
        type: (it.type || it.status) as 'lost' | 'found',
        status: it.status === 'completed' ? 'completed' : (it.status === 'accepted' || it.status === 'in_process' ? 'accepted' : 'pending'),
        userId: 'db',
        userName: it.reportedby,
      }));
      setItems(mapped); // Replace items instead of appending
    } catch {
      // ignore load errors for now
    }
  }, []);

  // Search items by status and query
  const searchItems = React.useCallback(async (status?: 'lost' | 'found', searchQuery?: string) => {
    try {
      const data = await apiGetItems(status, searchQuery, true);
      const mapped: Item[] = data.map((it: any) => ({
        id: it.id,
        title: it.itemtitle,
        description: it.description,
        category: it.category,
        location: it.location,
        date: it.date,
        contact: it.contact,
        image: it.imageurl,
        // Use type if available, otherwise fallback to status (and handle legacy logic)
        type: (it.type || it.status) as 'lost' | 'found',
        status: it.status === 'completed' ? 'completed' : (it.status === 'accepted' || it.status === 'in_process' ? 'accepted' : 'pending'),
        userId: 'db',
        userName: it.reportedby,
      }));
      setItems(mapped);
    } catch (e) {
      console.error("Search failed:", e);
    }
  }, []);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Load conversations
  const loadConversations = React.useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiGetConversations(token);
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }, [token]);

  // Load claims
  const loadClaims = React.useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiGetClaims(token);
      setClaimRequests(data);
    } catch (err) {
      console.error('Failed to load claims:', err);
    }
  }, [token]);

  // Load notifications
  const loadNotifications = React.useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiGetNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [token]);

  // Mark notification as read
  const markNotificationRead = React.useCallback(async (notificationId: string) => {
    if (!token) return;
    try {
      await apiMarkNotificationRead(notificationId, token);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [token]);

  // Connect socket when user logs in
  React.useEffect(() => {
    if (isLoggedIn && user) {
      socketService.connect(user.email);
      loadNotifications();
      loadConversations();
      loadClaims();
    } else {
      socketService.disconnect();
    }
  }, [isLoggedIn, user, loadNotifications, loadConversations, loadClaims]);

  // Mark claim as done
  const markClaimDone = React.useCallback(async (claimId: string) => {
    if (!token) return;
    try {
      await apiMarkClaimDone(claimId, token);
      await loadItems();
      await loadNotifications();
    } catch (err) {
      console.error('Failed to mark claim as done:', err);
      throw err;
    }
  }, [token, loadItems, loadNotifications]);

  const logout = () => {
    socketService.disconnect();
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const reportItem = async (item: {
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    contact: string;
    image: string;
    type: 'lost' | 'found';
  }) => {
    if (!token) {
      throw new Error('Please log in to report an item.');
    }

    const payload = {
      itemtitle: item.title,
      location: item.location,
      date: item.date,
      contact: item.contact,
      category: item.category,
      description: item.description,
      imageurl: item.image,
    };

    const created = await apiCreateItem(payload, item.type, token);

    const newItem: Item = {
      id: created.id,
      title: created.itemtitle,
      description: created.description,
      category: created.category,
      location: created.location,
      date: created.date,
      contact: created.contact,
      image: created.imageurl,
      type: created.status,
      status: 'pending',
      userId: user?.id || '1',
      userName: user?.name || 'Anonymous'
    };

    setItems(prev => [newItem, ...prev]);
  };

  const submitClaim = async (claim: Omit<ClaimRequest, 'id' | 'status' | 'createdAt'>) => {
    if (!token) {
      throw new Error('Please login to submit a claim');
    }

    try {
      // Handle proofImage - if it's a data URL, we need to convert it to a File and upload
      let proofImageUrl = claim.proofImage;
      if (claim.proofImage && claim.proofImage.startsWith('data:image')) {
        try {
          // Manual conversion of Data URL to File
          const arr = claim.proofImage.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'proof.jpg', { type: mime });

          const result = await apiUploadImage(file);
          proofImageUrl = result.url;
        } catch (err: any) {
          console.error('Failed to upload proof image:', err);
          const errorMsg = err?.message || 'Failed to upload image';
          throw new Error(`Image upload failed: ${errorMsg}`);
        }
      }

      const result = await apiCreateClaim(
        {
          itemId: claim.itemId,
          itemTitle: claim.itemTitle,
          claimerName: claim.claimerName,
          claimerEmail: claim.claimerEmail,
          claimerPhone: claim.claimerPhone || '',
          proofImage: proofImageUrl,
          description: (claim as any).description || '',
        },
        token
      );

      const newClaim: ClaimRequest = {
        id: result.id,
        itemId: result.itemId,
        itemTitle: result.itemTitle,
        claimerName: result.claimerName,
        claimerEmail: result.claimerEmail,
        claimerPhone: result.claimerPhone || '',
        proofImage: result.proofImage,
        status: result.status as 'pending' | 'accepted' | 'rejected',
        createdAt: typeof result.createdAt === 'string' ? result.createdAt : new Date(result.createdAt).toISOString(),
      };
      setClaimRequests(prev => [newClaim, ...prev]);
    } catch (err: any) {
      // Extract error message properly
      let errorMessage = 'Failed to submit claim';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.detail) {
        errorMessage = err.detail;
      }
      throw new Error(errorMessage);
    }
  };

  const acceptClaim = async (claimId: string) => {
    if (!token) {
      throw new Error('Please login to accept a claim');
    }

    await apiAcceptClaim(claimId, token);
    setClaimRequests(prev => prev.map(c =>
      c.id === claimId ? { ...c, status: 'accepted' as const } : c
    ));
  };

  const rejectClaim = async (claimId: string) => {
    if (!token) {
      throw new Error('Please login to reject a claim');
    }

    await apiRejectClaim(claimId, token);
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
      token,
      user,
      items,
      claimRequests,
      notifications,
      conversations,
      chats,
      messages,
      login,
      signup,
      logout,
      reportItem,
      submitClaim,
      acceptClaim,
      rejectClaim,
      markClaimDone,
      sendMessage,
      updateUser,
      searchItems,
      loadItems,
      loadNotifications,
      markNotificationRead,
      loadConversations
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
