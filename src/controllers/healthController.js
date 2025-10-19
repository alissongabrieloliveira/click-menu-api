const healthCheck = (req, res) => {
  res.json({ status: "API online" });
};

module.exports = { healthCheck };
