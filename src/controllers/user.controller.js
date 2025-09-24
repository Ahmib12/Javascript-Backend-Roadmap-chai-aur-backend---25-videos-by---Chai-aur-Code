// import asyncHandler from "../utils/asyncHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "syeda's world it is-- be careful -- > ok",
  });
});

export { registerUser };
