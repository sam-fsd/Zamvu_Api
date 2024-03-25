import { Router, request, response } from 'express';

router = Router();

router.get('/users/', UsersController.getusers);
