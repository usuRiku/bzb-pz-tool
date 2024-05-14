class ExpressError extends Error{
    constructor(massage, statusCode) {
        super();
        this.massage = massage;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;