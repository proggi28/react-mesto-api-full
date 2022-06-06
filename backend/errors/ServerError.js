class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
