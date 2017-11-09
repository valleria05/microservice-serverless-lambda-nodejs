'user strict';

//
// internal module
const { MicroServiceError } = require('../errors');
const requestHelper = require('../request');

const ENABLE_LOG_ERROR = process.env.ENABLE_LOG_ERROR === 'true';

const responseHelper = {
  success(req, res, data, status = 200) {
    return res.status(status).json({ data, requestId: requestHelper.getRequestId(req) });
  },
  error(req, res, err) {
    if (ENABLE_LOG_ERROR) {
      /* eslint-disable no-console */
      console.error(JSON.stringify(err));
      /* eslint-enable no-console */
    }

    if (err instanceof MicroServiceError) {
      const { code, message } = err;
      const errorResponse = {
        error: {
          code,
          message
        },
        requestId: requestHelper.getRequestId(req)
      };
      return res.status(code).json(errorResponse);
    }

    const errorResponse = {
      error: {
        code: 500,
        message: err.message
      },
      requestId: requestHelper.getRequestId(req)
    };
    return res.status(500).json(errorResponse);
  }
};

module.exports = responseHelper;