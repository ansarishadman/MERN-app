const jwt = require('jsonwebtoken');
const authMiddleware = require('../../routes/middleware/authMiddleware');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('authMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if a valid token is provided', () => {
    const req = {
      headers: {
        authorization: 'Bearer valid_token'
      }
    };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: '123' });
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'secretToken', expect.any(Function));
    expect(req.user).toEqual({ userId: '123' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if no token is provided', () => {
    const req = {
      headers: {}
    };
    const res = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status().json).toHaveBeenCalledWith({ status: 'error', error: 'No token provided!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 if an invalid token is provided', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid_token'
      }
    };
    const res = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', 'secretToken', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status().json).toHaveBeenCalledWith({ status: 'error', error: 'Failed to authenticate token!' });
    expect(next).not.toHaveBeenCalled();
  });
});
