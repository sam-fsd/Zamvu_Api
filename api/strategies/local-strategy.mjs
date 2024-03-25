import passport from 'passport';
import { Strategy } from 'passport-local';
import { UserModel } from '../schemas/user.mjs';

//add user to the session with a given unique key ( could be anything but id is convection)
passport.serializeUser((user, done) => {
  console.log('Inside serialize User');
  done(null, user.id);
});

//Finds the user in data source(db/array) and attaches that object to the request as property(user)
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await UserModel.findById(id);
    if (!findUser) throw new Error('User not found');
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

//validates user fields
export default passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const findUser = await UserModel.findOne({ email });
      if (!findUser) throw new Error('User not found');
      console.log('findUser password is', findUser.password);
      if (findUser.password !== password)
        throw new Error('Invalid credentials');
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
