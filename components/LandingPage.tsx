import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
// This ensures the type for the icon prop is correctly recognized from the imported React object.
const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
    </div>
);

// FIX: Correctly typed the component props to accept 'onGetStarted', resolving multiple type errors.
const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        title: "AI-Powered Matching",
        description: "Smart algorithms connect you with students who truly complement your learning style, subject needs, and availability."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" /></svg>,
        title: "Integrated Study Tools",
        description: "Engage in real-time with a shared whiteboard, live chat, and AI-generated study plans, all in one seamless space."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>,
        title: "AI Study Assistant",
        description: "Instantly generate practice problems and discussion questions to guide your sessions and deepen your understanding."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>,
        title: "Flexible Grouping",
        description: "Whether you need a one-on-one partner for intense problem-solving or a larger group for discussion, you'll find your fit."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path d="M17.926 5.432l-2.138-.428A2.004 2.004 0 0014 3h-2a1 1 0 100 2h1.268a2 2 0 011.986 1.732l.334 1.668a3 3 0 11-5.176 0l.334-1.668A2 2 0 0110.732 5H12a1 1 0 100-2H8a2 2 0 00-1.788 1.004l-2.138.428A3.004 3.004 0 002 8.24v5.52a3 3 0 003 3h10a3 3 0 003-3V8.24a3.004 3.004 0 00-2.074-2.808zM16 13.76a1 1 0 01-1 1H5a1 1 0 01-1-1V8.24a1 1 0 01.691-.94l2.138-.427A4.003 4.003 0 0110 3.999a4.003 4.003 0 013.17 2.873l2.139.427a1 1 0 01.691.94v5.52z"/></svg>,
        title: "Track & Motivate",
        description: "Climb the leaderboard, connect with friends, and stay motivated with a supportive community and friendly competition."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
        title: "Diverse Subjects",
        description: "From Quantum Physics to Art History, find dedicated partners for a wide range of academic subjects and interests."
    }
  ];

  const handleAnimatedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.classList.remove('animate-fade-outline');
    void button.offsetWidth;
    button.classList.add('animate-fade-outline');
    button.addEventListener('animationend', () => {
        button.classList.remove('animate-fade-outline');
    }, { once: true });
  };

  return (
    <div className="w-full">
      <div className="text-center py-16 sm:py-24 px-4">
        <div 
          className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-8.247l11.494 0M4.253 12l15.494 0" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
          </svg>
        </div>
        <h1 
          className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight"
        >
          Stop Studying Alone.
        </h1>
        <h2 
          className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight mt-2"
        >
          Find Your Crew.
        </h2>
        <p 
          className="mt-6 max-w-2xl mx-auto text-lg text-slate-600"
        >
          StudySphere connects you with the perfect study partners. Create a profile, tell us what you're studying, and we'll match you with individuals and groups who share your goals and schedule.
        </p>
        <button
          onClick={(e) => {
            handleAnimatedClick(e);
            onGetStarted();
          }}
          className="mt-10 inline-block bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-blue-800 transition-transform transform hover:scale-105 focus:outline-none shadow-lg"
        >
          Create My Profile & Find Matches
        </button>
      </div>

      <div className="bg-white py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Learn Better, Together</h2>
                    <p className="text-lg text-slate-600">
                        Say goodbye to unproductive solo sessions. Collaborating with peers exposes you to new perspectives, helps you solidify complex topics, and keeps you motivated. StudySphere's intelligent matching system takes the guesswork out of finding compatible partners, connecting you with students who can help you learn and whom you can teach, creating a powerful, reciprocal learning environment.
                    </p>
                    <p className="text-lg text-slate-600">
                        Our platform is more than just a matchmaker. We provide an integrated suite of AI-powered tools designed for effective collaboration. From a shared digital whiteboard for brainstorming to an AI assistant that generates study plans and practice problems on the fly, StudySphere gives you everything you need to host a successful and engaging study session, every single time.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {features.slice(0, 4).map((feature, index) => (
                        <div key={feature.title} className={index % 2 !== 0 ? 'translate-y-6' : ''}>
                             <FeatureCard {...feature} />
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                {features.map((feature) => (
                    <FeatureCard key={feature.title} {...feature} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;