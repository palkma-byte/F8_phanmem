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
  const a = await Course.findByPk(3, {
    include: { model: CourseModule, include: { model: ModuleDocument } },
  });

  const b = await a.getModules(1);

  console.log(c);
}
//kkkkkk
test();
