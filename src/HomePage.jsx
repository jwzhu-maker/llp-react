import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './homepage.css';
import LoginPage from "./LoginPage";
import Card from "./component/Card";
import Modal from "./component/NewSessionModal";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newSessionName, setNewSessionName] = useState('');
    const [newSessionParticipants, setNewSessionParticipants] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const onLogin = (username, password) => {
        const userData = {username};
        // try to log in this user to backend
        // if successful, set user data and isLoggedIn
        try {
            const response = fetch(`${serverUrl}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to login:', error);
        }

        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage for persistence
    };

    const onLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    }

    if (!isLoggedIn) {
        return <LoginPage onLogin={onLogin}/>;
    }

    const createSession = async (sessionName, ownerName, sessionParticipants) => {
        try {
            const response = await fetch('${serverUrl}/create-session/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: sessionName, owner_name: ownerName, session_participants: sessionParticipants})
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Session created:', data);

            return data;
        } catch (error) {
            console.error('Failed to create session:', error);
        }
    };

    const handleCreateSessionClick = () => {
        setShowModal(true);
    };

    const handleSaveNewSession = async () => {
        // After creating session, navigate to SessionPage
        setShowModal(false);
        const owner_name = user.username;
        const responseData = await createSession(newSessionName, owner_name, newSessionParticipants);
        const newSessionId = responseData?.session_id;
        navigate(`/session/${newSessionId}`);
    };

    return (
        <div className="homePage">
            <header className="header">
                <h1>Lunch Location Picker</h1>
                <p>Welcome, {user.username}</p>
                <button onClick={onLogout} className="btn btn-sm btn-primary mb-3">
                    Logout
                </button>
                <section className="content">
                    <button onClick={handleCreateSessionClick} className="createSessionButton">
                        Create Session
                    </button>
                    <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onSave={handleSaveNewSession}
                    >
                        <div className="d-flex flex-column">
                            <div className="mb-3 d-flex">
                                <p className="text-bold text-blue w-300px mr-auto">Session Name:</p>
                                <input
                                    type="text"
                                    value={newSessionName}
                                    onChange={(e) => setNewSessionName(e.target.value)}
                                    placeholder="Enter Session Name"
                                    className="w-70pt"
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="text-bold text-blue w-300px mr-auto">Expected Participants:</p>
                                    <input
                                    type="text"
                                    value={newSessionParticipants}
                                    onChange={(e) => setNewSessionParticipants(parseInt(e.target.value))}
                                    placeholder="Number of participants"
                                    className="w-70pt"
                                />
                            </div>
                        </div>
                    </Modal>
                </section>
            </header>
            <main className="mainContent">
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <Card/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/*<footer className="footer">*/}
            {/*    /!* Additional information and links *!/*/}
            {/*</footer>*/}
        </div>
    );
};

export default HomePage;
