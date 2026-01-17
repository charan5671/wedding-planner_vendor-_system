import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { io } from 'socket.io-client';
import { Button } from '../components/Button';

// Initialize socket outside component to avoid multiple connections
const socket = io('http://localhost:3002');

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    type: 'text' | 'offer' | 'acceptance' | 'rejection';
    metadata?: { newPrice?: number };
}

interface ContextItem {
    id: string;
    status: string;
    price?: number;
    vendorName?: string;
    userName?: string;
    vendorId: string;
    userId: string;
    date?: string;
    isEnquiry?: boolean;
}

export function NegotiationRoom() {
    const { id } = useParams(); // Booking or Enquiry ID
    const { user, profile } = useAuth();
    // const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [contextItem, setContextItem] = useState<ContextItem | null>(null);
    const [offerAmount, setOfferAmount] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isVendor = profile?.role === 'vendor';
    const otherPartyId = isVendor ? contextItem?.userId : contextItem?.vendorId;

    useEffect(() => {
        if (!user || !id) return;

        const fetchData = async () => {
            try {
                // Use unified negotiation endpoint
                const data = await apiFetch(`/negotiation/${id}`);
                setContextItem(data.contextItem);
                setMessages(data.messages.map((m: any) => ({
                    id: m.id,
                    senderId: m.sender_id,
                    senderName: m.sender_id === user.uid ? (user.displayName || 'Me') : (data.contextItem.userName || data.contextItem.vendorName || 'Partner'),
                    text: m.content,
                    timestamp: m.created_at,
                    type: m.type,
                    metadata: m.metadata
                })));
            } catch (err) {
                console.error("Failed to load negotiation context", err);
            }
        };

        fetchData();

        // Socket listeners
        socket.emit('join-room', id); // Join room by context ID

        socket.on('receive-message', (newMsg: Message) => {
            setMessages(prev => [...prev, newMsg]);
            scrollToBottom();
        });

        socket.on('status-change', (status: string) => {
            setContextItem(prev => prev ? { ...prev, status } : null);
        });

        return () => {
            socket.off('receive-message');
            socket.off('status-change');
        };
    }, [user, id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = (type: 'text' | 'offer' | 'acceptance' | 'rejection' = 'text', metadata?: any) => {
        if (!user || !contextItem || (!inputText.trim() && type === 'text')) return;

        const msgPayload = {
            senderId: user.uid,
            senderName: user.displayName || profile?.name || 'User',
            receiverId: otherPartyId,
            content: type === 'text' ? inputText : generateSystemText(type, metadata),
            timestamp: new Date().toISOString(),
            bookingId: contextItem.isEnquiry ? null : id,
            enquiryId: contextItem.isEnquiry ? id : null,
            type,
            metadata
        };

        // Emit to room (id is our context id)
        socket.emit('send-message', { ...msgPayload, bookingId: id }); // bookingId here is room identifier in existing socket logic

        setInputText('');
        if (type === 'offer') setOfferAmount('');
    };

    const generateSystemText = (type: string, metadata?: any) => {
        switch (type) {
            case 'offer': return `Offer Proposed: $${metadata.newPrice}`;
            case 'acceptance': return `Offer Accepted! Deal Confirmed.`;
            case 'rejection': return `Offer Rejected.`;
            default: return '';
        }
    };

    const handleOffer = () => {
        if (!offerAmount) return;
        sendMessage('offer', { newPrice: Number(offerAmount) });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex justify-between items-center z-10">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        {isVendor ? `Negotiating with ${contextItem?.userName}` : `Negotiating with ${contextItem?.vendorName}`}
                    </h2>
                    <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full capitalize ${contextItem?.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            contextItem?.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {contextItem?.status}
                        </span>
                        {contextItem?.price && <span className="font-semibold text-slate-600">Current Price: ${contextItem.price}</span>}
                    </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                    {contextItem?.status !== 'confirmed' && (
                        <>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-500 text-sm">$</span>
                                <input
                                    type="number"
                                    className="w-24 px-2 py-1 border rounded text-sm"
                                    placeholder="Price"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                />
                                <Button size="sm" onClick={handleOffer}>Send Offer</Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === user?.uid;
                    const isSystem = msg.type !== 'text';

                    if (isSystem) {
                        return (
                            <div key={idx} className="flex justify-center my-4">
                                <div className="bg-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-medium flex flex-col items-center gap-2">
                                    <span>{msg.text}</span>
                                    {msg.type === 'offer' && msg.senderId !== user?.uid && contextItem?.status !== 'confirmed' && (
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() => sendMessage('acceptance')}
                                                className="bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => sendMessage('rejection')}
                                                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-slate-800 shadow-sm rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage('text'); }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        className="flex-1 input bg-slate-50"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <Button type="submit" disabled={!inputText.trim()}>
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}
