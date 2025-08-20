import { Department, Course, SchoolYear, Semester, Subject } from './database';

export const seedInitialData = async () => {
    try {
        console.log('🌱 Seeding initial data...');

        // Create departments
        await Department.bulkCreate([
            { id: 1, code: 'CIT', name: 'College of Information Technology', description: 'Computer and IT programs', isActive: true },
            { id: 2, code: 'CBE', name: 'College of Business and Economics', description: 'Business and economics programs', isActive: true },
            { id: 3, code: 'CAS', name: 'College of Arts and Sciences', description: 'Liberal arts and sciences programs', isActive: true }
        ], { updateOnDuplicate: ['code', 'name'] });
        console.log('✅ Departments created');

        // Create courses
        await Course.bulkCreate([
            { id: 1, code: 'BSIT', name: 'Bachelor of Science in Information Technology', departmentId: 1, totalUnits: 144, duration: 4, level: 'Undergraduate', isActive: true },
            { id: 2, code: 'BSCS', name: 'Bachelor of Science in Computer Science', departmentId: 1, totalUnits: 144, duration: 4, level: 'Undergraduate', isActive: true },
            { id: 3, code: 'BSBA', name: 'Bachelor of Science in Business Administration', departmentId: 2, totalUnits: 144, duration: 4, level: 'Undergraduate', isActive: true }
        ], { updateOnDuplicate: ['code', 'name'] });
        console.log('✅ Courses created');

        // Transcribed from the provided curriculum image for the BSIT course (courseId: 1)
        const bsitSubjects = [
            // 1st Year, 1st Semester
            { code: 'IT 110', description: 'Introduction to Computing', units: 3, courseId: 1, yearLevel: 1, semester: 1 },
            { code: 'PC 110', description: 'PC Assembly & Troubleshooting', units: 3, courseId: 1, yearLevel: 1, semester: 1 },
            { code: 'PATHFIT 1', description: 'Movement Competency Training', units: 2, courseId: 1, yearLevel: 1, semester: 1 },
            { code: 'Fil 1', description: 'Wikang Filipino', units: 3, courseId: 1, yearLevel: 1, semester: 1 },
            { code: 'NSTP 1', description: 'National Service Training Prog. 1', units: 3, courseId: 1, yearLevel: 1, semester: 1 },
            { code: 'MathWorld', description: 'Math in the Modern World', units: 3, courseId: 1, yearLevel: 1, semester: 1 },
            { code: 'PhilPop', description: 'Readings in Philippine History', units: 3, courseId: 1, yearLevel: 1, semester: 1 },

            // 1st Year, 2nd Semester
            { code: 'IT 121', description: 'Computer Programming 1', units: 3, courseId: 1, yearLevel: 1, semester: 2 },
            { code: 'IT 122', description: 'Discrete Mathematics', units: 3, courseId: 1, yearLevel: 1, semester: 2 },
            { code: 'Fil 2', description: 'Panitikan ng Pilipinas', units: 3, courseId: 1, yearLevel: 1, semester: 2 },
            { code: 'PATHFIT 2', description: 'Exercise-based Fitness Activities', units: 2, courseId: 1, yearLevel: 1, semester: 2 },
            { code: 'NSTP 2', description: 'National Service Training Prog. 2', units: 3, courseId: 1, yearLevel: 1, semester: 2 },
            { code: 'Ethics', description: 'Ethics', units: 3, courseId: 1, yearLevel: 1, semester: 2 },
            { code: 'STS', description: 'Science, Technology & Society', units: 3, courseId: 1, yearLevel: 1, semester: 2 },

            // 1st Year, Summer
            { code: 'IT 131', description: 'Information Management', units: 3, courseId: 1, yearLevel: 1, semester: 3 },
            { code: 'IT 132', description: 'Platform Technologies (Tangible)', units: 3, courseId: 1, yearLevel: 1, semester: 3 },

            // 2nd Year, 1st Semester
            { code: 'IT 210', description: 'Data Structures & Algorithms', units: 4, courseId: 1, yearLevel: 2, semester: 1 },
            { code: 'IT 211', description: 'Platform Technologies 2', units: 3, courseId: 1, yearLevel: 2, semester: 1 },
            { code: 'IT 212', description: 'Web Systems & Technologies 1', units: 2, courseId: 1, yearLevel: 2, semester: 1 },
            { code: 'IT 213', description: 'Intro. to Human Computer Interaction', units: 3, courseId: 1, yearLevel: 2, semester: 1 },
            { code: 'ArtApp', description: 'Art Appreciation', units: 3, courseId: 1, yearLevel: 2, semester: 1 },
            { code: 'PATHFIT 3', description: 'Sports', units: 2, courseId: 1, yearLevel: 2, semester: 1 },
            { code: 'STAT', description: 'Statistics', units: 3, courseId: 1, yearLevel: 2, semester: 1 },

            // 2nd Year, 2nd Semester
            { code: 'IT 220', description: 'Object Oriented Programming', units: 3, courseId: 1, yearLevel: 2, semester: 2 },
            { code: 'IT 221', description: 'Networking 1', units: 3, courseId: 1, yearLevel: 2, semester: 2 },
            { code: 'IT 222', description: 'Systems Analysis & Design', units: 3, courseId: 1, yearLevel: 2, semester: 2 },
            { code: 'IT 223', description: 'Human Computer Interaction 2', units: 3, courseId: 1, yearLevel: 2, semester: 2 },
            { code: 'IT 224', description: 'Fundamentals of Database Systems', units: 3, courseId: 1, yearLevel: 2, semester: 2 },
            { code: 'PATHFIT 4', description: 'Dance', units: 2, courseId: 1, yearLevel: 2, semester: 2 },
            { code: 'Rizal', description: 'Rizal\'s Life & Works', units: 3, courseId: 1, yearLevel: 2, semester: 2 },
            
            // 2nd Year, Summer
            { code: 'IT 230', description: 'Quantitative Methods', units: 3, courseId: 1, yearLevel: 2, semester: 3 },
            { code: 'Techno', description: 'Technopreneurship', units: 3, courseId: 1, yearLevel: 2, semester: 3 },
            { code: 'PhLIT', description: 'The Philippine Society in the I.T. Era', units: 3, courseId: 1, yearLevel: 2, semester: 3 },

            // 3rd Year, 1st Semester
            { code: 'IT 310', description: 'Applications Devt. & Emerging Technologies', units: 2, courseId: 1, yearLevel: 3, semester: 1 },
            { code: 'IT 311', description: 'Networking 2', units: 3, courseId: 1, yearLevel: 3, semester: 1 },
            { code: 'IT 312', description: 'Integrative Prog. & Tech. 1', units: 3, courseId: 1, yearLevel: 3, semester: 1 },
            { code: 'IT 313', description: 'Web Systems & Technologies 2', units: 3, courseId: 1, yearLevel: 3, semester: 1 },
            { code: 'IT 314', description: 'Advanced Database Systems', units: 3, courseId: 1, yearLevel: 3, semester: 1 },
            
            // 3rd Year, 2nd Semester
            { code: 'IT 320', description: 'Systems Integration & Architecture 1', units: 2, courseId: 1, yearLevel: 3, semester: 2 },
            { code: 'IT 321', description: 'Information Assurance & Security 1', units: 3, courseId: 1, yearLevel: 3, semester: 2 },
            { code: 'IT 322', description: 'Integrative Prog. & Tech. 2', units: 2, courseId: 1, yearLevel: 3, semester: 2 },
            { code: 'IT 323', description: 'Social & Professional Issues', units: 2, courseId: 1, yearLevel: 3, semester: 2 },
            { code: 'IT 324', description: 'Event Driven Programming', units: 3, courseId: 1, yearLevel: 3, semester: 2 },

            // 3rd Year, Summer
            { code: 'IT 330', description: 'Capstone Project 1', units: 2, courseId: 1, yearLevel: 3, semester: 3 },
            { code: 'IT 331', description: 'Information Assurance & Security 2', units: 3, courseId: 1, yearLevel: 3, semester: 3 },
            
            // 4th Year, 1st Semester
            { code: 'IT 410', description: 'Systems Administration & Maint.', units: 3, courseId: 1, yearLevel: 4, semester: 1 },
            { code: 'IT 411', description: 'Current Trends in Changing Tech. 2', units: 3, courseId: 1, yearLevel: 4, semester: 1 },
            { code: 'IT 412', description: 'Capstone Project 2', units: 3, courseId: 1, yearLevel: 4, semester: 1 },
            
            // 4th Year, 2nd Semester
            { code: 'IT 420', description: 'Seminars & Tours', units: 3, courseId: 1, yearLevel: 4, semester: 2 },
            { code: 'OJT', description: 'Practicum (500 Hours of On-the-Job Training in related field)', units: 6, courseId: 1, yearLevel: 4, semester: 2 },
        ];
        
        await Subject.bulkCreate(bsitSubjects, { ignoreDuplicates: true });
        console.log('BSIT Subjects created');

        // Create school years
        await SchoolYear.bulkCreate([
            { year: '2024-2025', description: 'Academic Year 2024-2025', startDate: new Date('2024-08-19'), endDate: new Date('2025-06-06'), isCurrent: true, isActive: true },
            { year: '2023-2024', description: 'Academic Year 2023-2024', startDate: new Date('2023-08-14'), endDate: new Date('2024-05-31'), isCurrent: false, isActive: true }
        ], { ignoreDuplicates: true });
        console.log('✅ School years created');

        // Create semesters
        await Semester.bulkCreate([
            { name: 'First Semester', code: '1ST', description: 'First semester of the academic year', startDate: new Date('2024-08-19'), endDate: new Date('2024-12-20'), isActive: true },
            { name: 'Second Semester', code: '2ND', description: 'Second semester of the academic year', startDate: new Date('2025-01-13'), endDate: new Date('2025-06-06'), isActive: true },
            { name: 'Summer', code: 'SUM', description: 'Summer semester', startDate: new Date('2025-06-16'), endDate: new Date('2025-07-25'), isActive: true }
        ], { ignoreDuplicates: true });
        console.log('✅ Semesters created');

        console.log('🎉 Initial data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
    }
};