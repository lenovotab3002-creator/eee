import React, { useState } from 'react';
import { signUp, login } from '../services/authService';
import { StudentProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: StudentProfile) => void;
  onSignupSuccess: (user: StudentProfile) => void;
}

const LoginModal: React.FC<LoginProps> = ({ onLoginSuccess, onSignupSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnimatedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.classList.remove('animate-fade-outline');
    void button.offsetWidth;
    button.classList.add('animate-fade-outline');
    button.addEventListener('animationend', () => {
        button.classList.remove('animate-fade-outline');
    }, { once: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!email || !password || (mode === 'signup' && !name)) {
        setError('Please fill in all fields.');
        setIsLoading(false);
        return;
    }
    
    try {
      if (mode === 'login') {
          const result = await login(email, password);
          if (result.success && result.user) {
              onLoginSuccess(result.user);
          } else {
              setError(result.message);
          }
      } else {
          const result = await signUp(name, email, password);
          if (result.success && result.user) {
              onSignupSuccess(result.user);
          } else {
              setError(result.message);
          }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
                        disabled={isLoading}
                        className="w-full font-bold py-3 px-4 rounded-md focus:outline-none transition-all duration-300 ease-in-out bg-blue-700 text-white hover:bg-blue-800 flex justify-center items-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            mode === 'login' ? 'Login' : 'Sign Up'
                        )}
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
