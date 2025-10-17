import React, { useEffect, useState, useMemo } from 'react';
import { LeaderboardEntry } from '../types';
import '../styles/customScrollbar.css';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, type: 'group', users: [{ name: 'Alex', avatarUrl: 'https://picsum.photos/seed/alex/200' }, { name: 'Dana', avatarUrl: 'https://picsum.photos/seed/dana/200' }], score: 4890, topic: 'Quantum Physics' },
    { rank: 2, type: 'individual', users: [{ name: 'Brenda', avatarUrl: 'https://picsum.photos/seed/brenda/200' }], score: 2310 },
    { rank: 3, type: 'group', users: [{ name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/200' }, { name: 'Fiona', avatarUrl: 'https://picsum.photos/seed/fiona/200' }], score: 4520, topic: 'Data Structures' },
    { rank: 4, type: 'individual', users: [{ name: 'Eli', avatarUrl: 'https://picsum.photos/seed/eli/200' }], score: 1980 },
    { rank: 5, type: 'individual', users: [{ name: 'George', avatarUrl: 'https://picsum.photos/seed/george/200' }], score: 1850 },
    { rank: 6, type: 'group', users: [{ name: 'Brenda', avatarUrl: 'https://picsum.photos/seed/brenda/200' }, { name: 'George', avatarUrl: 'https://picsum.photos/seed/george/200' }], score: 3200, topic: 'World History' },
];

type FilterType = 'all' | 'groups' | 'individuals';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    
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
    
    const filteredLeaderboard = useMemo(() => {
        return MOCK_LEADERBOARD
            .filter(entry => {
                if (filter === 'all') return true;
                return filter === 'groups' ? entry.type === 'group' : entry.type === 'individual';
            })
            .filter(entry => {
                const query = searchQuery.toLowerCase();
                if (!query) return true;
                const hasMatchingUser = entry.users.some(user => user.name.toLowerCase().includes(query));
                const hasMatchingTopic = entry.topic?.toLowerCase().includes(query);
                return hasMatchingUser || hasMatchingTopic;
            });
    }, [filter, searchQuery]);


    if (!isOpen) return null;
    
    const filterPillClasses = (isActive: boolean) => `
        px-3 py-1 text-sm font-semibold rounded-full transition-colors cursor-pointer
        ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}
    `;

    return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
            <div
                className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col ${
                isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                style={{ height: 'min(650px, 90vh)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 relative border-b">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-center text-slate-800">🏆 Top Study Champions</h2>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-auto flex-grow">
                            <input
                                type="text"
                                placeholder="Search names, topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={filterPillClasses(filter === 'all')} onClick={() => setFilter('all')}>All</div>
                            <div className={filterPillClasses(filter === 'groups')} onClick={() => setFilter('groups')}>Groups</div>
                            <div className={filterPillClasses(filter === 'individuals')} onClick={() => setFilter('individuals')}>Individuals</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3 overflow-y-auto custom-scrollbar flex-grow">
                    {filteredLeaderboard.map((entry, index) => (
                        <div key={entry.rank} className={`flex items-center p-3 rounded-lg transition-colors ${index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-slate-50'}`}>
                            <span className={`font-bold text-lg w-10 text-center ${index < 3 ? 'text-yellow-600' : 'text-slate-500'}`}>{entry.rank}</span>
                            
                            <div className="flex -space-x-4 mx-4">
                                {entry.users.map(user => (
                                    <img key={user.name} src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                ))}
                            </div>
                            
                            <div className="flex-grow">
                                <span className="font-semibold text-slate-700">
                                    {entry.users.map(u => u.name).join(' & ')}
                                </span>
                                {entry.topic && <p className="text-xs text-slate-500">{entry.topic}</p>}
                            </div>
                            
                            <span className="font-bold text-blue-600">{entry.score.toLocaleString()} pts</span>
                        </div>
                    ))}
                    {filteredLeaderboard.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-slate-500">No results found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardModal;