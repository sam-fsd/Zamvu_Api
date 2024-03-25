import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import routes from './routes/index.mjs';

const PORT = process.env.PORT || 3001;
const DBURL = `mongodb://localhost/Zamvu_data_store`;

const app = express();
mongoose
  .connect(DBURL)
  .then(() => console.log(`Connected to Zamvu DB`))
  .catch((err) => console.log(`Did not connect to DB`, err));

app.use(express.json());
app.use(
  session({
    secret: 'api session secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: false,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use('/', (req, res) => {
  return res.status(200).json({ msg: 'welcome to zamvu api' });
});

app.listen(PORT, (request, response) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
