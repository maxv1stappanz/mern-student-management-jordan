
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("../server/models/Student");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Reuse the MongoDB connection in serverless deployments
let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// GET - Display students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Add student
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create({
      name: req.body.name,
      course: req.body.course,
      age: req.body.age,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Remove student
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update student
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        course: req.body.course,
        age: req.body.age,
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
