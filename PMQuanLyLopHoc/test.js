const {
  User,
  Class,
  Course,
  LearningStatus,
  StudentsClass,
} = require("./src/models");

async function test() {
  console.log(
    await StudentsClass.findAll({
      include: [
        { model: User, where: { id: 1 } },
        { model: LearningStatus },
        { model: Class },
      ],
    })
  );
}

test();
