import React, { useEffect, useState, useMemo } from 'react';
import { StudentProfile } from '../types';
import { MOCK_PROFILES } from '../constants';
import '../styles/customScrollbar.css';

const MOCK_FRIENDS: StudentProfile[] = MOCK_PROFILES.filter(p => p.isFriend);

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendsModal: React.FC<FriendsModalProps> = ({ isOpen, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleAnimatedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        button.classList.remove('animate-fade-outline');
        void button.offsetWidth;
        button.classList.add('animate-fade-outline');
        button.addEventListener('animationend', () => {
            button.classList.remove('animate-fade-outline');
        }, { once: true });
    };

    useEffect(() => {
        if (isOpen) {
          const timer = setTimeout(() => setIsAnimating(true), 10);
          const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
          };
          window.addEventListener('keydown', handleEsc);
          return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleEsc);
          };
        } else {
          setIsAnimating(false);
        }
    }, [isOpen, onClose]);
    
    const filteredFriends = useMemo(() => {
        return MOCK_FRIENDS.filter(friend => {
            const query = searchQuery.toLowerCase();
            if (!query) return true;
            return friend.name.toLowerCase().includes(query);
        });
    }, [searchQuery]);

    if (!isOpen) return null;

    return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
            <div
                className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col ${
                isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                style={{ height: 'min(600px, 85vh)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 relative border-b">
                    <button
                        onClick={(e) => {
                            handleAnimatedClick(e);
                            onClose();
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-center text-slate-800">Your Friends</h2>
                    <div className="mt-4 relative w-full">
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <div className="p-6 space-y-3 overflow-y-auto custom-scrollbar flex-grow">
                    {filteredFriends.length > 0 ? filteredFriends.map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100">
                            <div className="flex items-center">
                                <div className="relative">
                                    <img src={friend.avatarUrl} alt={friend.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                    <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-white"></span>
                                </div>
                                <div className="ml-4">
                                    <span className="font-semibold text-slate-700">{friend.name}</span>
                                    <p className="text-xs text-slate-500">Online</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleAnimatedClick} 
                                className="px-3 py-1.5 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors focus:outline-none"
                            >
                                Message
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500">No friends found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendsModal;