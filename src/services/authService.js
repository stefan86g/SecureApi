import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const register = async (username, password, publicKey) => {
  const existing = await User.findOne({ username });
  if (existing) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash, publicKey });
  await user.save();

  return { message: 'User registered successfully' };
};

const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

export default { register, login };
