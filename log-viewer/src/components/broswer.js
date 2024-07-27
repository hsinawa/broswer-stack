import React, { useState } from 'react';


function Browser() {
    const [url, setUrl] = useState('');
    const [browser, setBrowser] = useState('');
    const [message, setMessage] = useState('');

    const handleOpenUrl = async () => {
        const response = await fetch('http://localhost:5001/open-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, browser })
        });

        const result = await response.text();
        setMessage(result);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Open URL in Specific Browser</h1>
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <select value={browser} onChange={(e) => setBrowser(e.target.value)}>
                    <option value="">Select Browser</option>
                    <option value="safari">Safari</option>
                    <option value="chrome">Google Chrome</option>
                    <option value="firefox">Firefox</option>
                    <option value="edge">Microsoft Edge</option>
                </select>
                <button onClick={handleOpenUrl}>Open URL</button>
                {message && <p>{message}</p>}
            </header>
        </div>
    );
}

export default Browser;
