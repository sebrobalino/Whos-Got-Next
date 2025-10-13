import ERROR_MESSAGES from "../constants/errorMessages.js";

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    error: message,
  });
}

export default errorHandler;