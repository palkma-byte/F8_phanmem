const {
  User,
  Class,
  Course,
  LearningStatus,
  StudentsClass,
  StudentsAttendance,
  Comment,
} = require("./src/models");

async function test() {
  const a = await Comment.findByPk(35);
  console.log(await a.getReply());
}
