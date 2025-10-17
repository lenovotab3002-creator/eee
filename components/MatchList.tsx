import React, { useState, useMemo } from 'react';
import { Match } from '../types';
import MatchCard from './MatchCard';

interface MatchListProps {
  matches: Match[];
  onStartStudying: (match: Match) => void;
  onFindNew: () => void;
}

type FilterType = 'all' | 'friends' | 'two' | 'three' | 'others';

const handleAnimatedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.classList.remove('animate-fade-outline');
    void button.offsetWidth;
    button.classList.add('animate-fade-outline');
    button.addEventListener('animationend', () => {
        button.classList.remove('animate-fade-outline');
    }, { once: true });
};

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => {
    const baseClasses = "w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none";
    const activeClasses = "bg-blue-700 text-white shadow";
    const inactiveClasses = "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800";
    return (
        <button 
            onClick={(e) => {
                handleAnimatedClick(e);
                onClick();
            }} 
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {label}
        </button>
    );
};


const MatchList: React.FC<MatchListProps> = ({ matches, onStartStudying, onFindNew }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredMatches = useMemo(() => {
    switch(activeFilter) {
        case 'friends':
            return matches.filter(m => !('members' in m) && m.isFriend);
        case 'two':
            return matches.filter(m => !('members' in m)); // User + 1 other
        case 'three':
            // User + 2 others in a group
            return matches.filter(m => 'members' in m && m.members.length === 2);
        case 'others':
            // User + 3 or more others in a group
            return matches.filter(m => 'members' in m && m.members.length >= 3);
        case 'all':
        default:
            return matches;
    }
  }, [matches, activeFilter]);


  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800">We Found Your Study Crew!</h2>
        <p className="text-slate-500 mt-2 text-lg">Here are your top matches based on your profile.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="md:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-md border sticky top-8">
                <h3 className="font-bold text-slate-800 mb-4 px-2">Filter By</h3>
                <div className="space-y-2">
                    <FilterButton label="All" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                    <FilterButton label="Friends" isActive={activeFilter === 'friends'} onClick={() => setActiveFilter('friends')} />
                    <FilterButton label="Two People Group" isActive={activeFilter === 'two'} onClick={() => setActiveFilter('two')} />
                    <FilterButton label="Three People Group" isActive={activeFilter === 'three'} onClick={() => setActiveFilter('three')} />
                    <FilterButton label="Others" isActive={activeFilter === 'others'} onClick={() => setActiveFilter('others')} />
                </div>
            </div>
        </aside>
        
        {/* Match Results */}
        <main className="md:col-span-3">
             {filteredMatches.length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredMatches.map((match) => (
                        <MatchCard key={match.id} match={match} onStartStudying={onStartStudying} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md border h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-slate-700">No Matches Found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filter or profile!</p>
                </div>
            )}
            <div className="text-center mt-12">
                <button 
                    onClick={(e) => {
                        handleAnimatedClick(e);
                        onFindNew();
                    }}
                    className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none"
                >
                Refine Profile & Search Again
                </button>
            </div>
        </main>
      </div>
    </div>
  );
};

export default MatchList;