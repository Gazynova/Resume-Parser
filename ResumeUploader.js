
import React, { useState } from 'react';
import parseResume from './resumeParser';
import { saveAs } from 'file-saver';

function ResumeUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [csvData, setCsvData] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const resumeData = event.target.result;

                // Parse the resume data using the resume parser function
                const parsedData = parseResume(resumeData);

                // Set the parsed CSV data received from the resume parser
                setCsvData(parsedData);

                // Generate and download the CSV file
                downloadCsv(parsedData);
            };

            reader.readAsText(selectedFile);
        }
    };

    const downloadCsv = (data) => {
        const csvContent = convertToCsv(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'parsed_resume.csv');
    };

    const convertToCsv = (data) => {
        let csv = 'Name, Skills, Marks Consistency, City\n';

        if (Array.isArray(data)) {
            data.forEach((resume) => {
                const { name, skills, marksConsistency, city } = resume;
                const row = `"${name}", "${skills.join(', ')}", "${marksConsistency}", "${city}"\n`;
                csv += row;
            });
        } else if (data) {
            const { name, skills, marksConsistency, city } = data;
            const row = `"${name}", "${skills.join(', ')}", "${marksConsistency}", "${city}"\n`;
            csv += row;
        }

        return csv;
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Parse Resume</button>
            {csvData && (
                <div>
                    <h2>Parsed Data:</h2>
                    <p>Name: {csvData.name}</p>
                    <p>Skills: {csvData.skills.join(', ')}</p>
                    <p>Marks Consistency: {csvData.marksConsistency}</p>
                    <p>City: {csvData.city}</p>
                    <button onClick={() => downloadCsv(csvData)}>Download CSV</button>
                </div>
            )}
        </div>
    );
}

export default ResumeUploader;


