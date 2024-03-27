import { matchedData, validationResult } from 'express-validator';
import { UserModel } from '../schemas/user.mjs';
import bcrypt from 'bcrypt';
import { PropertyModel } from '../schemas/property.mjs';
import { TenantModel } from '../schemas/tenant.mjs';

const saltRounds = 10;

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

/**
 * Controller class for handling user-related operations.
 */
export class UsersController {
  /**
   * Creates a new user.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Object} The response object with the created user details or an error message.
   */
  static async createUser(request, response) {
    if (request.user)
      return response
        .status(403)
        .json({ msg: 'You cannot create an new account if you are logged in' });
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).json({ err: 'Bad credentials' });
    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const newUser = new UserModel(data);

    newUser
      .save()
      .then((savedUser) => {
        const { _id, username } = savedUser;
        return response.status(201).json({
          msg: 'User created successfully',
          savedUser: { _id, username },
        });
      })
      .catch((err) => {
        return response.status(400).json({
          msg: 'Something went wrong try again',
          err,
        });
      });
  }

  /**
   * Deletes a user and all associated data.
   *
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Promise<void>} - A promise that resolves when the user is deleted.
   */
  static async deleteUser(request, response) {
    //get the user(email)
    if (!request.user)
      return response.status(401).json({ err: 'You are not logged in' });
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).json({
        err: 'Bad credentials',
        msg: 'User valid email is needed to delete account',
        warning:
          'This operation cannot be undone. All properties and tenants created by this user will be completely deleted',
      });
    const data = matchedData(request);
    const { email } = data;
    console.log('passed email', email);
    const id = request.user.id;

    //Query db to find if the email is associated with the logged in user
    try {
      const findUser = await UserModel.findOne({ _id: id });
      console.log(findUser.email);
      if (!findUser || findUser.email !== email)
        return response.status(400).json({
          err: 'Bad credentials',
        });
      //Delete the user and clear every reference to him i.e properties and tenants
      try {
        const allProperties = await PropertyModel.find({
          manager: findUser.id,
        });

        const properyIds = allProperties.map((property) => property.id);
        console.log('property IDs', properyIds);
        const listOfTenants = allProperties.map((property) => property.tenants);
        const tenantIds = listOfTenants.flat();
        console.log('tenant IDS', tenantIds);

        try {
          await TenantModel.deleteMany({ _id: { $in: tenantIds } });
        } catch (err) {
          console.log('Error deleting properties', err);
          return;
        }
        try {
          await PropertyModel.deleteMany({ _id: { $in: properyIds } });
        } catch (err) {
          console.log('Error deleting all properties');
          return;
        }

        await UserModel.deleteOne({ _id: id });
        //Delete the session from the sessions collection and log out
        request.logout((err) => {
          if (err) console.log(err);
          request.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
            }
          });
        });

        return response.status(204).json({
          msg: 'Permanently deleted account with all associated data',
        });
      } catch (error) {
        console.log(error);
        return;
      }
    } catch (error) {
      return response.status(400).json({
        msg: 'No user with that email found',
        warning:
          'This operation cannot be undone. All properties and tenants created by this user will be completely deleted',
      });
    }
  }

  /**
   * Updates user details with the provided fields.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Promise<Object>} The updated user details.
   */
  static async updateWithDetails(request, response) {
    if (!request.user)
      return response.status(401).json({ err: 'You are not logged in' });
    const { body } = request;
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({
        msg: 'Ensure the fields to update are either username or password',
      });
    }
    const id = request.user.id;
    try {
      const findUser = await UserModel.findById(id);
      if (!findUser)
        return response.status(400).json({ msg: 'No valid User found' });
      if (body.username) {
        findUser.username = body.username;
      }
      if (body.password) {
        const hashedPassword = hashPassword(body.password);
        findUser.password = hashedPassword;
      }
      await findUser.save();
      return response
        .status(202)
        .json({ msg: 'Info updated with given fields' });
    } catch (error) {
      return response.status(417).json({ err: 'something went wrong' });
    }
  }
}
