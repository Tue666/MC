module.exports = (err, req, res, next) => {
  const status = err?.status || 500;
  const msg = err?.msg || "Đã có lỗi xảy ra!";
  res.status(status).json({ error: msg });
};
