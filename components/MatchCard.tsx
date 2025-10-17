import React from 'react';
import { Match, StudentProfile } from '../types';

interface MatchCardProps {
  match: Match;
  onStartStudying: (match: Match) => void;
}

const InfoPill: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <span className={`text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full ${className}`}>
        {children}
    </span>
);

const renderIndividualCard = (match: StudentProfile & { matchReason: string }, onStartStudying: (match: Match) => void) => (
    <>
        <div className="p-6 flex-grow">
            <div className="flex items-center mb-4">
                <img src={match.avatarUrl} alt={match.name} className="w-20 h-20 rounded-full mr-4 border-4 border-slate-100" />
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">{match.name}</h3>
                    <p className="text-slate-500">{match.studyMethod}</p>
                </div>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-600 text-blue-900 p-4 rounded-r-lg mb-5">
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
            </div>
        </div>
        <div className="p-6 bg-slate-50">
            <button
                onClick={() => onStartStudying(match)}
                className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-transform transform hover:scale-105"
            >
                Start Studying
            </button>
        </div>
    </>
);

const renderGroupCard = (match: { id: number, name: string, members: StudentProfile[], capacity: number, matchReason: string, topic: string }, onStartStudying: (match: Match) => void) => (
    <>
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{match.topic}</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{match.name}</h3>
                </div>
                <div className="flex -space-x-3">
                    {match.members.map(member => (
                        <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    ))}
                </div>
            </div>
             { (match.capacity > 2) && (
                <div className="text-sm font-semibold text-slate-600 mb-4 text-right">
                    <span className="bg-slate-200 px-3 py-1 rounded-full">{match.members.length}/{match.capacity} Filled</span>
                </div>
             )}
            <div className="bg-blue-100 border-l-4 border-blue-600 text-blue-900 p-4 rounded-r-lg mb-5">
                <p className="text-sm italic">"{match.matchReason}"</p>
            </div>
            <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold text-slate-600 mb-2">Members:</h4>
                    <div className="flex flex-wrap">
                        {match.members.map(member => (
                            <div key={member.id} className="flex items-center mr-4 mb-2">
                                <img src={member.avatarUrl} alt={member.name} className="w-6 h-6 rounded-full mr-2" />
                                <span className="text-slate-700">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="p-6 bg-slate-50">
            <button
                onClick={() => onStartStudying(match)}
                className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-transform transform hover:scale-105"
            >
                Join Group
            </button>
        </div>
    </>
);


const MatchCard: React.FC<MatchCardProps> = ({ match, onStartStudying }) => {
  const isGroup = 'members' in match;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
      {isGroup ? renderGroupCard(match, onStartStudying) : renderIndividualCard(match, onStartStudying)}
    </div>
  );
};

export default MatchCard;