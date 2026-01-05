import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Item, useApp } from '@/contexts/AppContext';

import { apiReportItem } from '@/lib/api';

interface ReportItemModalProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportItemModal: React.FC<ReportItemModalProps> = ({ item, isOpen, onClose }) => {
    const { toast } = useToast();
    const { token } = useApp();
    const [reason, setReason] = useState<string>('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !token) return;

        setIsSubmitting(true);
        try {
            await apiReportItem({
                itemId: item.id,
                reason: reason || 'Other',
                description,
            }, token);

            toast({
                title: "Report Submitted",
                description: "The admin has been notified.",
            });

            setReason('');
            setDescription('');
            onClose();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Failed to submit report",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative glass-card w-full max-w-md p-6 border border-red-500/20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-red-500/10">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-bold text-red-500">Report Item</h2>
                        <p className="text-sm text-muted-foreground">Flag this item as fake or suspicious</p>
                    </div>
                </div>

                {item && (
                    <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Reported by: {item.userName}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Reason</label>
                        <Select onValueChange={setReason} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fake Item">Fake Item / Spam</SelectItem>
                                <SelectItem value="Scam">Scam / Fraud</SelectItem>
                                <SelectItem value="Wrong Category">Wrong Category</SelectItem>
                                <SelectItem value="Inappropriate">Inappropriate Content</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide more details..."
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Report Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
