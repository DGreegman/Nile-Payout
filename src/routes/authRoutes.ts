import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { registerValidation, loginValidation } from '../middleware/authValidation';
import { validate } from '../middleware/validationMiddleware';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (vendor)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - bank_account
 *               - store_name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bank_account:
 *                 type: string
 *               store_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User (vendor) registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error registering user (vendor)
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user (vendor)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User (vendor) logged in successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in
 */
router.post('/login', loginValidation, validate, authController.login);

export default router;