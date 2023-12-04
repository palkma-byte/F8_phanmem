const bcrypt = require("bcrypt");
const transporter = require("../../../utils/transporter");
const { User, LoginToken, UserOtp } = require("../../../models");
const md5 = require("md5");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

module.exports = {
  login: (req, res) => {
    const flashMsg = req.flash("error")[0];
    const successMsg = req.flash("success")[0];
    res.render("auth/login", {
      successMsg,
      flashMsg,
      layout: "layout/auth.layout.ejs",
    });
  },
  handleLogin: async (req, res) => {
    const token = md5(Date.now() + Math.random());
    await LoginToken.destroy({ where: { userId: req.user.id } });
    await LoginToken.create({ userId: req.user.id, token: token });
    res.cookie("lgt", token);
    switch (req.user.typeId) {
      case 1:
        res.redirect("/student");
        break;
      case 2:
        res.redirect("/teacher");
        break;
      case 3:
        res.redirect("/admin");
        break;
      default:
        res.redirect("/");
        break;
    }
    //res.redirect("/admin");
  },
  register: (req, res) => {
    res.render("auth/register", { layout: "layout/auth.layout.ejs" });
  },
  handleRegister: async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    try {
      const user = await User.create({
        name: name,
        email: email,
        password: hash,
        phone: phone,
        address: address,
        typeId: 1,
        firstLogin: 0,
      });
      await UserOtp.create({
        userId: user.id,
        otp: otp,
        expires: Date.now() + 2000 * 60,
      });
    } catch (error) {
      req.flash("error", "Dang ky khong thanh cong");
    }
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Email xac thuc tai khoan",
      html: `Ma xac thuc cua ban la ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    res.redirect("verify");
  },
  verify: (req, res) => {
    res.render("auth/verification", { layout: "layout/auth.layout.ejs" });
  },
  handleVerify: async (req, res) => {
    const userOtp = await UserOtp.findOne({ where: { otp: req.body.otp } });
    if (!userOtp) {
      req.flash("error", "Otp khong hop le");
    } else if (userOtp.expires < Date.now()) {
      req.flash("error", "Otp da het han");
    } else {
      await User.update({ firstLogin: 1 }, { where: { id: userOtp.userId } });
      await userOtp.destroy();
      req.flash("success", "Tai khoan kich hoat thanh cong!");
    }
    res.redirect("login");
  },
  newPassword: (req, res) => {
    res.render("auth/new-password", { layout: "layout/auth.layout.ejs" });
  },
  handleNewPassword: async (req, res) => {
    const token = req.params.token;

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash("error", "Xac nhan mat khau khong trung mat khau moi");
    } else {
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const email = decode.email;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        await User.update(
          { password: hash, firstLogin: 1 },
          { where: { email: email } }
        );
        req.flash("success", "Mat khau thay doi thanh cong");
      } catch (err) {
        req.flash("error", err.message);
      }
    }
    res.redirect("/auth/login");
  },
  recoverPassword: (req, res) => {
    res.render("auth/recover-password", { layout: "layout/auth.layout.ejs" });
  },
  handleRecoverPassword: async (req, res) => {
    const { email } = req.body;
    const checkEmail = await User.findOne({ where: { email: email } });
    if (!checkEmail) {
      req.flash("error", "Email chua duoc dang ky!");
    }
    var token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "2 min",
    });
    req.flash("success", "Email thay doi mat khau da duoc gui di!");
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Email thay doi mat khau",
      html: `Click vao link sau de chuyen den trang thay doi mat khau <a href="http://localhost:3001/auth/new-password/${token}">Click Here!</a> (Link se het han sau 2 phut)`,
    };
    const sendMail = await transporter.sendMail(mailOptions);

    res.redirect("login");
  },
  logout: async (req, res, next) => {
    await LoginToken.destroy({ where: { token: req.cookies.lgt } });
    res.clearCookie("lgt");
    req.logout(async (err) => {
      if (err) {
        next();
      }
      res.redirect("/auth/login");
    });
  },
  update: (req, res) => {
    const user = req.user;
    res.render("auth/account-setting", {
      user,
      layout: "layout/auth.layout.ejs",
    });
  },
  handleUpdate: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const { name, phone, address } = req.body;
    await user.update({ name: name, phone: phone, address: address });
    res.redirect("/");
  },
};
