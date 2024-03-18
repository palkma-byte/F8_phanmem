const markdownit = require("markdown-it");
const md = markdownit();
const { Comment } = require("../../../models");
async function findAllCommentsWithReplies() {
  const allComments = [];

  // Find all top-level comments (comments without parent)
  const topLevelComments = await Comment.findAll({
    where: { parentId: null }, // Assuming parentId is the foreign key for the parent comment
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
  index: async (req, res) => {
    try {
      const allComments = await findAllCommentsWithReplies();
      res.render("admin/comment/comment", { allComments });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handlePost: async (req, res) => {
    try {
      const { comment } = req.body;

      await Comment.create({
        content: md.render(comment),
        attachment: JSON.stringify(req.file),
        title: req.user.name,
      });
      res.redirect("/admin/comment");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handlePostReply: async (req, res) => {
    try {
      await Comment.create({
        content: md.render(req.body.reply),
        title: req.user.name,
        parentId: req.body.parentId,
      });
      res.redirect("/admin/comment");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdate: async (req, res) => {
    try {
      const { updatedComment, commentId } = req.body;
      await Comment.update(
        {
          content: md.render(updatedComment),
        },
        { where: { id: commentId } }
      );
      res.redirect("/admin/comment");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleDelete: async (req, res) => {
    try {
      const { commentId } = req.body;
      await Comment.destroy({ where: { id: commentId } });
      res.redirect("/admin/comment");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
};
