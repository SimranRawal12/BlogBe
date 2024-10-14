const userRouter = require("express").Router();
const db = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// db.User.findAll().then(
//   (users = () => {
//     console.log(users);
//   })
// );
userRouter.post("/SignUp", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
      if (password != confirmPassword) {
      return res.status(300).json({ message: "Password don't match" });
    }
    const exist = await db.User.findOne({ where: { email: email } });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if(firstName ==='' || email===''||password===''||confirmPassword===''){
      return res.status(500).json({ message: "Password don't match" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const createUser = await db.User.create({
      firstName,
      lastName,
      email,
      password: hashedPass,
    });
    if (createUser) {
      const token = jwt.sign(
        { userId: createUser?.dataValues?.id },
        "01234@Simran@",
        { expiresIn: "1h" }
      );
      res.status(200).json({ createUser, authToken: token });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


function authenticate(req, res, next) {
  try {
    var authHeader = req.headers["authorization"];
    jwt.verify(authHeader, "01234@Simran@", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
    next();
  } catch (err) {
    console.error("Error authenticating", err);
    res.status(500).json({ message: "Authentication Error" });
  }
}

userRouter.get("/getSignUp", authenticate, async (req, res) => {
  res.json("Success");
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await db.User.findOne({ where: { email } });
    if(email===''||password===''){
      return res.status(500).json({ message: "Input Fields Cant be empty" });
    }
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
   
    const match = await bcrypt.compare(password, hashedPass);
    if (!match) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = jwt.sign({ userId: user.id }, "01234@Simran@", {
      expiresIn: "1h",
    });
    res.json({ user, authToken: token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
