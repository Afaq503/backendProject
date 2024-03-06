import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
  // path: "./env" this is worng
});

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    console.log("userID ok:  ", userId);
    const user = await User.findById(userId);
    // console.log(`user in function generateAccessAndRefereshTokens:  ${user}`);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // console.log(`accessToken:  ${accessToken}`);
    // console.log(`refreshToken:  ${refreshToken}`);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // console.log(`user.refreshToken:  ${user.refreshToken}`);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went worng while generating refresh and access token"
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  //  get user details from frontend
  // validation -- not empty
  // check if user already exixts: username , email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from responce
  // check for user creation
  //  return res

  const { fullname, username, email, password } = req.body;
  // console.log(`email: ${email}`);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(`this is our avatar:  ${avatar}`);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went worng while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  // req body
  // email or username
  // find the user
  // password check
  // access and refresh token genrate
  // send cookie
  const { email, username, password } = req.body;
  console.log(`this is my email:  ${email}`);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Ensure the password is provided before attempting to validate it
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
    console.log(`User in fucation:  ${user._id}`)
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const opations = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, opations)
    .cookie("refreshToken", refreshToken, opations)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfuly"
      )
    );
});

const logoutUser = asynchandler(async (req, res) => {
  // clear cookies
  // clear refreshtoken
  // find User
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const opations = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", opations)
    .clearCookie("refreshToken", opations)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  // access using cookies
  const incomingRefreshToken =
    (await req.cookies.refreshToken) || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decoodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const opations = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, opations)
      .cookie("refreshToken", newrefreshToken, opations)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
