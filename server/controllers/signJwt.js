import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_COOKIE_EXPIRES = 7 * 24 * 60 * 60 * 1000;

const signTokenAndSendCookie = (user, res) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, status: user.status },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  };
  return res.cookie("jwt", token, cookieOptions);
};
export default signTokenAndSendCookie;
