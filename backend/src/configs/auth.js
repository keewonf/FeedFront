module.exports = {
  jwt: {
    secret:
      process.env.AUTH_SECRET ||
      (() => {
        throw new Error("AUTH_SECRET environment variable is required");
      })(),
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
