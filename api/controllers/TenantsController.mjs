/* Contains all Route Handlers for our tenants' routes */

import { matchedData, validationResult } from 'express-validator';
import { TenantModel } from '../schemas/tenant.mjs';
import { PropertyModel } from '../schemas/property.mjs';

/**
 * Controller class for managing tenants.
 */
export class TenantsController {
  /**
   * Retrieves tenants for a specific property.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Promise<void>} - A promise that resolves when the tenants are retrieved.
   */
  static async getTenantsForProperty(request, response) {
    const { propertyId } = request.params;
    try {
      const tenants = await TenantModel.find({ property: propertyId });
      response.status(200).send(tenants);
    } catch (error) {
      console.log(`Something went wrong retrieving tenants`, error);
    }
  }

  /**
   * Adds a new tenant for a property.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Promise<void>} - A promise that resolves when the tenant is added.
   */
  static async addTenant(request, response) {
    if (!request.user)
      return response.status(401).json({ msg: 'You are not logged in' });
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).json({ msg: 'Entered wrong details' });
    const data = matchedData(request);
    console.log('tenant data', data);
    const { propertyId } = data;
    const newTenant = new TenantModel(data);
    newTenant.property = propertyId;

    newTenant.save().then((savedTenant) => {
      PropertyModel.findById(propertyId)
        .then((property) => {
          if (!property)
            return response.status(404).json({ msg: 'Property not found' });

          property.tenants = property.tenants.concat(savedTenant);
          property.save().then(() => {
            const { _id, name, leaseStartDate, leaseEndDate, email } =
              savedTenant;
            return response.status(201).json({
              msg: 'tenant added to the property',
              savedTenant: { _id, name, leaseStartDate, leaseEndDate },
            });
          });
        })
        .catch((err) => {
          return response.status(400).json({ err });
        });
    });
  }

  static async deleteTenant(request, response) {
    const { tenantId } = request.params;
    TenantModel.findOneAndDelete({ _id: tenantId }).then((tenant) => {
      if (!tenant)
        return response.status(404).json({ msg: 'Tenant not found' });
      const { _id, name } = tenant;
      return response.status(204).json({ deletedTenant: tenant });
    });
  }
}
