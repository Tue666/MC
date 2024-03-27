class APIError extends Error {
  constructor(status, msg) {
    super(msg);

    this.status = status;
  }
}

const errorHandler = (error, req, res, next) => {
  const status = error?.status || 500;
  const msg = error?.message || "Đã có lỗi xảy ra!";
  res.status(status).json({ error: msg });
};

module.exports = {
  errorHandler,
  APIError,
};
