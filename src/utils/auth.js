import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { loginValidation, registerValidation } from "./validation";
import { User } from "../resources/user/user.model";
import { Admin } from "../resources/admin/admin.model";

/*To be implemented : 
newToken
verifyToken
register
login
protect
*/

dotenv.config();

export const newToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.TOKEN, { expiresIn: "1h" });
};

export const register = async (req, res) => {
  // Pass user input for validation
  const userInput = req.body;
  const { error } = registerValidation(userInput);

  //Return error if invalid input
  if (error) {
    return res.status(400).send(error);
  }

  try {
    // Password hashing and salting
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedAdmin = await admin.save();
    res.status(201).send({
      success: true,
      data: `Admin: ${savedAdmin} has already been registered`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("SERVER ERROR");
  }
};

export const login = async (req, res) => {
  // validate user input
  const { error } = loginValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  // check credentials of user
  try {
    const userData = req.body;
    const savedAdmin = await Admin.findOne({ email: userData.email })
      .select("email password")
      .exec();

    if (!savedAdmin) {
      res.status(401).send("Email or password is invalid");
    }

    const comparePassword = await bcrypt.compare(
      userData.password,
      savedAdmin.password
    );

    if (!comparePassword) {
      res.status(400).send("Email or password is invalid");
    }

    //Assign a new token
    const token = newToken(userData);
    return res.status(200).json({
      success: true,
      token,
      expiresIn: "3600s",
      role: "admin",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER ERROR! Something is blow up",
    });
  }
};

export const join = async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData)
    const savedUser = await User.findOneAndReplace({ name: userData.name },{name:userData.name},{upsert:true}).lean().exec();
    // If there is no matched user in db, create a new one
    const token = await newToken(userData);
    return res.status(200).json({
      success: true,
      token,
      expiresIn: "3600s",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "SERVER ERROR! Something is blow up",
    });
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    console.log("No bearer");
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: error.message,
      });
    }
    res.status(500).end();
  }

 
};
