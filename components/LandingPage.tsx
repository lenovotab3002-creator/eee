
import React from 'react';

interface LandingPageProps {
  onFindPeers: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onFindPeers }) => {
  return (
    <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Learn Better, Together</h2>
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
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Find Study Peers Now &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
