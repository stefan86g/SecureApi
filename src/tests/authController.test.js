import authController from '../controllers/authController.js';
import authService from '../services/authService.js';

jest.mock('../services/authService.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  describe('register', () => {
    test('should return 201 and result when registration is successful', async () => {
      req.body = { username: 'user1', password: 'pass', publicKey: 'pubKey' };
      const fakeResult = { id: '123', username: 'user1' };
      authService.register.mockResolvedValue(fakeResult);

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith('user1', 'pass', 'pubKey');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    test('should return 400 when registration fails', async () => {
      req.body = { username: 'user1', password: 'pass', publicKey: 'pubKey' };
      authService.register.mockRejectedValue(new Error('Registration failed'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });

  describe('login', () => {
    test('should set cookie and return success message on login', async () => {
      req.body = { username: 'user1', password: 'pass' };
      authService.login.mockResolvedValue('fake-jwt-token');

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith('user1', 'pass');
      expect(res.cookie).toHaveBeenCalledWith('token', 'fake-jwt-token', expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
      }));
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged in successfully' });
    });

    test('should return 401 when login fails', async () => {
      req.body = { username: 'user1', password: 'wrong' };
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});
