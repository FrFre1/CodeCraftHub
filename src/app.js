/**
 * CodeCraftHub - Simple Express REST API
 * --------------------------------------
 * Features:
 * - CRUD operations for courses
 * - Stores data in a JSON file
 * - No database needed
 * - Beginner-friendly comments
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Path to the JSON file that stores course data
const dataFilePath = path.join(__dirname, "courses.json");

/**
 * Ensure the JSON file exists.
 * If it does not exist, create it automatically with an empty array.
 */
function ensureDataFileExists() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
      console.log("courses.json created automatically.");
    }
  } catch (error) {
    console.error("Error creating courses.json:", error.message);
  }
}

/**
 * Read all courses from the JSON file.
 * Returns an array of courses.
 */
function readCourses() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read courses file: ${error.message}`);
  }
}

/**
 * Write updated courses back to the JSON file.
 */
function writeCourses(courses) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(courses, null, 2));
  } catch (error) {
    throw new Error(`Failed to write courses file: ${error.message}`);
  }
}

/**
 * Validate the course status value.
 */
function isValidStatus(status) {
  const validStatuses = ["Not Started", "In Progress", "Completed"];
  return validStatuses.includes(status);
}

/**
 * Validate target_date format YYYY-MM-DD
 */
function isValidDateFormat(dateString) {
  // Simple regex to verify format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}

/**
 * Root route
 */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CodeCraftHub API",
    endpoints: {
      createCourse: "POST /api/courses",
      getAllCourses: "GET /api/courses",
      getCourseById: "GET /api/courses/:id",
      updateCourse: "PUT /api/courses/:id",
      deleteCourse: "DELETE /api/courses/:id",
    },
  });
});

/**
 * GET /api/courses
 * Return all courses
 */
app.get("/api/courses", (req, res) => {
  try {
    const courses = readCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/courses/:id
 * Return a single course by ID
 */
app.get("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const courseId = parseInt(req.params.id);

    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/courses
 * Create a new course
 */
app.post("/api/courses", (req, res) => {
  try {
    const { name, description, target_date, status } = req.body;

    // Check required fields
    if (!name || !description || !target_date || !status) {
      return res.status(400).json({
        message:
          "Missing required fields: name, description, target_date, status",
      });
    }

    // Validate status
    if (!isValidStatus(status)) {
      return res.status(400).json({
        message:
          'Invalid status value. Must be one of: "Not Started", "In Progress", or "Completed"',
      });
    }

    // Validate date format
    if (!isValidDateFormat(target_date)) {
      return res.status(400).json({
        message: "Invalid target_date format. Use YYYY-MM-DD",
      });
    }

    const courses = readCourses();

    // Auto-generate ID starting from 1
    const newId =
      courses.length > 0 ? Math.max(...courses.map((course) => course.id)) + 1 : 1;

    // Auto-generate created_at timestamp
    const newCourse = {
      id: newId,
      name,
      description,
      target_date,
      status,
      created_at: new Date().toISOString(),
    };

    courses.push(newCourse);
    writeCourses(courses);

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/courses/:id
 * Update a course by ID
 */
app.put("/api/courses/:id", (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { name, description, target_date, status } = req.body;

    const courses = readCourses();
    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate required fields for update
    if (!name || !description || !target_date || !status) {
      return res.status(400).json({
        message:
          "Missing required fields: name, description, target_date, status",
      });
    }

    // Validate status
    if (!isValidStatus(status)) {
      return res.status(400).json({
        message:
          'Invalid status value. Must be one of: "Not Started", "In Progress", or "Completed"',
      });
    }

    // Validate date format
    if (!isValidDateFormat(target_date)) {
      return res.status(400).json({
        message: "Invalid target_date format. Use YYYY-MM-DD",
      });
    }

    // Update the existing course
    courses[courseIndex] = {
      ...courses[courseIndex],
      name,
      description,
      target_date,
      status,
    };

    writeCourses(courses);

    res.status(200).json({
      message: "Course updated successfully",
      course: courses[courseIndex],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/courses/:id
 * Delete a course by ID
 */
app.delete("/api/courses/:id", (req, res) => {
  try {
    const courseId = parseInt(req.params.id);

    const courses = readCourses();
    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return res.status(404).json({ message: "Course not found" });
    }

    const deletedCourse = courses.splice(courseIndex, 1)[0];
    writeCourses(courses);

    res.status(200).json({
      message: "Course deleted successfully",
      course: deletedCourse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Catch-all route for undefined endpoints
 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/**
 * Start the server
 */
ensureDataFileExists();

app.listen(PORT, () => {
  console.log(`CodeCraftHub API is running on http://localhost:${PORT}`);
});