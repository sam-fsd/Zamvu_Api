import { Router } from 'express';
import { UsersConroller } from '../controllers/UsersController.mjs';
import {
  createPropertyValidationSchema,
  createTenantValidationSchema,
  createUserValidationSchema,
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
  UsersConroller.createUser
);

router.post(
  '/api/v1/auth',
  passport.authenticate('local'),
  AuthController.authenticate
);

router.post('/api/v1/auth/logout', AuthController.logout);

/* Property endpoints */
router.post(
  '/api/v1/properties',
  checkSchema(createPropertyValidationSchema),
  PropertyController.createProperty
);

router.get('/api/v1/properties', PropertyController.getAllProperties);

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
