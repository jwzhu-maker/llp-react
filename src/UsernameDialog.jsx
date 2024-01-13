import React, { useState } from 'react';

const UsernameDialog = ({ onSaveUsername }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = () => {
        onSaveUsername(username);
    };

    return (
        <div className="usernameDialog">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Your Name"
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default UsernameDialog;
