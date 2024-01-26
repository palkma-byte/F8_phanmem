const { User, Class, Course } = require("./src/models");


async function class1() {
  const class1 = await Class.findByPk(6);
  console.log(await class1.getTeacher());
}

class1();
