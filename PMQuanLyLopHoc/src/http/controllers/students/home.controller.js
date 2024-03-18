const {
  Course,
  Class,
  User,
  StudentsAttendance,
  Exercise,
  ExercisesSubmit,
  CourseModule,
  ModuleDocument,
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
  home: async (req, res) => {
    try {
      const courses = await Course.findAll();
      res.render("student/home", {
        courses,
        layout: "layout/student.layout.ejs",
      });
    } catch (error) {
      res.render("error");
    }
  },
  classJoined: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      console.log(user);
      const classes = await user.getClassStudent();
      res.render("student/class-participated", {
        classes,
        layout: "layout/student.layout.ejs",
      });
    } catch (error) {
      res.render("error");
    }
  },
  comment: async (req, res) => {
    try {
      const name = req.user.name;
      const { classId } = req.params;
      const allComments = await findAllCommentsWithReplies(classId);
      res.render("student/comment", {
        name,
        allComments,
        classId,
        layout: "layout/student.layout.ejs",
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
      res.redirect(`/student/class/${classId}/comment`);
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
      res.redirect(`/student/class/${classId}/comment`);
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
      res.redirect(`/student/class/${classId}/comment`);
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
      res.redirect(`/student/class/${classId}/comment`);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  attendance: async (req, res) => {
    let classSchedule = [];
    const classId = req.params.classId;
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
      res.render("student/attendance", {
        classSchedule,
        moment,
        students,
        today,
        attendedList,
        layout: "layout/student.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  homework: async (req, res) => {
    try {
      const classId = req.params.classId;
      const exercises = await Exercise.findAll({
        where: { classId: classId },
        include: {
          association: "Submit",
          include: {
            model: User,
            where: { id: req.user.id },
          },
        },
      });
      let submittedAssignments = [];
      let notSubmittedAssignments = [];
      console.log(exercises);
      exercises.forEach((exercise) => {
        if (exercise.Submit.length) {
          submittedAssignments.push(exercise);
        } else {
          notSubmittedAssignments.push(exercise);
        }
      });

      res.render("student/homework", {
        submittedAssignments,
        notSubmittedAssignments,
        classId,
        layout: "layout/student.layout.ejs",
      });
    } catch (error) {
      res.render("error");
    }
  },
  submitHomework: async (req, res) => {
    try {
      const { assignmentId, content, attachment } = req.body;
      const { classId } = req.params;
      await ExercisesSubmit.findOrCreate({
        where: { studentId: req.user.id, exerciseId: assignmentId },
        defaults: {
          content: content,
          attachment: attachment,
        },
      });

      res.redirect(`/student/class/homework/${classId}`);
    } catch (error) {
      res.render("error");
    }
  },
  updateHomework: async (req, res) => {
    try {
      const { classId } = req.params;
      console.log(req.body);
      const { submitId, assignmentId, content, attachment } = req.body;
      await ExercisesSubmit.update(
        { content: content, attachment: attachment },
        {
          where: {
            id: submitId,
            exerciseId: assignmentId,
            studentId: req.user.id,
          },
        }
      );
      res.redirect(`/student/class/homework/${classId}`);
    } catch (error) {
      res.render("error");
    }
  },
  document: async (req, res) => {
    const { classId } = req.params;
    const classInfo = await Class.findByPk(classId, {
      include: {
        model: Course,
        include: {
          model: CourseModule,
          as: "Module",
          include: { model: ModuleDocument, as: "documents" }, // Use the alias 'documents'
        },
      },
    });
    res.render("student/document", {
      classInfo,
      layout: "layout/student.layout.ejs",
    });
  },
};
