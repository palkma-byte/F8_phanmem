var cron = require("node-cron");
const { QueueJob } = require("../src/models");
const SendMail = require("../src/jobs/SendMail");
cron.schedule("*/5 * * * * *", async () => {
  const jobId = await QueueJob.min("id");
  if (!jobId) {
    return;
  }
  const priorityJob = await QueueJob.findByPk(jobId);

  const { job } = JSON.parse(priorityJob.value).data;

  let count = 0;
  const maxFailedTime = 3;
  while (count < maxFailedTime) {
    try {
      new SendMail(job).handle();

      break;
    } catch (error) {
      count++;
    }
  }

  await QueueJob.destroy({ where: { id: jobId } });
});
