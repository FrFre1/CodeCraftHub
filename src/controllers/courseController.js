const { readCourses, writeCourses } = require("../utils/fileHelper");

// Get all courses
function getAllCourses(req, res) {
  const courses = readCourses();
  res.status(200).json(courses);
}

// Get a single course by ID
function getCourseById(req, res) {
  const courses = readCourses();
  const courseId = parseInt(req.params.id);

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.status(200).json(course);
}

// Create a new course
function createCourse(req, res) {
  const { name, description, targetCompletionDate, status } = req.body;

  if (!name || !description || !targetCompletionDate || !status) {
    return res.status(400).json({
      message:
        "All fields are required: name, description, targetCompletionDate, status",
    });
  }

  const validStatuses = ["Not Started", "In Progress", "Completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  const courses = readCourses();

  const newId =
    courses.length > 0 ? Math.max(...courses.map((course) => course.id)) + 1 : 1;

  const newCourse = {
    id: newId,
    name,
    description,
    targetCompletionDate,
    status,
  };

  courses.push(newCourse);
  writeCourses(courses);

  res.status(201).json({
    message: "Course created successfully",
    course: newCourse,
  });
}

// Update a course
function updateCourse(req, res) {
  const courseId = parseInt(req.params.id);
  const { name, description, targetCompletionDate, status } = req.body;

  const courses = readCourses();
  const courseIndex = courses.findIndex((c) => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({ message: "Course not found" });
  }

  const validStatuses = ["Not Started", "In Progress", "Completed"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  courses[courseIndex] = {
    ...courses[courseIndex],
    ...(name && { name }),
    ...(description && { description }),
    ...(targetCompletionDate && { targetCompletionDate }),
    ...(status && { status }),
  };

  writeCourses(courses);

  res.status(200).json({
    message: "Course updated successfully",
    course: courses[courseIndex],
  });
}

// Delete a course
function deleteCourse(req, res) {
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
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};