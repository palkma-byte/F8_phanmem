const {
  Class,
  User,
  LearningStatus,
  StudentsClass,
  StudentsAttendance,
  Exercise,
} = require("../../../models");
var moment = require("moment");
const markdownit = require("markdown-it");
const md = markdownit();
const { Comment } = require("../../../models");
async function findAllCommentsWithReplies(classId) {
  const allComments = [];

  // Find all top-level comments (comments without parent)
  const topLevelComments = await Comment.findAll({
    where: { parentId: null, classId: classId }, // Assuming parentId is the foreign key for the parent comment
  });

  // Define async function to find replies recursively
  async function findReplies(comment) {
    const replies = await comment.getReply();

    // If the comment has replies, iterate through each reply and recursively find their replies
    for (const reply of replies) {
      await findReplies(reply); // Recursively find replies for this reply
    }

    // Attach replies to the parent comment
    comment.reply = replies;

    // Child comments won't be added directly to the allComments array
    // Only top-level comments will be added
    if (!comment.parentId) {
      allComments.push(comment);
    }
  }

  // Iterate through each top-level comment and find its replies
  for (const comment of topLevelComments) {
    await findReplies(comment);
  }
  return allComments;
}
module.exports = {
  home: (req, res) => {
    res.render("teacher/home", { layout: "layout/teacher.layout.ejs" });
  },
  class: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      const classes = await user.getClasses();
      res.render("teacher/class/class", {
        classes,
        moment,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      res.render("error");
    }
  },
  studentDetail: async (req, res) => {
    try {
      const classId = req.params.id;
      const classInfo = await Class.findByPk(classId);
      const studentDetail = await StudentsClass.findAll({
        where: { classId: classId },
        include: [User, LearningStatus],
      });

      res.render("teacher/class/student-detail", {
        classInfo,
        studentDetail,
        moment,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateStudentDetail: async (req, res) => {
    try {
      const studentId = req.query.studentId;
      const classId = req.params.id;
      const studentDetail = await StudentsClass.findOne({
        where: { studentId: studentId, classId: classId },
        include: [User, LearningStatus],
      });
      const learningStatuses = await LearningStatus.findAll();
      res.render("teacher/class/update-student-detail", {
        studentDetail,
        learningStatuses,
        moment,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateStudentDetail: async (req, res) => {
    const classId = req.params.id;
    const user = await User.findOne({ where: { name: req.body.studentName } });
    const { learningStatus, completedDate, dropDate, recoverDate } = req.body;
    const validateAndFormatDate = (dateString) => {
      return !isNaN(new Date(dateString).getTime()) ? dateString : null;
    };

    const formattedCompletedDate = validateAndFormatDate(completedDate);
    const formattedDropDate = validateAndFormatDate(dropDate);
    const formattedRecoverDate = validateAndFormatDate(recoverDate);
    await StudentsClass.update(
      {
        statusId: learningStatus,
        completedDate: formattedCompletedDate,
        dropDate: formattedDropDate,
        recover: formattedRecoverDate,
      },
      {
        where: { studentId: user.id, classId: classId },
      }
    );
    console.log(req.body);
    res.redirect("/teacher/class/manage-student/" + classId);
  },
  checkAttendance: async (req, res) => {
    let classSchedule = [];
    const classId = req.params.id;
    try {
      const attendedList = await StudentsAttendance.findAll({
        where: { classId: classId, status: 1 },
      });
      const classValue = await Class.findByPk(classId);
      const students = await classValue.getStudent();
      classValue.schedule.split(", ").forEach((weekdays) => {
        function getWeekdaysInRange(startDate, endDate, dayOfWeek) {
          var weekdays = [];
          var currentDate = new Date(startDate);
          var startDate = new Date(startDate);
          var endDate = new Date(endDate);

          // Convert weekday to JavaScript's day numbering (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
          var targetWeekday; // Adjusting to match JavaScript's day numbering
          switch (dayOfWeek) {
            case "Sunday":
              targetWeekday = 0;
              break;
            case "Monday":
              targetWeekday = 1;
              break;
            case "Tuesday":
              targetWeekday = 2;
              break;
            case "Wednesday":
              targetWeekday = 3;
              break;
            case "Thursday":
              targetWeekday = 4;
              break;
            case "Friday":
              targetWeekday = 5;
              break;
            case "Saturday":
              targetWeekday = 6;
              break;
          }

          // Iterate through each day within the range
          while (currentDate <= endDate) {
            // Check if the current day matches the target weekday
            if (currentDate.getDay() === targetWeekday) {
              // If it's the target weekday, add it to the array
              weekdays.push(new Date(currentDate));
            }
            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return weekdays;
        }

        classSchedule.push(
          ...getWeekdaysInRange(
            classValue.startDate,
            classValue.endDate,
            weekdays
          )
        );
      });
      const today = new Date();
      classSchedule.sort((date1, date2) => date1 - date2);
      console.log(attendedList);
      res.render("teacher/class/attendance", {
        classSchedule,
        moment,
        students,
        today,
        attendedList,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  saveCheckAttendance: async (req, res) => {
    try {
      const classId = req.params.id;
      Object.keys(req.body).forEach(async (data) => {
        const [attendance, created] = await StudentsAttendance.findOrCreate({
          where: {
            dateLearning: JSON.parse(data).date,
            studentId: JSON.parse(data).studentId,
            classId: classId,
          },
          defaults: {
            dateLearning: JSON.parse(data).date,
            studentId: JSON.parse(data).studentId,
            classId: classId,
            status: 1,
          },
        });
      });
      res.redirect("/teacher/class/attendance/" + classId);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  exercise: async (req, res) => {
    try {
      const classId = req.params.classId;
      const exercises = await Exercise.findAll({ where: { classId: classId } });
      res.render("teacher/class/exercise", {
        exercises,
        classId,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      res.render("error");
    }
  },
  handleCreateExercise: async (req, res) => {
    try {
      const { classId } = req.params;
      const { exerciseTitle, exerciseContent, exerciseAttachment } = req.body;
      await Exercise.create({
        classId: classId,
        title: exerciseTitle,
        content: exerciseContent,
        attachment: exerciseAttachment,
      });
      res.redirect("/teacher/class/exercise/" + classId);
    } catch (error) {
      res.render("error");
    }
  },
  handleUpdateExercise: async (req, res) => {
    try {
      const { classId, exerciseId } = req.params;
      const {
        updatedExerciseTitle,
        updatedExerciseContent,
        updatedExerciseAttachment,
      } = req.body;
      await Exercise.update(
        {
          title: updatedExerciseTitle,
          content: updatedExerciseContent,
          attachment: updatedExerciseAttachment,
        },
        { where: { id: exerciseId } }
      );
      res.redirect("/teacher/class/exercise/" + classId);
    } catch (error) {
      res.render("error");
    }
  },
  handleDeleteExercise: async (req, res) => {
    try {
      const { classId, exerciseId } = req.params;

      await Exercise.destroy({
        where: { id: exerciseId },
      });
      res.redirect("/teacher/class/exercise/" + classId);
    } catch (error) {
      res.render("error");
    }
  },
  checkSubmit: async (req, res) => {
    const { classId, exerciseId } = req.params;

    const exercise = await Exercise.findByPk(exerciseId, {
      include: { association: "Submit", include: User },
    });
    const submissions = exercise.Submit;
    res.render("teacher/class/submited", {
      submissions,
      moment,
      classId,
      layout: "layout/teacher.layout.ejs",
    });
  },
  comment: async (req, res) => {
    try {
      const { classId } = req.params;
      const allComments = await findAllCommentsWithReplies(classId);
      res.render("teacher/class/comment", {
        allComments,
        classId,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handlePost: async (req, res) => {
    try {
      const { comment } = req.body;
      const { classId } = req.params;
      await Comment.create({
        classId: classId,
        content: md.render(comment),
        attachment: JSON.stringify(req.file),
        title: req.user.name,
      });
      res.redirect(`/teacher/class/${classId}/comment`);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handlePostReply: async (req, res) => {
    try {
      console.log(req.body);
      const { classId } = req.params;
      await Comment.create({
        content: md.render(req.body.reply),
        title: req.user.name,
        parentId: req.body.parentId,
      });
      res.redirect(`/teacher/class/${classId}/comment`);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdate: async (req, res) => {
    try {
      const { classId } = req.params;
      const { updatedComment, commentId } = req.body;
      await Comment.update(
        {
          content: md.render(updatedComment),
        },
        { where: { id: commentId } }
      );
      res.redirect(`/teacher/class/${classId}/comment`);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleDelete: async (req, res) => {
    try {
      const { classId } = req.params;
      const { commentId } = req.body;
      await Comment.destroy({ where: { id: commentId } });
      res.redirect(`/teacher/class/${classId}/comment`);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
};
