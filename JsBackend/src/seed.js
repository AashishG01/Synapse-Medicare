import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import Doctor from "./models/doctor.model.js";
import Hospital from "./models/hospital.model.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Doctor.deleteMany({});
    await Hospital.deleteMany({});
    await User.deleteMany({});

    // Create hospital admin (also acts as hospital identity)
    const hospitalAdmin = await User.create({
      fullName: "Central City Hospital",
      email: "hospital@example.com",
      password: "Hospital@123", // will be hashed by pre-save hook
      role: "HOSPITAL_ADMIN",
      phone: "+1-555-1000",
      bloodGroup: "O+",
      location: { type: "Point", coordinates: [77.5946, 12.9716] }, // Bangalore coords
      address: {
        street: "100 Health St",
        city: "Bangalore",
        state: "KA",
        postalCode: "560001",
      },
    });

    // Mirror hospital doc with same _id so controller lookups by user id work
    await Hospital.create({
      _id: hospitalAdmin._id,
      name: hospitalAdmin.fullName,
      beds: {
        icu: { total: 10, occupied: 3 },
        general: { total: 40, occupied: 15 },
        emergency: { total: 8, occupied: 2 },
      },
    });

    // Create patient users (also donors)
    const patients = await User.create([
      {
        fullName: "Alice Doe",
        email: "alice@example.com",
        password: "Patient@123",
        role: "PATIENT",
        phone: "+1-555-2001",
        bloodGroup: "A+",
        location: { type: "Point", coordinates: [77.595, 12.972] },
        address: { street: "1 Main Rd", city: "Bangalore", state: "KA", postalCode: "560002" },
      },
      {
        fullName: "Bob Smith",
        email: "bob@example.com",
        password: "Patient@123",
        role: "PATIENT",
        phone: "+1-555-2002",
        bloodGroup: "O-",
        location: { type: "Point", coordinates: [77.60, 12.975] },
        address: { street: "2 Lake View", city: "Bangalore", state: "KA", postalCode: "560003" },
      },
      {
        fullName: "Carol Nguyen",
        email: "carol@example.com",
        password: "Patient@123",
        role: "PATIENT",
        phone: "+1-555-2003",
        bloodGroup: "B+",
        location: { type: "Point", coordinates: [77.59, 12.97] },
        address: { street: "3 Garden St", city: "Bangalore", state: "KA", postalCode: "560004" },
      },
    ]);

    // Create doctors belonging to the hospital
    // Create doctors belonging to the hospital
    const doctorUsers = await User.create([
      {
        fullName: "Dr. Priya Menon",
        email: "priya@example.com",
        password: "Doctor@123",
        role: "DOCTOR",
        location: { type: "Point", coordinates: [77.5946, 12.9716] },
      },
      {
        fullName: "Dr. Arjun Iyer",
        email: "arjun@example.com",
        password: "Doctor@123",
        role: "DOCTOR",
        location: { type: "Point", coordinates: [77.5946, 12.9716] },
      },
      {
        fullName: "Dr. Nisha Kapoor",
        email: "nisha@example.com",
        password: "Doctor@123",
        role: "DOCTOR",
        location: { type: "Point", coordinates: [77.5946, 12.9716] },
      }
    ]);

    await Doctor.create([
      {
        name: "Dr. Priya Menon",
        user: doctorUsers[0]._id,
        specialization: "Cardiology",
        qualifications: "MBBS, MD Cardiology",
        experienceYears: 12,
        hospital: hospitalAdmin._id,
        availableSlots: [
          new Date(Date.now() + 24 * 60 * 60 * 1000),
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        ],
        profileImage: "https://example.com/images/priya-menon.jpg",
      },
      {
        name: "Dr. Arjun Iyer",
        user: doctorUsers[1]._id,
        specialization: "Neurology",
        qualifications: "MBBS, DM Neurology",
        experienceYears: 9,
        hospital: hospitalAdmin._id,
        availableSlots: [
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        ],
        profileImage: "https://example.com/images/arjun-iyer.jpg",
      },
      {
        name: "Dr. Nisha Kapoor",
        user: doctorUsers[2]._id,
        specialization: "Pediatrics",
        qualifications: "MBBS, MD Pediatrics",
        experienceYears: 7,
        hospital: hospitalAdmin._id,
        availableSlots: [
          new Date(Date.now() + 24 * 60 * 60 * 1000),
          new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        ],
        profileImage: "https://example.com/images/nisha-kapoor.jpg",
      },
    ]);

    console.log("✅ Seed data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();

