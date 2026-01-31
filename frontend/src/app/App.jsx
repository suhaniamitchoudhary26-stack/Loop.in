import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Feed from '../features/feed/Feed';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
    const { user, logout } = useAuth();

    return (
        <div>
            <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>LOOP.IN</Link>
                <div>
                    {user ? (
                        <>
                            <span style={{ marginRight: '10px' }}>Hi, {user.role}</span>
                            <button onClick={logout} style={{cursor: 'pointer'}}>Logout</button>
                        </>
                    ) : (
                        <>
                           <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                           <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <Feed />
                    </PrivateRoute>
                } />
            </Routes>
        </div>
    )
}

export default App;
