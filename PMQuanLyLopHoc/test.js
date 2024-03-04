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
} = require("./src/models");
const { Op } = require("sequelize");
async function test() {
  const a = await User.findByPk(3);
  await a.removeRole(1);
}
test();
