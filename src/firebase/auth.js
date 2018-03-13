import {auth} from './fire';

// sign up functionality
export const fbSignup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email,password);
}

// Login funcitonality
export const fbLogin = (email,password) => {
    return auth.signInWithEmailAndPassword(email,password);
}

// Sign out fucntionality
export const fbLogout = () => {
    return auth.signOut();
}