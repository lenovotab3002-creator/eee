import React, { useState, useEffect, useRef } from 'react';
import { Match, StudentProfile, MatchedStudent, MatchedGroup, ChatMessage } from '../types';
import { generateGroupChatSnippet } from '../services/geminiService';

interface MatchCardProps {
  match: Match;
  onStartStudying: (match: Match) => void;
}

const handleAnimatedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.classList.remove('animate-fade-outline');
    void button.offsetWidth;
    button.classList.add('animate-fade-outline');
    button.addEventListener('animationend', () => {
        button.classList.remove('animate-fade-outline');
    }, { once: true });
};

const InfoPill: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <span className={`text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full ${className}`}>
        {children}
    </span>
);

const IndividualMatchCard: React.FC<{ match: MatchedStudent; onStartStudying: (match: Match) => void }> = ({ match, onStartStudying }) => (
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
                onClick={(e) => {
                    handleAnimatedClick(e);
                    onStartStudying(match);
                }}
                className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 focus:outline-none transition-transform transform hover:scale-105"
            >
                Start Studying
            </button>
        </div>
    </>
);

const GroupMatchCard: React.FC<{ match: MatchedGroup; onStartStudying: (match: Match) => void }> = ({ match, onStartStudying }) => {
    const [chatPreview, setChatPreview] = useState<ChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(true);
    const chatHistoryRef = useRef<ChatMessage[]>([]);

    useEffect(() => {
        chatHistoryRef.current = chatPreview;
    }, [chatPreview]);
    
    useEffect(() => {
        const generateMessage = async () => {
            setIsGenerating(true);
            try {
                const response = await generateGroupChatSnippet(match.members, match.topic, chatHistoryRef.current);
                const newMessage: ChatMessage = {
                    ...response,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setChatPreview(prev => [...prev, newMessage].slice(-2));
            } catch (error) {
                console.error("Failed to generate chat snippet", error);
            } finally {
                setIsGenerating(false);
            }
        };
        
        // Stagger initial API calls and increase interval to avoid rate limiting
        const initialTimeout = setTimeout(generateMessage, Math.random() * 4000 + 1000); // More staggered start: 1-5s
        const intervalId = setInterval(generateMessage, 15000); // Slower updates: every 15s

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(intervalId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match.members, match.topic]);
    
    return (
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
            
            <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="font-semibold text-slate-600 mb-2 text-sm flex items-center">
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Discussion
                </h4>
                <div className="space-y-3 text-sm h-16 flex flex-col justify-end">
                    {isGenerating && chatPreview.length === 0 && (
                        <div className="flex items-center gap-2 animate-pulse">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0"></div>
                            <div className="flex-grow space-y-1.5">
                                <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
                                <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    )}
                    {chatPreview.slice(-1).map((msg, index) => {
                        const member = match.members.find(m => m.name === msg.sender);
                        return (
                            <div key={index} className="flex items-start gap-2 animate-fade-in">
                                <img src={member?.avatarUrl} alt={member?.name} className="w-6 h-6 rounded-full flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-800 text-xs">{msg.sender}</p>
                                    <p className="text-slate-600 leading-tight">{msg.text}</p>
                                </div>
                            </div>
                        )
                    })}
                    {isGenerating && chatPreview.length > 0 && (
                        <div className="flex items-start gap-2 animate-fade-in">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0" />
                             <div className="flex items-center space-x-1 pt-2">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="p-6 bg-slate-50">
            <button
                onClick={(e) => {
                    handleAnimatedClick(e);
                    onStartStudying(match);
                }}
                className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 focus:outline-none transition-transform transform hover:scale-105"
            >
                Join Group
            </button>
        </div>
    </>
    );
}


const MatchCard: React.FC<MatchCardProps> = ({ match, onStartStudying }) => {
  const isGroup = 'members' in match;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
      {isGroup ? <GroupMatchCard match={match} onStartStudying={onStartStudying} /> : <IndividualMatchCard match={match as MatchedStudent} onStartStudying={onStartStudying} />}
    </div>
  );
};

export default MatchCard;