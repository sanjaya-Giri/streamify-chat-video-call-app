import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idx = Math.random().toString(36).slice(2, 10);
    const randomAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`;


    const newUser = await User({
      fullName,
      email,
      password,
      profilePicture: randomAvatar,
    });
    await newUser.save();

    // Create Stream user
    try {
      await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePicture||"",
    })
    console.log(`stream user cretaed for ${newUser.fullName}`);
    
    } catch (error) {
      log("error in creating stream user",error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set secure flag in production
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function logout(req, res) {
  // Logout logic here
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully", success: true });
}

export async function onboard(req,res){
  try {
    const userId=req.user._id;
    const {fullName,bio,nativeLanguage,learningLanguages,location}=req.body;
    if(!fullName||!nativeLanguage||!learningLanguages||!location||!bio){
      return res.status(400).json({
        message:"All fields are required",
        missingFields:[
          !fullName && "fullName",
          !nativeLanguage && "nativeLanguage",
          !learningLanguages && "learningLanguages",
          !location && "location",
          !bio && "bio",
        ].filter(Boolean),
      });
    }
    const updatedUser=await User.findByIdAndUpdate(userId,{
     ...req.body,
      isOnboarded:true,
    },{new:true})

    if(!updatedUser){
      return res.status(404).json({message:"User not found"});
    }
    try {
      await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePicture||"",
    })
    } catch (error) {
      console.log("error in upserting stream user",error);
    }
    
    return res.status(200).json({
      message:"User onboarded successfully",
      success:true,
      user:updatedUser,
    });
  } catch (error) {
    console.log("error in onboarding",error);
    return res.status(500).json({message:"Internal server error"});
  }
}
