import authService from '../services/authService.js';

const register = async (req, res) => {
  try {
    const { username, password, publicKey } = req.body;
    const result = await authService.register(username, password, publicKey);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);

    // Sending JWT in an httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export default { register, login };
