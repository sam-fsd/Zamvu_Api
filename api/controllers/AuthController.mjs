/* Authentication Service */

/**
 * Controller class for handling authentication related operations.
 */
export class AuthController {
  /**
   * Generates a new token for a user.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Object} - The response object with a success message.
   */
  static authenticate(request, response) {
    return response.status(200).json({ msg: 'Logged in' });
  }

  /**
   * Logs out the user.
   * @param {Object} request - The request object.
   * @param {Object} response - The response object.
   * @returns {Object} - The response object with a success or error message.
   */
  static async logout(request, response) {
    if (!request.user)
      return response.status(401).json({ msg: 'You are not logged in' });
    //remvoing user property from request object & deleting associated session from DB
    request.logout((err) => {
      if (err)
        return response
          .status(400)
          .json({ msg: 'Error while logging out', err });
      request.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return response.sendStatus(400);
        }
        return response.status(200).json({ msg: 'Logged Out' });
      });
    });
  }
}
