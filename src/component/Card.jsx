import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";

const serverUrl = process.env.REACT_APP_SERVER_URL ?? "http://localhost:8000";

const Card = () => {
    // Sample data - can replace this with actual data as needed
    // const sessions = [
    //     { id: 1, name: "Christmas Lunch", progress: 55, votes: "55%", ended: false },
    //     { id: 2, name: "New Year Eve", progress: 70, votes: "70%", ended: false },
    //     { id: 3, name: "11.11 Single Day", progress: 30, votes: "30%", ended: false },
    //     { id: 4, name: "Children's Day", progress: 90, votes: "90%", ended: true },
    // ];

    const [sessions, setSessions] = useState([]);
    const [userId, setUserId] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    // get user_id for user from database
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`${serverUrl}/user/${user.username}`);
                setUserId(response.data.id);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUserId();
    }, [user.username]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${serverUrl}/sessions`);
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };
        fetchSessions();
    }, []);

    const updateSession = async (sessionId) => {
            try {
                const response = await axios.put(`${serverUrl}/session/${sessionId}/end`);
                console.log(response.data);
                // Update the session state
                setSessions(sessions.map((session) => {
                    if (session.id === sessionId) {
                        session.status = "closed";
                        session.result = response.data.result;
                    }
                    return session;
                }));
            } catch (error) {
                console.error("Error updating session:", error);
            }
        };

    const handleEndSession = (sessionId) => {
        // Logic to handle ending a session
        console.log("Ending session:", sessionId);
        // Update the session's ended state in the database
        updateSession(sessionId).then(r => console.log(r));

    };

    const getProgressColor = (progress) => {
        if (progress < 31) {
            return "bg-danger";
        } else if (progress < 51) {
            return "bg-warning";
        } else if (progress < 71) {
            return "bg-primary";
        } else {
            return "bg-success";
        }
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Current Sessions</h3>
            </div>
            <div className="card-body p-0">
                <table className="table table-striped text-left">
                    <thead>
                    <tr>
                        <th className="w-10px">#</th>
                        <th>Session</th>
                        <th>Joined</th>
                        <th className="w-40px">Votes</th>
                        <th>Action</th>
                        <th>Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(sessions.length === 0) ? (
                        <tr>
                            <td colSpan="6">No sessions found</td>
                        </tr>
                    ) : (
                        sessions.map((session) => (
                            <tr key={session.id}>
                                <td>{session.id}.</td>
                                <td>
                                    {/* Link to session details page */}
                                    <Link to={`/session/${session.id}`}>{session.name}</Link>
                                </td>
                                <td>
                                    <div className="progress progress-xs">
                                        <div
                                            className={`progress-bar ${getProgressColor(session.progress)} w-${session.progress}pt`}>
                                        </div>
                                    </div>
                                </td>
                                <td><span
                                    className={`badge ${getProgressColor(session.progress)}`}>{session.progress}%</span>
                                </td>
                                <td>
                                    {(session.ownerId === userId) && (session.status === "open") && (
                                        <button type="button" className="btn btn-danger btn-block btn-sm"
                                                onClick={() => handleEndSession(session.id)}>
                                            <i className="fa fa-bell"></i> End Session
                                        </button>
                                    )}
                                </td>
                                {session.result ? (
                                    <td>
                                        <button type="button" className="btn btn-success btn-block btn-sm">
                                            <i className="fa fa-check"></i> {session.result}
                                        </button>
                                    </td>
                                ) : (
                                    <td>
                                        <button type="button" className="btn btn-secondary btn-block btn-sm">
                                            <i className="fa fa-spinner"></i> Pending
                                        </button>
                                    </td>
                                )}
                            </tr>
                        )))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Card;
