import React, { useState, useEffect } from 'react';
import { StudySessionData, StudyPlan } from '../types';
import { generateStudyPlan, generatePracticeProblem } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface CollaborationSpaceProps {
  sessionData: StudySessionData;
  onBack: () => void;
}

const CollaborationSpace: React.FC<CollaborationSpaceProps> = ({ sessionData, onBack }) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProblemLoading, setIsProblemLoading] = useState<boolean>(false);
  const [whiteboardText, setWhiteboardText] = useState<string>(`Shared notes for ${sessionData.subject}...\n\n`);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData.subject]);

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

  return (
    <div className="animate-fade-in">
       {isLoading && <LoadingSpinner message="Generating AI study plan" />}

      <button onClick={onBack} className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-slate-700 bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
        &larr; Back to Matches
      </button>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Study Session: <span className="text-blue-600">{sessionData.subject}</span></h2>
          <p className="text-slate-500 mt-1">You are now collaborating with {sessionData.partner.name}.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shared Whiteboard */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-3 text-slate-700">Shared Whiteboard</h3>
            <textarea
              className="w-full h-96 p-4 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none font-mono text-sm"
              value={whiteboardText}
              onChange={(e) => setWhiteboardText(e.target.value)}
            />
          </div>

          {/* AI Study Assistant */}
          <div className="bg-slate-50 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-slate-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              AI Study Assistant
            </h3>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
            {studyPlan && (
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
                    <summary className="cursor-pointer font-semibold text-blue-600 hover:underline">Show Solution</summary>
                    <p className="bg-green-50 p-3 rounded-md mt-1 text-green-800 border border-green-200">{studyPlan.practiceProblem.solution}</p>
                  </details>
                  <button
                    onClick={handleNewProblem}
                    disabled={isProblemLoading}
                    className="mt-4 w-full text-sm font-semibold py-2 px-4 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProblemLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
};

export default CollaborationSpace;