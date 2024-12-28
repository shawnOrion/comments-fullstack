const express = require('express');
const cors = require('cors');
const db = require('./db/queries'); // Import the queries module

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for specific origin (adjust as needed)
app.use(cors({
    origin: 'https://canvas.play.rosebud.ai',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Helper to log input and output data
const logRequestResponse = (req, resData) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    console.log('Response Data:', resData);
};

// User-related routes
// Endpoint to Get All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.getAllUsers(); // Fetch users from the database
        logRequestResponse(req, users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// Endpoint to Create a New User
app.post('/api/users', async (req, res) => {
    const { name, image } = req.body;

    if (!name || !image) {
        return res.status(400).json({ error: 'Name and image are required.' });
    }

    try {
        const newUser = await db.createUser(name, image); // Insert user into the database
        logRequestResponse(req, newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

// Comment-related routes
// Endpoint to Get All Comments
app.get('/api/comments', async (req, res) => {
    try {
        const comments = await db.getAllComments(); // Fetch comments from the database
        logRequestResponse(req, comments);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ error: 'Failed to fetch comments.' });
    }
});

// Endpoint to Get a Comment by ID
app.get('/api/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await db.getCommentById(id); // Fetch comment by ID
        logRequestResponse(req, comment);
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error.message);
        res.status(404).json({ error: 'Comment not found.' });
    }
});

// Endpoint to Create a New Comment
app.post('/api/comments', async (req, res) => {
    const { content, userId, parentId } = req.body;

    if (!content || !userId) {
        return res.status(400).json({ error: 'Content and userId are required.' });
    }

    try {
        const newComment = await db.createComment(content, userId, parentId); // Insert comment into the database
        logRequestResponse(req, newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ error: 'Failed to create comment.' });
    }
});

// Endpoint to Update a Comment
app.put('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    try {
        const updatedComment = await db.updateComment(id, content); // Update comment by ID
        logRequestResponse(req, updatedComment);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(404).json({ error: 'Comment not found.' });
    }
});

// Endpoint to Delete a Comment
app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedComment = await db.deleteComment(id); // Delete comment by ID
        logRequestResponse(req, deletedComment);
        res.status(200).json(deletedComment);
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(404).json({ error: 'Comment not found.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
