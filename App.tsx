import React, { useState, useEffect } from 'react';
import { User } from './types';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    // Try to load user from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('finandash_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.removeItem('finandash_user');
            }
        }
    }, []);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        localStorage.setItem('finandash_user', JSON.stringify(loggedInUser));
    };
    
    const handleRegister = (registeredUser: User) => {
        // For simplicity, log in the user directly after registration
        setUser(registeredUser);
        localStorage.setItem('finandash_user', JSON.stringify(registeredUser));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('finandash_user');
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('finandash_user', JSON.stringify(updatedUser));
    };

    if (!user) {
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
    }

    return <Dashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
};

export default App;
