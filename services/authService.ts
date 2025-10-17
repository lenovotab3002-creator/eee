import { StudentProfile } from '../types';

// This is a mock authentication service using localStorage.
// WARNING: In a real-world application, never store user credentials or sensitive data
// in localStorage. Authentication should be handled by a secure backend server.

const USERS_KEY = 'studySphereUsers';

// We need to store a "password" for the login check simulation, but we won't expose it.
type StoredUser = StudentProfile & { password_simulation: string };

// Helper to get users from localStorage
const getUsers = (): StoredUser[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: StudentProfile }> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    
    const users = getUsers();
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    
    const newUser: StoredUser = {
        id: Date.now(),
        name,
        email,
        password_simulation: password, // Storing for simulation purposes ONLY. DO NOT DO THIS IN PRODUCTION.
        subjectsCanHelp: [],
        subjectsHelpNeeded: [],
        availability: [],
        studyMethod: '',
        avatarUrl: `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '-')}/200`
    };
    
    users.push(newUser);
    saveUsers(users);

    // Don't return the password in the user object
    const { password_simulation, ...userToReturn } = newUser;
    return { success: true, message: 'Signup successful!', user: userToReturn };
};


export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: StudentProfile }> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // This is a simulation. We are checking the stored "password".
    // In a real application, you would send the email and password to a server,
    // which would compare a hashed version of the password.
    if (user && user.password_simulation === password) {
        const { password_simulation, ...userToReturn } = user;
        return { success: true, message: 'Login successful!', user: userToReturn };
    }

    return { success: false, message: 'Invalid email or password.' };
};

export const updateProfile = async (updatedProfile: StudentProfile): Promise<StudentProfile> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 200));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === updatedProfile.id);
    
    if (userIndex > -1) {
        // Preserve the stored password when updating profile
        const existingPassword = users[userIndex].password_simulation;
        users[userIndex] = {
            ...updatedProfile,
            password_simulation: existingPassword,
        };
        saveUsers(users);
    }
    return updatedProfile;
};
