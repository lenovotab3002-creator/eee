import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
}

const LoginModal: React.FC<LoginProps> = ({ onLoginSuccess, onSignupSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAnimatedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.classList.remove('animate-fade-outline');
    void button.offsetWidth;
    button.classList.add('animate-fade-outline');
    button.addEventListener('animationend', () => {
        button.classList.remove('animate-fade-outline');
    }, { once: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email || !password || (mode === 'signup' && !name)) {
        setError('Please fill in all fields.');
        return;
    }
    
    // Simulate API call
    if (mode === 'login') {
        console.log('Logging in with:', { email, password });
        onLoginSuccess();
    } else {
        console.log('Signing up with:', { name, email, password });
        onSignupSuccess();
    }
  };
  
  const toggleMode = () => {
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="text-center mb-4">
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-8.247l11.494 0M4.253 12l15.494 0" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
            </div>
        </div>

        <div key={mode} className="animate-slide-in-left">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                </h2>
                <p className="text-slate-500 mt-2">
                    {mode === 'login' ? 'Log in to find your study crew.' : 'Join StudySphere today.'}
                </p>
            </div>
      
            <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full py-2 px-4 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                            placeholder="Jane Doe"
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full py-2 px-4 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full py-2 px-4 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        placeholder="••••••••"
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                    <button 
                        type="submit" 
                        onClick={handleAnimatedClick}
                        className="w-full font-bold py-3 px-4 rounded-md focus:outline-none transition-all duration-300 ease-in-out bg-blue-700 text-white hover:bg-blue-800"
                    >
                        {mode === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </form>
            
            <div className="mt-6 text-right">
                 <span className="text-sm text-slate-600">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                    onClick={(e) => {
                        handleAnimatedClick(e);
                        toggleMode();
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline transition-colors focus:outline-none"
                >
                    {mode === 'login' ? 'Sign up' : 'Login'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default LoginModal;