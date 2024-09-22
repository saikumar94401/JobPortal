import express from 'express';
import { login, register, updateProfile } from '../contollers/user.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profileUpdate').post(isAuthenticated,updateProfile);

export default router;