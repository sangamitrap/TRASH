// This middleware handles async/await errors by wrapping route handlers in a try/catch block
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
