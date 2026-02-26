const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Mock Data matching the database schema requirements
// NOTE: Make sure the department_id matches an actual ID from your departments table!
const mockStudents = [
    {
        roll_number: 'CSE26001',
        email: 'john.doe@example.com',
        department_id: 1, // Assuming CSE is 1
        current_cgpa: 8.5,
        active_backlogs: 0,
        tenth_marks: 85.5,
        twelfth_marks: 88.0
    },
    {
        roll_number: 'CSE26002',
        email: 'jane.smith@example.com',
        department_id: 1,
        current_cgpa: 9.2,
        active_backlogs: 0,
        tenth_marks: 92.0,
        twelfth_marks: 94.5
    },
    {
        roll_number: 'CSE26003',
        email: 'alice.jones@example.com',
        department_id: 1,
        current_cgpa: 7.8,
        active_backlogs: 1,
        tenth_marks: 78.0,
        twelfth_marks: 75.0
    },
    {
        roll_number: 'CSE26004',
        email: 'bob.brown@example.com',
        department_id: 1,
        current_cgpa: 6.5,
        active_backlogs: 2,
        tenth_marks: 70.0,
        twelfth_marks: 68.0
    },
    {
        roll_number: 'IT26001',
        email: 'charlie.davis@example.com',
        department_id: 2, // Assuming IT is 2
        current_cgpa: 8.9,
        active_backlogs: 0,
        tenth_marks: 89.5,
        twelfth_marks: 90.0
    }
];

// Create a new workbook
const workbook = xlsx.utils.book_new();

// Convert JSON data to a worksheet
const worksheet = xlsx.utils.json_to_sheet(mockStudents);

// Add the worksheet to the workbook
xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');

// Define the output file path (saving to Desktop for easy access)
const os = require('os');
const desktopPath = path.join(os.homedir(), 'Desktop', 'Mock_Students_Upload.xlsx');

// Write the file
xlsx.writeFile(workbook, desktopPath);

console.log(`✅ Successfully generated mock Excel file at: \n${desktopPath}`);
console.log('You can now upload this file in Postman to test the /students/upload endpoint.');
