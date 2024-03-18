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
  const a = await Class.findByPk(5, {
    include: {
      model: Course,
      include: {
        model: CourseModule,
        as: "Module",
        include: { model: ModuleDocument, as: "documents" }, // Use the alias 'documents'
      },
    },
  });
  console.log(a.Course.Module[0].documents);
}
//kkkkkk
test();
