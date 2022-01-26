import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getIdToken,
} from 'firebase/auth';
import axios from 'axios';
import jwt from 'jsonwebtoken';
//
import { FIREBASE_API, HOST_API } from '../config';

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const fbProvider = new FacebookAuthProvider();
const ggProvider = new GoogleAuthProvider();

const AUTH = getAuth(firebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: 'firebase',
  login: () => Promise.resolve(),
  fbLogin: () => Promise.resolve(),
  ggLogin: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getToken: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [profile, setProfile] = useState(null);

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {

          const {data: token} = await axios({
            url: `${HOST_API}/v1/users/token`,
            method: 'post',
            data: { user }
          });

          localStorage.setItem('zennomi-token', token);

          const decodedUser = jwt.decode(token);

          if (decodedUser) {
            setProfile(decodedUser);
          }

          console.log(user, decodedUser)

          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: true, user },
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: false, user: null },
          });
          localStorage.setItem('zennomi-token', null);
        }

      }),
    [dispatch]
  );

  const login = (email, password) => signInWithEmailAndPassword(AUTH, email, password);

  const fbLogin = () => signInWithPopup(AUTH, fbProvider);
  const ggLogin = () => signInWithPopup(AUTH, ggProvider);

  const register = (email, password, firstName, lastName) =>
    createUserWithEmailAndPassword(AUTH, email, password).then(async (res) => {
      await axios({
        url: `${HOST_API}/v1/users`,
        method: 'post',
        data: {
          _id: res.user?.uid,
          email,
          displayName: `${firstName} ${lastName}`
        }
      })
    });

  const logout = () => signOut(AUTH);

  const getToken = () => getIdToken(state.user, false);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          id: state?.user?.uid,
          email: state?.user?.email,
          photoURL: state?.user?.photoURL || profile?.photoURL,
          displayName: state?.user?.displayName || profile?.displayName,
          role: profile?.role || '',
          isStaff: ['admin','mod'].includes(profile?.role) || false,
          phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false,
        },
        login,
        fbLogin,
        ggLogin,
        register,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
