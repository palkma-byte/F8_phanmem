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
  const { count, rows } = await StudentsClass.findAndCountAll({
    where: { classId: 5 },
    include: [
      { model: User, where: { name: { [Op.substring]: "" } } },
      LearningStatus,
    ],
  });
  console.log(rows);
}
//kkkkkk
test();
