const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const dbService = require('../services/dbService');
const { registerSchema, loginSchema, profileUpdateSchema } = require('../validations/authValidation');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authController = {
  // Register a new inspector account
  async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);

      // Check existing user
      const existingUser = await dbService.findUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Save user
      const newUser = await dbService.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role || 'Safety Inspector',
        organization: validatedData.organization || 'Enterprise Safety Division',
      });

      const token = generateToken(newUser);
      const { password: _, ...safeUser } = newUser;

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: safeUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // Login inspector
  async login(req, res, next) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await dbService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      const { password: _, ...safeUser } = user;

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: safeUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await dbService.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  // Update profile
  async updateProfile(req, res, next) {
    try {
      const validatedData = profileUpdateSchema.parse(req.body);
      const updatedUser = await dbService.updateUser(req.user.id, validatedData);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
