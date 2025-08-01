"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Higher-order function to wrap asynchronous Express route handlers.
 * This catches any errors from the async function and passes them to the Express error handling middleware.
 * This helps avoid repetitive try-catch blocks in every async controller function.
 * @param fn The asynchronous route handler function.
 * @returns An Express RequestHandler that ensures errors are caught.
 */
const asyncHandler = (fn) => (req, res, next) => {
    // Resolve the promise returned by the async function and catch any errors.
    // If an error occurs, pass it to the next middleware (Express's error handler).
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = asyncHandler;
