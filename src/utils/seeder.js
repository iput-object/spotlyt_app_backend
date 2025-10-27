const mongoose = require("mongoose");
require("dotenv").config();
const { User } = require("../models");

const usersData = [
  {
    fullName: "Testing Admin",
    email: "admin@gmail.com",
    phoneNumber: "01735566789",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO", // password: 1qazxsw2
    role: "admin",
    isEmailVerified: true,
  },
  {
    fullName: "Testing Employee",
    email: "employee@gmail.com",
    phoneNumber: "01735566789",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "employee",
    isEmailVerified: true,
    isApproved: true,
  },
  {
    fullName: "Testing Employee 2",
    email: "employee2@gmail.com",
    phoneNumber: "01735566789",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "employee",
    isEmailVerified: true,
    isApproved: true,
  },
  
  {
    fullName: "Testing Client",
    email: "client@gmail.com",
    phoneNumber: "01734456873",
    dateOfBirth: "2000-06-22",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "client",
    isEmailVerified: true,
  },
  {
    fullName: "Testing Client 2",
    email: "client2@gmail.com",
    phoneNumber: "01734456873",
    dateOfBirth: "2000-06-22",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "client",
    isEmailVerified: true,
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("Database dropped successfully!");
  } catch (err) {
    console.error("Error dropping database:", err);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await dropDatabase();
  await seedUsers();
  console.log("Database seeding completed!");
  mongoose.disconnect();
};

seedDatabase();