const {
  User,
  Class,
  Course,
  LearningStatus,
  StudentsClass,
  StudentsAttendance,
  Comment,
  Role,
  Permission,
  Type,
  CourseModule,
  ModuleDocument,
} = require("./src/models");
const { Op } = require("sequelize");
async function test() {
  const user = await User.findByPk(3);
  const classes = await user.getClasses();
  const coursesPromises = classes.map(async (classInfo) => {
    return await classInfo.getCourse();
  });

  const courses = await Promise.all(coursesPromises);

  console.log(courses);
}
//kkkkkk
test();
