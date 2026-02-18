import { Router } from 'express';
import {
  updateUserRole,
  getUserRoles,
  getUsersByRole,
} from './user.controller.js';

const router = Router();

router.put('/:userId/role', ...updateUserRole);

router.get('/:userId/roles', ...getUserRoles);

router.get('/by-role/:roleName', ...getUsersByRole);

export default router;
