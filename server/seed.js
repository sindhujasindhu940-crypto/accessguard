const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Create 5 departments
    const departmentsData = [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Electrical Engineering', code: 'EE' },
      { name: 'Mechanical Engineering', code: 'ME' },
      { name: 'Civil Engineering', code: 'CE' },
      { name: 'Information Technology', code: 'IT' }
    ];

    await Department.deleteMany();
    const createdDepartments = await Department.insertMany(departmentsData);
    console.log('Departments Created');

    // Create 5 faculties
    const facultyData = createdDepartments.map((dept, index) => {
      const salt = bcrypt.genSaltSync(10);
      return {
        name: `Dr. Faculty ${index + 1}`,
        email: `faculty${index + 1}@college.edu`,
        password: bcrypt.hashSync('password123', salt),
        role: 'Faculty',
        department: dept._id,
        mobile: `987654321${index}`
      };
    });

    await User.deleteMany({ role: 'Faculty' });
    await User.insertMany(facultyData);
    console.log('Faculties Created');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
