import { Bell } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

export const NotificationBell = () => {
    const { notifications, markNotificationRead } = useApp();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = async (notification: any) => {
        await markNotificationRead(notification.id);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Bell size={24} className="text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Notification Dropdown */}
                    <div
                        className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 max-h-[32rem] overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-5 duration-200"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        <div className="overflow-y-auto max-h-96">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${notification.read
                                            ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                                    {notification.itemTitle}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium">{notification.senderName}</span>
                                                    <span>•</span>
                                                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
