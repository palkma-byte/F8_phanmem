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
  ExercisesSubmit,
  Exercise,
} = require("./src/models");
const { Op } = require("sequelize");
async function test() {
  const classInfo = await Class.findByPk(5);
  const user = await User.findByPk(3);
  console.log(await classInfo.hasTeacher(user));
}
//kkkkkk
test();
