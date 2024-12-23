const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for specific origin (adjust as needed)
app.use(cors({
    origin: 'https://canvas.play.rosebud.ai', // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Current User Data
const currentUser = {
    id: 1001,
    name: "juliusomo",
    image: "https://play.rosebud.ai/assets/image-juliusomo.webp?SuPD"
};


// Initial Comments Data
let comments = [
    {
        id: 1,
        content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        user: {
            id: 1002,
            name: "amyrobson",
            image: "https://play.rosebud.ai/assets/image-amyrobson.webp?VXRV"
        }
    },
    {
        id: 2,
        content: "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I should start? Thanks!",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        user: {
            id: 1003,
            name: "maxblagun",
            image: "https://play.rosebud.ai/assets/image-maxblagun.webp?HLis"
        }
    }
];

let commentId = comments.length + 1; // Auto-incrementing ID based on existing comments

// Helper to log input and output data
const logRequestResponse = (req, resData) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    console.log('Response Data:', resData);
};

// Endpoint to Get Current User
app.get('/api/current-user', (req, res) => {
    try {
        const resData = currentUser;
        logRequestResponse(req, resData);
        res.status(200).send(resData);
    } catch (error) {
        console.error('Error retrieving current user:', error.message);
        res.status(500).send({ error: 'Failed to retrieve current user.' });
    }
});

// Endpoint to Get All Comments
app.get('/api/comments', (req, res) => {
    try {
        const resData = comments;
        logRequestResponse(req, resData);
        res.status(200).send(resData);
    } catch (error) {
        console.error('Error retrieving comments:', error.message);
        res.status(500).send({ error: 'Failed to retrieve comments.' });
    }
});

// Endpoint to Create a New Comment
app.post('/api/comments', (req, res) => {
    try {
        const { content, createdAt } = req.body;

        if (!content || !createdAt) {
            const error = 'Both content and createdAt are required.';
            console.error(error);
            return res.status(400).send({ error });
        }

        // Create new comment
        const newComment = {
            id: commentId++, // Auto-increment ID
            content,
            createdAt: new Date(createdAt).toLocaleString(),
            user: currentUser // Attach the current user as the comment's author
        };

        // Add to comments list
        comments.push(newComment);

        logRequestResponse(req, newComment);
        res.status(201).send(newComment);
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).send({ error: 'Failed to create comment.' });
    }
});

// Endpoint to Update a Comment
app.put('/api/comments/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { content, createdAt } = req.body;

        const comment = comments.find(comment => comment.id === parseInt(id));

        if (!comment) {
            const error = 'Comment not found.';
            console.error(error);
            return res.status(404).send({ error });
        }

        if (!content || !createdAt) {
            const error = 'Both content and createdAt are required.';
            console.error(error);
            return res.status(400).send({ error });
        }

        // Update comment details
        comment.content = content;
        comment.createdAt = new Date(createdAt).toLocaleString();

        logRequestResponse(req, comment);
        res.status(200).send(comment);
    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(500).send({ error: 'Failed to update comment.' });
    }
});

// Endpoint to Delete a Comment
app.delete('/api/comments/:id', (req, res) => {
    try {
        const { id } = req.params;

        const commentIndex = comments.findIndex(comment => comment.id === parseInt(id));

        if (commentIndex === -1) {
            const error = 'Comment not found.';
            console.error(error);
            return res.status(404).send({ error });
        }

        // Remove comment
        const deletedComment = comments.splice(commentIndex, 1);

        logRequestResponse(req, deletedComment);
        res.status(204).send(); // No content response
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).send({ error: 'Failed to delete comment.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
