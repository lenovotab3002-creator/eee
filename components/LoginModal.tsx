import React, { useState, useEffect } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after the component is mounted
      const timer = setTimeout(() => setIsAnimating(true), 10);
      
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEsc);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      setIsAnimating(false);
      // Reset the logging in state when the modal is closed.
      // This prevents it from being stuck in a loading state if reopened.
      setIsLoggingIn(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  const handleLoginAttempt = () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setTimeout(() => {
        onLogin();
    }, 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome Back!</h2>
          <p className="text-center text-slate-500 mb-8">Log in to find your study crew.</p>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLoginAttempt(); }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Username or Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full font-semibold py-3 px-4 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors flex justify-center items-center disabled:bg-blue-500 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="mx-4 text-sm text-slate-500">Or continue with</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleLoginAttempt}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-5.067 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Google
            </button>
            <button
              onClick={handleLoginAttempt}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" role="img" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;