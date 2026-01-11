import jwt from "jsonwebtoken";

const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export default sendToken;
