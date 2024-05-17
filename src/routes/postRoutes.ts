import express, { Request, Response } from 'express';
import { Post } from '../models/post'; // Assuming you have a Post model
import verifyToken from '../middlewares/authJwt';

const postRouter = express.Router();

// Create a new post
postRouter.post('/create-post', verifyToken, async (req: Request, res: Response) => {
    try {
        const { title, location, content, skillLevel, poster } = req.body;
        const newPost = new Post({ title, location, skillLevel, content, poster });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
postRouter.delete('/:postId', verifyToken, async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retrieve recent posts 
postRouter.get('/recent', async (req: Request, res: Response) => {
    try {
        // Assuming you want to retrieve the most recent posts
        const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(10); // Adjust limit as needed
        res.status(200).json(recentPosts);
    } catch (error) {
        console.error('Error retrieving recent posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default postRouter;