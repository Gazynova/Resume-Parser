function parseResume(resumeFile) {
    // Parse the resume file and extract relevant information
    const name = extractName(resumeFile);
    const skills = extractSkills(resumeFile);
    const marksConsistency = calculateMarksConsistency(resumeFile);
    const city = extractCity(resumeFile);

    // Return the parsed data
    return {
        name,
        skills,
        marksConsistency,
        city,
    };
};



// function extractName(resumeFile) {
//     // Convert the resume file data into a string
//     const resumeText = resumeFile.toString();

//     // Split the resume text into lines
//     const lines = resumeText.split('\n');

//     // Search for a line that contains the name
//     let name = '';
//     for (let i = 0; i < lines.length; i++) {
//         const line = lines[i].trim();
//         if (line !== '') {
//             // Check if the line contains the name (you can modify this logic based on your resume format)
//             if (line.match(/^(?:[A-Z][a-z]*\s?){2,}$/)) {
//                 name = line;
//                 break;
//             }
//         }
//     }

//     // Return the extracted name
//     //return "John Doe";
//     return name;
// }

function extractName(resumeText) {
    // Split the resume text into lines
    const lines = resumeText.split('\n');

    // Iterate through the lines and look for the line that contains the name
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if the line contains the name using a simple condition
        if (line.length > 0) {
            // Assuming the name is the first non-empty line encountered
            return line;
        }
    }

    // If no name is found, return an empty string or handle it accordingly
    return '';
}


function extractSkills(resumeFile) {
    const resumeText = resumeFile.toString().toLowerCase();

    const skillsList = [
        { skill: 'JavaScript', aliases: ['js'] },
        { skill: 'React', aliases: ['reactjs', 'react.js'] },
        { skill: 'Node.js', aliases: ['node', 'nodejs'] },
        { skill: 'SQL', aliases: [] },
        { skill: 'Java', aliases: [] },
        { skill: 'Python', aliases: [] },
    ];

    const extractedSkills = [];

    skillsList.forEach((skillData) => {
        const { skill, aliases } = skillData;

        const skillPattern = new RegExp(`\\b(${skill}|${aliases.join('|')})\\b`, 'gi');

        if (skillPattern.test(resumeText)) {
            extractedSkills.push(skill);
        }
    });

    return extractedSkills;
}



function calculateMarksConsistency(resumeFile) {
    const resumeText = resumeFile.toString();

    // Define a regular expression pattern to match marks or grades
    const marksRegex = /\b(\d{1,3}(\.\d{1,2})?%?|\d{1,2}\/\d{1,2}|\d{1,2}\s?(?:out of)?\s?\d{1,3})\b/g;

    // Extract all matches of marks or grades from the resume text
    const matches = resumeText.match(marksRegex);

    // Calculate the marks consistency based on the number of matches
    const consistency = matches ? (matches.length / 10) * 100 : 0;

    // Return the marks consistency as a percentage
    //return "High";
    return consistency;
}


const extractCity = (resumeData) => {
    const cityPattern = /([\w\s]+),?\s*(\w{2,})/;

    const cityMatch = resumeData.match(cityPattern);

    if (cityMatch && cityMatch.length >= 3) {
        const cityName = cityMatch[1].trim();
        const stateCode = cityMatch[2].trim();

        // Exclude the name if it is captured along with the city
        const excludedWords = ['Name', 'Address', 'Contact'];
        const cityNameParts = cityName.split(' ').filter((part) => !excludedWords.includes(part));
        const formattedCity = cityNameParts.join(' ');

        return `${formattedCity}, ${stateCode}`;
    }

    return null;
};





export default parseResume;


