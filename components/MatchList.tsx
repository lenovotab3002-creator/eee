
import React from 'react';
import { MatchedStudent } from '../types';
import MatchCard from './MatchCard';

interface MatchListProps {
  matches: MatchedStudent[];
  onStartStudying: (student: MatchedStudent) => void;
  onFindNew: () => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, onStartStudying, onFindNew }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800">We Found Your Study Crew!</h2>
        <p className="text-slate-500 mt-2 text-lg">Here are your top matches based on your profile.</p>
      </div>
      
      {matches.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} onStartStudying={onStartStudying} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md border">
            <h3 className="text-2xl font-bold text-slate-700">No Matches Found</h3>
            <p className="text-slate-500 mt-2">We couldn't find any suitable matches right now. Try adjusting your profile!</p>
        </div>
      )}
      <div className="text-center mt-12">
        <button 
          onClick={onFindNew}
          className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Refine Profile & Search Again
        </button>
      </div>
    </div>
  );
};

export default MatchList;
