import { Router } from 'express';
import { UsersController } from '../controllers/UsersController.mjs';
import {
  createPropertyValidationSchema,
  createTenantValidationSchema,
  createUserValidationSchema,
  deleteUserValidationSchema,
} from '../utils/validationSchemas.mjs';
import '../strategies/local-strategy.mjs';
import { AuthController } from '../controllers/AuthController.mjs';
import passport from 'passport';
import { checkSchema, param, query } from 'express-validator';
import { PropertyController } from '../controllers/PropertyController.mjs';
import { TenantsController } from '../controllers/TenantsController.mjs';

const router = Router();

/* Users endpoints */
router.post(
  '/api/v1/users',
  checkSchema(createUserValidationSchema),
  UsersController.createUser
);

router.post(
  '/api/v1/users/me',
  checkSchema(deleteUserValidationSchema),
  UsersController.deleteUser
);

router.patch('/api/v1/users', UsersController.updateWithDetails);

/* Auth endpoints*/
router.post(
  '/api/v1/auth',
  passport.authenticate('local'),
  AuthController.authenticate
);

router.get('/api/v1/auth/status', AuthController.getStatus);

router.post('/api/v1/auth/logout', AuthController.logout);

/* Property endpoints */
router.post(
  '/api/v1/properties',
  checkSchema(createPropertyValidationSchema),
  PropertyController.createProperty
);

router.get('/api/v1/properties', PropertyController.getAllProperties);

router.delete(
  '/api/v1/properties/:id',
  param('id')
    .notEmpty()
    .withMessage('provide property ID')
    .isString()
    .withMessage('property id must be a string'),
  PropertyController.deleteProperty
);

router.patch(
  '/api/v1/properties/:propertyId',
  PropertyController.updateProperty
);

/* Tenant endpoints */
router.post(
  '/api/v1/tenants',
  checkSchema(createTenantValidationSchema),
  TenantsController.addTenant
);

router.get(
  '/api/v1/tenants/:propertyId',
  param('propertyId')
    .notEmpty()
    .withMessage('provide property ID')
    .isString()
    .withMessage('property id must be a string'),
  TenantsController.getTenantsForProperty
);

router.delete(
  '/api/v1/tenants/:tenantId',
  param('tenantId')
    .notEmpty()
    .withMessage('provide tenant ID')
    .isString()
    .withMessage('Tenant id must be a string'),
  TenantsController.deleteTenant
);
export default router;
