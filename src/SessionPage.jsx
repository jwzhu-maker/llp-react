import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import './SessionPage.css';

const SessionPage = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {sessionId} = useParams();
    const [session, setSession] = useState('');

    const [submissions, setSubmissions] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/'); // Navigates back to the Home page
    };

    useEffect(() => {
        const checkUserSubmission = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/check-submission/${sessionId}/${user.username}`);
                if (response.data.submitted) {
                    setRestaurants([response.data.restaurantName]);
                    setIsSubmitted(true);
                }
            } catch (error) {
                console.error("Error checking submission:", error);
            }
        };

        checkUserSubmission();
    }, [sessionId, user.username]); // Add user.username as a dependency

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/session/${sessionId}/submissions`);
                setSubmissions(response.data);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            }
        };

        const getOwnerName = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/session/${sessionId}/owner`);
                setSession(response.data)
            } catch (error) {
                console.error("Error fetching owner:", error);
            }
        }

        fetchSubmissions();
        getOwnerName();
    }, [sessionId, user.username]); // Dependency array - fetch submissions when sessionId changes


    const handleSubmitRestaurant = async () => {
        setRestaurants([restaurantName]);
        // call API to save the submission
        try {
            await axios.post(`http://localhost:8000/submit-restaurant/`, {
                session_id: sessionId,
                restaurant_name: restaurantName,
                user_name: user.username,
            });
        } catch (error) {
            console.error("Error submitting restaurant:", error);
        }

        setIsSubmitted(true); // Set to true on submission

        // update the submission list
        try {
            const response = await axios.get(`http://localhost:8000/session/${sessionId}/submissions`);
            setSubmissions(response.data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }

    };

    return (
        <div className="sessionPage">
            <header className="header">
                <h1>Session: {sessionId} </h1>
                <h5>{session.name}</h5>
                <button onClick={navigateToHome} className="btn btn-sm btn-primary mb-3">
                    Back to Home
                </button>
                {isSubmitted && (
                    <div className="">
                        You have submitted:
                        <div className="restaurantList text-success">
                            {restaurants.map((restaurant) => (
                                <div key={restaurant}>{restaurant}</div>
                            ))}
                        </div>
                        as your preferred restaurant.
                    </div>
                )}
            </header>
            <main className="sessionContent">
                <div className="d-flex flex-column bg-cyan w-100pt">
                    {!isSubmitted && (session.status === "open") && ( // Only show input and submit button if not submitted
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={restaurantName}
                                    onChange={(e) => setRestaurantName(e.target.value)}
                                    placeholder="Enter Restaurant Name"
                                    className="form-control form-control-lg mt-3"
                                />
                            </div>
                            <div className="mb-3">
                                <button onClick={handleSubmitRestaurant} className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </>
                    )}
                    {!session.result ? (
                        <div className="mt-3">
                            <p>The final restaurant has not been decided yet...</p>
                        </div>
                    ) : (
                        <div className="mt-3">
                            <p>The final restaurant is picked as:</p>
                            <h2>{session.result}</h2>
                        </div>
                    )}
                </div>
                {/* Kanban Board */}
                <div className="kanbanBoard">
                    <h3>User Submissions</h3>
                    <div className="submissionList">
                        {submissions.map((submission, index) => (
                            <div key={index} className="submission">
                                <span className="user">{submission.user}:</span>
                                <span className="restaurant">{submission.restaurant}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="footer">
                Lunch Restaurant Picker
            </footer>
        </div>
    );
};

export default SessionPage;
