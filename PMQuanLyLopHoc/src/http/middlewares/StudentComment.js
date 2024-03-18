const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const { commentId } = req.body;
  const { classId } = req.params;
  const comment = await Comment.findByPk(commentId);

  if (comment.title === req.user.name) {
    next();
  } else {
    res.redirect(`/student/class/${classId}/comment`);
  }
};
