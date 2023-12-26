const { User, Class, Course } = require("./src/models");
async function getUser(user = "asd") {
  user = await User.findAll();
  console.log(user);
  return;
}

async function addClass() {
   const class1 = await Class.create({ name: "asdasd" });
  const user = await User.findAll()
   await class1.addTeacher(user);
  console.log(await class1.getTeacher());
}

async function course() {
  const course = await Course.findByPk(1);
  console.log(await course.getClasses());
}

async function class1() {
  const class1 = await Class.findByPk(6);
  console.log(await class1.getCourse());
}

class1();
