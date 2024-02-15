const sendMail = require("../utils/sendMail.util");
const controllerName = "baseController.controller";
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");

exports.index = () => {
  console.log("you're in BaseController");
};

exports.sendMail = async (req, res) => {
  const functionName = "sendMail";
  try {
    await sendMail();
    sendSuccessResponse(res, "email sent successfully", controllerName, functionName);
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};
