import mongoose, { Connection } from 'mongoose';
import { User } from './User';
import { Post } from './Post';

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