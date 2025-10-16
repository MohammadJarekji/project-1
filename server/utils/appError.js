class creatError extends Error{
    constructor(message, statusCode){
        super(message);

        this.StatusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? ' fail' : 'error';

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = creatError;
