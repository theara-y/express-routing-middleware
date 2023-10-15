class NotFoundError extends Error {
    constructor(message, status = 404) {
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = NotFoundError;