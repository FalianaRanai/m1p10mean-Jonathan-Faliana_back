const sendErrorResponse = async (
  res,
  err,
  controllerName,
  functionName,
  session,
  status = 400
) => {
  if (session) {
    await session.abortTransaction();
    session.endSession();
  }
  const message = `ERROR in ${controllerName}/${functionName}: ${err.message}`;
  console.log(message);
  res.send({
    status: status,
    message: message,
  });
};

module.exports = sendErrorResponse;