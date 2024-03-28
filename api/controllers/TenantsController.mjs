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
    if (!request.user)
      return response.status(401).json({ msg: 'You are not logged in' });
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).json({ msg: 'Invalid query string' });
    const data = matchedData(request);
    const { propertyId } = data;

    try {
      const tenants = await TenantModel.find({ property: propertyId });
      response.status(200).send(tenants);
    } catch (error) {
      console.log(`Something went wrong retrieving tenants`, error);
    }
  }

  /**
   * Retrieves a tenant by its ID.
   *
   * @param {Object} request - The HTTP request object.
   * @param {Object} response - The HTTP response object.
   * @returns {Promise<void>} - A promise that resolves when the tenant is retrieved.
   */
  static async getTenant(request, response) {
    if (!request.user)
      return response.status(401).json({ msg: 'You are not logged in' });

    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).json({ msg: 'Invalid parameter' });

    const data = matchedData(request);
    const { tenantId } = data;

    try {
      const tenant = await TenantModel.findOne({ _id: tenantId });
      response.status(200).json(tenant);
    } catch (error) {
      return response
        .status(400)
        .json({ msg: `Something went wrong retrieving tenant`, error });
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

  /**
   * Deletes a tenant by its ID.
   *
   * @param {Object} request - The HTTP request object.
   * @param {Object} response - The HTTP response object.
   * @returns {Promise<void>} - A promise that resolves when the tenant is deleted.
   */
  static async deleteTenant(request, response) {
    const { tenantId } = request.params;
    TenantModel.findOneAndDelete({ _id: tenantId }).then((tenant) => {
      if (!tenant)
        return response.status(404).json({ msg: 'Tenant not found' });
      const { _id, name } = tenant;
      return response.status(204).json({ deletedTenant: tenant });
    });
  }

  /**
   * Updates a tenant with the given fields.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Promise<Object>} The updated tenant object.
   */
  static async updateTenant(request, response) {
    if (!request.user)
      return response.status(401).send({ msg: 'You are not logged in' });
    //Get the update fields
    const { body } = request;
    const { tenantId } = request.params;

    const allowedUpdates = Object.keys(TenantModel.schema.paths); // Get schema field names
    for (const key in body) {
      if (!(body.hasOwnProperty(key) && allowedUpdates.includes(key))) {
        return response
          .status(400)
          .json({ msg: `Invalid update field: ${key}` });
      }
    }
    const query = { ...body };

    //fetch the tenant to update
    try {
      //update its details with the given fields
      const findTenant = await TenantModel.findByIdAndUpdate(tenantId, query, {
        new: true,
      });
      if (!findTenant) throw new Error('Tenant not found');
      return response.status(200).json({
        msg: 'Tenant updated with the given fields',
        updatedTenant: findTenant,
      });
    } catch (error) {
      return response.status(400).json({
        msg: 'Error occured while updating fields. Ensure you are giving correct fields',
      });
    }
  }
}
