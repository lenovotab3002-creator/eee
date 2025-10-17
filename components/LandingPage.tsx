
import React from 'react';

interface LandingPageProps {
  onFindPeers: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 text-left shadow-sm">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-700 text-white mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500 text-sm">{children}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onFindPeers }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-base font-semibold text-blue-700 tracking-wide uppercase">Learn Better, Together</h2>
        <p className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Stop Studying Alone.
        </p>
        <p className="mt-5 max-w-2xl mx-auto text-xl text-slate-500">
          Tired of studying alone or with mismatched partners? Our Interactive Study Group Finder takes the guesswork out of collaborative learning. Connect with students who truly complement your learning style and schedule.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <button
              onClick={onFindPeers}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-transform transform hover:scale-105"
            >
              Find Study Peers Now &rarr;
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Why StudySphere?</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500">
                A smarter way to connect, collaborate, and conquer your courses.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                title="AI-Powered Matching"
            >
                Our smart algorithm connects you with peers based on subjects, study habits, and availability. Find your perfect study partner in seconds.
            </FeatureCard>
            <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                title="Collaborative Tools"
            >
                Jump into a session with a shared whiteboard and AI-generated study plans to stay organized and on track.
            </FeatureCard>
            <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Flexible & Efficient"
            >
                Find partners for a quick problem-solving session or a long-term study group. Learn your way, on your schedule.
            </FeatureCard>
            <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                title="Track Your Growth"
            >
                Monitor your study session history and visualize your progress to stay motivated and identify areas for improvement.
            </FeatureCard>
             <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L3 6v5c0 6 9 11 9 11s9-5 9-11V6l-9-4z" /></svg>}
                title="Safe & Secure"
            >
                Your privacy is our priority. Connect with peers in a secure environment designed for focused, productive learning.
            </FeatureCard>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
