/* Contains all route handlers for property endpoints */

import { matchedData, validationResult } from 'express-validator';
import { PropertyModel } from '../schemas/property.mjs';

/**
 * Controller class for managing properties.
 */
export class PropertyController {
  /**
   * Get all properties for a logged in User.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Object} - The response object with all properties for the logged in user.
   */
  static async getAllProperties(request, response) {
    try {
      const loggedInUser = request.user;
      if (!loggedInUser)
        return response.status(401).send({ msg: 'You are not logged in' });
      const allProperties = await PropertyModel.find({
        manager: loggedInUser.id,
      });
      return response.status(200).send(allProperties);
    } catch (error) {
      console.log(error);
      response.status(404).send({ msg: 'Something went wrong' });
    }
  }

  /**
   * Create a property.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Object} - The response object with the created property.
   */
  static async createProperty(request, response) {
    const data = matchedData(request);
    const property = new PropertyModel(data);
    const manager = request.user;
    if (!manager)
      return response.status(401).json({ msg: 'You are not logged in' });
    property.manager = manager.id;
    const savedProperty = await property.save();

    return response.status(201).json({ savedProperty });
  }

  /**
   * Delete a property.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Object} - The response object with the deleted property.
   */
  static async deleteProperty(request, response) {
    const {
      params: { id },
    } = request;

    if (!request.user)
      return response.status(401).json({ msg: 'You are not logged in' });

    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).json({
        msg: 'The property Id should be a valid string and not empty',
      });

    PropertyModel.findByIdAndDelete(id)
      .then((deletedProperty) => {
        return response.status(204);
      })
      .catch((err) => {
        return response.status(400).json({ err });
      });
  }

  static async updateProperty(request, response) {
    if (!request.user)
      return response.status(401).send({ msg: 'You are not logged in' });
    //Get the update fields
    const { body } = request;
    const { propertyId } = request.params;

    const allowedUpdates = Object.keys(PropertyModel.schema.paths); // Get schema field names
    for (const key in body) {
      if (!(body.hasOwnProperty(key) && allowedUpdates.includes(key))) {
        return response
          .status(400)
          .json({ msg: `Invalid update field: ${key}` });
      }
    }
    const query = { ...body };

    //fetch the property to update
    try {
      //update its details with the given fields
      const findProperty = await PropertyModel.findByIdAndUpdate(
        propertyId,
        query,
        {
          new: true,
        }
      );
      if (!findProperty) throw new Error('property not found');
      return response.status(200).json({
        msg: 'Property updated with the given fields',
        updatedProperty: findProperty,
      });
    } catch (error) {
      return response.status(400).json({
        msg: 'Error occured while updating fields. Ensure you are giving correct fields',
        error,
      });
    }
  }
}
