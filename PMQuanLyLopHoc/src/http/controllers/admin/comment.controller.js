const markdownit = require("markdown-it");
const md = markdownit();
const { Comment } = require("../../../models");

module.exports = {
  index: async (req, res) => {
    try {
      const allComments = await Comment.findAll();

      res.render("admin/comment/comment", { allComments });
    } catch (error) {
      console.log(error);
      res.render("error")
    }
   
  },
  handlePost: async (req, res) => {
    try {
      const { comment } = req.body;
      console.log(req.file);
      await Comment.create({
        content: md.render(comment),
        attachment: JSON.stringify(req.file),
        title: req.user.name,
      });
      res.redirect("/admin/comment");
    } catch (error) {
      console.log(error);
      res.render("error")
    }
  
  },
};
