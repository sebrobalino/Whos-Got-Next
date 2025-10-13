class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);  // Call the parent class constructor with the error message
    this.statusCode = statusCode;  // Store the HTTP status code
  }
}

export default CustomError;