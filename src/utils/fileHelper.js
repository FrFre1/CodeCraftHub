const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../data/courses.json");

function readCourses() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeCourses(courses) {
  fs.writeFileSync(filePath, JSON.stringify(courses, null, 2));
}

module.exports = {
  readCourses,
  writeCourses,
};