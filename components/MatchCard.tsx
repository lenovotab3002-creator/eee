
import React from 'react';
import { MatchedStudent } from '../types';

interface MatchCardProps {
  match: MatchedStudent;
  onStartStudying: (student: MatchedStudent) => void;
}

const InfoPill: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <span className={`text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full ${className}`}>
        {children}
    </span>
);

const MatchCard: React.FC<MatchCardProps> = ({ match, onStartStudying }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <img src={match.avatarUrl} alt={match.name} className="w-20 h-20 rounded-full mr-4 border-4 border-slate-100" />
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{match.name}</h3>
            <p className="text-slate-500">{match.studyMethod}</p>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-5">
            <p className="text-sm italic">"{match.matchReason}"</p>
        </div>

        <div className="space-y-4 text-sm">
            <div>
                <h4 className="font-semibold text-slate-600 mb-2">Can Help With:</h4>
                <div className="flex flex-wrap">
                    {match.subjectsCanHelp.map(s => <InfoPill key={s} className="bg-green-100 text-green-800">{s}</InfoPill>)}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-slate-600 mb-2">Needs Help In:</h4>
                <div className="flex flex-wrap">
                    {match.subjectsHelpNeeded.map(s => <InfoPill key={s} className="bg-orange-100 text-orange-800">{s}</InfoPill>)}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-slate-600 mb-2">Availability:</h4>
                <div className="flex flex-wrap">
                    {match.availability.map(s => <InfoPill key={s} className="bg-purple-100 text-purple-800">{s}</InfoPill>)}
                </div>
            </div>
        </div>
      </div>
      <div className="p-6 bg-slate-50">
        <button
          onClick={() => onStartStudying(match)}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          Start Studying
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
