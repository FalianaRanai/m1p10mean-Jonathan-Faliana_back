const sendSuccessResponse = async (
  res,
  data,
  controllerName,
  functionName,
  session,
  status = 200
) => {
  if (session) {
    await session.commitTransaction();
    session.endSession();
  }
  const message = `SUCCESS in ${controllerName}/${functionName}`;
  console.log(message);
  res.send({
    status: status,
    data: data,
    message: message,
  });
};

module.exports = sendSuccessResponse;
