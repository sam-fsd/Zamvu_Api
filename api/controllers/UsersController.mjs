import { matchedData, validationResult } from 'express-validator';
import { UserModel } from '../schemas/user.mjs';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export class UsersConroller {
  static async createUser(request, response) {
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
}
