var cron = require("node-cron");
const { QueueJob } = require("../src/models");
const SendMail = require("../src/jobs/SendMail");
cron.schedule("*/5 * * * * *", async () => {
  console.log("running a task every 5 sec");

  const jobId = await QueueJob.min("id");
  if (!jobId) {
    console.log("There is no task");
    return;
  }
  const priorityJob = await QueueJob.findByPk(jobId);
console.log(priorityJob);
  const {job} = JSON.parse(priorityJob.value).data;

  let count = 0;
  const maxFailedTime = 3;
  while (count < maxFailedTime) {
    try {
      new SendMail(job).handle();
      console.log(count);
      break;
    } catch (error) {
      count++;
    }
  }

  await QueueJob.destroy({ where: { id: jobId } });
});
// cron.schedule("* */2 * * * *", async () => {
//   console.log("Running another task every 2 sec");
// })