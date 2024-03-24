/* Contains all route handlers for property endpoints */

import { matchedData } from 'express-validator';
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

    PropertyModel.findByIdAndDelete(id)
      .then((deletedProperty) => {
        return response.status(204).json(deletedProperty);
      })
      .catch((err) => {
        return response.status(400).json({ err });
      });
  }
}
