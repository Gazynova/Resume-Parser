import React, { useState } from 'react';

function ParsedResume() {
    const [csvData, setCsvData] = useState('');

    const handleDownload = () => {
        fetch('/api/download')
            .then((response) => response.text())
            .then((data) => {
                // Download the CSV file
                const link = document.createElement('a');
                link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`;
                link.download = 'parsed_resume.csv';
                link.click();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    return (
        <div>
            <h2>Parsed Resume</h2>
            <pre>{csvData}</pre>
            <button onClick={handleDownload}>Download CSV</button>
        </div>
    );
}

export default ParsedResume;
