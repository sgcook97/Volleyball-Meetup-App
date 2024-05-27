import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Message } from '../models/Message';
import { User } from '../models/User';

const onlineUsers = new Map();

const configureSocket = (io: Server) => {
    // authenticate user
    io.use((socket, next) => {
        const token = socket.handshake.auth.token as string;
        if (!token) {
            console.error('No token provided');
            return next(new Error('Authentication error'));
        }
        const secret: string = process.env.JWT_SECRET_KEY as string;
        jwt.verify(token, secret, async (err: Error | null, decoded : any) => {
            if (err) {
                console.error('Error verifying token:', err);
                return next(new Error('Authentication error'));
            }

            const userId = (decoded as { userId: string }).userId;
            socket.data.userId = userId
            
            try {
                const user = await User.findById(userId).select('username');
                if (!user) {
                    return next(new Error('User not found'));
                }
                socket.data.username = user.username;
                next();
            } catch (error) {
                console.error('Error fetching user:', error);
                return next(new Error('Authentication error'));
            }
        });
    });

    io.on('connection', (socket) => {
        
        // add user to online users
        onlineUsers.set(socket.data.userId, { id: socket.id, username: socket.data.username });
        io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([userId, userInfo]) => ({
            userId,
            username: userInfo.username
        })));

        // send unread messages to user when they connect
        Message.find({ receiverId: socket.data.userId, isRead: false }).then((unreadMessages) => {
            socket.emit('unreadMessages', unreadMessages);
        }).catch((error) => {
            console.error('Error fetching unread messages:', error);
        });
        
        // mark messages as read when user reads them
        socket.on('readMessages', (senderId) => {
            Message.updateMany({ senderId, receiverId: socket.data.userId, isRead: false }, { $set: { isRead: true } })
                .then(() => {
                    console.log('Messages marked as read');
                }).catch((error) => {
                    console.error('Error marking messages as read:', error)
                });
        });

        // send message to receiver
        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, content } = data;
            if (socket.data.userId !== senderId) {
                return;
            }
            // save message to db
            const message = new Message({ senderId, receiverId, content });
            await message.save();
            io.emit('receiveMessage', message);

            // // send message to receiver if they're online
            // const receiverSocket = io.sockets.sockets.get(onlineUsers.get(receiverId));
            // if (receiverSocket) {
            //     receiverSocket.emit('receiveMessage', message);
            // }
        });

        // remove user from online users when they disconnect
        socket.on('disconnect', () => {
            onlineUsers.delete(socket.data.userId);
            io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        });
    });
};

export default configureSocket;