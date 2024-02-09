const {
  User,
  Class,
  Course,
  LearningStatus,
  StudentsClass,
} = require("./src/models");

async function test() {
  const abc = await Class.findByPk(6);
  console.log(new Date(abc.timeLearn + " " + abc.startDate));
}

test();
