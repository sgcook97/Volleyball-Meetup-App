import mongoose, { Connection } from 'mongoose';
import { User } from './user';
import { Post } from './post';

mongoose.Promise = global.Promise;

interface Database {
  mongoose: typeof mongoose;
  User: typeof User;
  Post: typeof Post;
}

const db: Database = {
  mongoose,
  User: User,
  Post: Post
};

export default db;