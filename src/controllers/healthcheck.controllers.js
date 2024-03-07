import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
// req
const healthcheck = asynchandler(async (_, res) => {
   try {
     // Respond with a simple OK message
     return res.status(200).json(new ApiResponse(200, {}, "Server is healthy"));
   } catch (error) {
     throw new ApiError(404,"Server is not healthy")
     
   }
  });


export { healthcheck };
