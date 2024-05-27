import mongoose, { Connection } from 'mongoose';
import { User } from './User';
import { Post } from './PostModel';
import { Message } from './Message';
mongoose.Promise = global.Promise;

interface Database {
  mongoose: typeof mongoose;
  User: typeof User;
  Post: typeof Post;
  Message: typeof Message;
}

const db: Database = {
  mongoose,
  User: User,
  Post: Post,
  Message: Message,
};

export default db;