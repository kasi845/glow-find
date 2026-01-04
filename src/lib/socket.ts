import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class SocketService {
    private socket: Socket | null = null;
    private userEmail: string = '';

    connect(userEmail: string) {
        this.userEmail = userEmail;
        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to socket server');
            this.socket?.emit('user_online', { email: userEmail });
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from socket server');
        });
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    // Join a claim chat room
    joinClaim(claimId: string) {
        this.socket?.emit('join_claim', { claimId });
    }

    // Leave a claim chat room
    leaveClaim(claimId: string) {
        this.socket?.emit('leave_claim', { claimId });
    }

    // Send a message
    sendMessage(data: {
        claimId: string;
        message: string;
        senderEmail: string;
        senderName: string;
        receiverEmail: string;
    }) {
        this.socket?.emit('send_message', data);
    }

    // Typing indicators
    startTyping(claimId: string, name: string) {
        this.socket?.emit('typing_start', {
            claimId,
            email: this.userEmail,
            name
        });
    }

    stopTyping(claimId: string, name: string) {
        this.socket?.emit('typing_stop', {
            claimId,
            email: this.userEmail,
            name
        });
    }

    // Check online status
    checkOnlineStatus(email: string) {
        this.socket?.emit('check_online_status', { email });
    }

    // Event listeners
    onNewMessage(callback: (data: any) => void) {
        this.socket?.on('new_message', callback);
    }

    onUserTyping(callback: (data: any) => void) {
        this.socket?.on('user_typing', callback);
    }

    onUserStatus(callback: (data: any) => void) {
        this.socket?.on('user_status', callback);
    }

    onOnlineStatusResponse(callback: (data: any) => void) {
        this.socket?.on('online_status_response', callback);
    }

    // Remove listeners
    offNewMessage() {
        this.socket?.off('new_message');
    }

    offUserTyping() {
        this.socket?.off('user_typing');
    }

    offUserStatus() {
        this.socket?.off('user_status');
    }
}

export const socketService = new SocketService();
