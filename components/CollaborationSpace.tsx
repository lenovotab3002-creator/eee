import React, { useState, useEffect, useRef } from 'react';
import { StudySessionData, StudyPlan, ChatMessage, StudentProfile } from '../types';
import { generateStudyPlan, generatePracticeProblem, generateChatResponse } from '../services/geminiService';
import Whiteboard from './Whiteboard'; // Import the new Whiteboard component
import '../styles/customScrollbar.css';

interface CollaborationSpaceProps {
  sessionData: StudySessionData;
  onBack: () => void;
}

const StudyPlanSkeleton: React.FC = () => (
  <div className="space-y-5 text-sm animate-pulse">
    <div>
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
    <div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-4/6"></div>
      </div>
    </div>
    <div>
      <div className="h-4 bg-slate-200 rounded w-2/5 mb-2"></div>
      <div className="h-16 bg-slate-200 p-3 rounded-md mt-1"></div>
      <div className="h-8 mt-4 w-full bg-slate-200 rounded-lg"></div>
    </div>
  </div>
);


const CollaborationSpace: React.FC<CollaborationSpaceProps> = ({ sessionData, onBack }) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProblemLoading, setIsProblemLoading] = useState<boolean>(false);
  const [sentFriendRequestIds, setSentFriendRequestIds] = useState<Set<number>>(new Set());
  const [isFriendDropdownOpen, setIsFriendDropdownOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const friendDropdownRef = useRef<HTMLDivElement>(null);

  const match = sessionData.match;
  const { userProfile } = sessionData;
  const isGroupSession = 'members' in match;
  const participants: StudentProfile[] = isGroupSession ? match.members : [match];
  const sessionName = match.name;
  
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
    const fetchStudyPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const plan = await generateStudyPlan(sessionData.subject);
        setStudyPlan(plan);
      } catch (err) {
        setError("Could not generate a study plan. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudyPlan();

    const firstParticipant = participants[0];
    setChatMessages([
        {
          sender: firstParticipant.name,
          text: `Hey! I've set up a study plan for us on the right. Ready to dive into ${sessionData.subject}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData.subject, match.id]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (friendDropdownRef.current && !friendDropdownRef.current.contains(event.target as Node)) {
            setIsFriendDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewProblem = async () => {
    if (!studyPlan) return;
    
    const detailsElement = document.querySelector('details');
    if (detailsElement) {
      detailsElement.open = false;
    }
    
    setIsProblemLoading(true);
    try {
      const newProblem = await generatePracticeProblem(sessionData.subject);
      setStudyPlan(prevPlan => {
        if (!prevPlan) return null;
        return { ...prevPlan, practiceProblem: newProblem };
      });
    } catch (err) {
      console.error("Failed to generate new problem", err);
    } finally {
      setIsProblemLoading(false);
    }
  };
  
  const handleAddFriend = (friendId: number) => {
    setSentFriendRequestIds(prev => new Set(prev).add(friendId));
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isPartnerTyping) return;

    const newUserMessage: ChatMessage = {
        sender: 'You',
        text: currentMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setCurrentMessage('');
    setIsPartnerTyping(true);

    try {
        const aiResponse = await generateChatResponse(
            updatedMessages, 
            participants, 
            sessionData.subject, 
            userProfile.name
        );
        
        const partnerReply: ChatMessage = {
            sender: aiResponse.sender,
            text: aiResponse.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, partnerReply]);
    } catch (error) {
        console.error("Failed to get AI chat response:", error);
        const errorReply: ChatMessage = {
            sender: participants[0]?.name || 'System',
            text: "Oops, my connection timed out. Could you repeat that?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, errorReply]);
    } finally {
        setIsPartnerTyping(false);
    }
  };
  
  const renderAddFriendButton = () => {
    if (isGroupSession) {
        return (
            <div className="relative" ref={friendDropdownRef}>
                <button
                    onClick={() => setIsFriendDropdownOpen(!isFriendDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>
                    <span>Add Friends</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isFriendDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                <div 
                    className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-200 ease-out 
                    ${isFriendDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {participants.map(member => (
                            <button
                                key={member.id}
                                onClick={() => handleAddFriend(member.id)}
                                disabled={sentFriendRequestIds.has(member.id)}
                                className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                role="menuitem"
                            >
                                <div className="flex items-center">
                                    <img src={member.avatarUrl} alt={member.name} className="w-7 h-7 rounded-full mr-3" />
                                    <span>{member.name}</span>
                                </div>
                                {sentFriendRequestIds.has(member.id) && <span className="text-xs text-green-600">Sent!</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const partner = participants[0];
    const isFriendAdded = sentFriendRequestIds.has(partner.id);
    return (
      <button 
        onClick={() => handleAddFriend(partner.id)}
        disabled={isFriendAdded}
        className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${
          isFriendAdded 
            ? 'bg-green-100 text-green-700 cursor-default' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
      >
        {isFriendAdded ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>Friend Request Sent</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>
            <span>Add {partner.name}</span>
          </>
        )}
      </button>
    );
  };


  return (
    <div className="animate-fade-in">
      <button 
        onClick={(e) => {
            handleAnimatedClick(e);
            onBack();
        }} 
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-slate-700 bg-slate-200 hover:bg-slate-300 focus:outline-none transition"
      >
        &larr; Back to Matches
      </button>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Study Session: <span className="text-blue-700">{sessionData.subject}</span></h2>
          <p className="text-slate-500 mt-1">You are now collaborating with {sessionName}.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shared Whiteboard */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-slate-700">Shared Whiteboard</h3>
              {renderAddFriendButton()}
            </div>
            <Whiteboard />
          </div>

          {/* AI Study Assistant */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-slate-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              AI Study Assistant
            </h3>
            
            {isLoading && <StudyPlanSkeleton />}
            {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
            {!isLoading && studyPlan && (
              <div className="space-y-5 text-sm">
                <div>
                  <h4 className="font-bold text-slate-600">Key Topics:</h4>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-1">
                    {studyPlan.keyTopics.map(topic => <li key={topic}>{topic}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-600">Discussion Questions:</h4>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-1">
                    {studyPlan.discussionQuestions.map(q => <li key={q}>{q}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-600">Practice Problem:</h4>
                  <p className="bg-slate-200 p-3 rounded-md mt-1 text-slate-700 transition-all duration-300" key={studyPlan.practiceProblem.problem}>{studyPlan.practiceProblem.problem}</p>
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer font-semibold text-blue-700 hover:underline">Show Solution</summary>
                    <p className="bg-green-50 p-3 rounded-md mt-1 text-green-800 border border-green-200">{studyPlan.practiceProblem.solution}</p>
                  </details>
                  <button
                    onClick={(e) => {
                      handleAnimatedClick(e);
                      handleNewProblem();
                    }}
                    disabled={isProblemLoading}
                    className="mt-4 w-full text-sm font-semibold py-2 px-4 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none"
                  >
                    {isProblemLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                       'Generate New Problem'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Live Chat */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 text-slate-700">Live Chat with {sessionName}</h3>
        <div className="flex flex-col h-80 bg-slate-50 border rounded-lg">
          <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {chatMessages.map((msg, index) => {
              const isUser = msg.sender === 'You';
              const senderInfo = isUser ? null : participants.find(p => p.name === msg.sender);

              return (
                <div key={index} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && senderInfo && <img src={senderInfo.avatarUrl} alt={senderInfo.name} className="w-8 h-8 rounded-full" />}
                  <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                    {!isUser && senderInfo && <p className="text-xs font-bold text-blue-800 mb-1">{senderInfo.name}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 opacity-70 ${isUser ? 'text-blue-200 text-right' : 'text-slate-500 text-left'}`}>{msg.timestamp}</p>
                  </div>
                  {isUser && <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">YOU</div>}
                </div>
              );
            })}
             {isPartnerTyping && (
                <div className="flex items-end gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 animate-pulse" />
                    <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-none">
                        <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full py-2 px-4 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 transition"
              />
              <button 
                type="submit" 
                onClick={handleAnimatedClick}
                className="bg-blue-700 text-white rounded-full p-2.5 hover:bg-blue-800 transition-colors focus:outline-none disabled:bg-blue-400 flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollaborationSpace;