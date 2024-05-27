import express, { Request, Response } from 'express';
import db  from '../models';
import verifyToken from '../middlewares/authJwt';

const postRouter = express.Router();

const Post = db.Post;

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

// Retrieve recent posts 
postRouter.get('/recent', async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();

        const totalPosts = await Post.countDocuments();
 
        res.status(200).json({
            totalPosts,
            totalPages: Math.ceil(totalPosts / Number(limit)),
            currentPage: Number(page),
            posts,
        });
    } catch (error) {
        console.error('Error retrieving recent posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

postRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find({ 'poster.posterId': userId })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();

        const totalPosts = await Post.countDocuments();

        res.status(200).json({
            totalPosts,
            totalPages: Math.ceil(totalPosts / Number(limit)),
            currentPage: Number(page),
            posts,
        });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

postRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    const posterId = req.body.posterId;

    if (userId !== posterId) {
        return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default postRouter;