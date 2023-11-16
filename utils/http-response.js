module.exports = {
  ok(res, data = null) {
    return data ? res.status(200).json(data) : res.status(200).send();
  },
  created(res) {
    return res.status(201).send();
  },
  noContent(res) {
    return res.status(204).send();
  },
  notFound(res, model) {
    return res.status(404).json({
      message: `${model} not found`,
    });
  },
  badRequest(res, message) {
    return res.status(400).json({
      message,
    });
  },
  unauthorized(res) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  },
  unexpected(res) {
    return res.status(500).json({
      message: "Unexpected error occured",
    });
  },
};
