const pool = require('./pool');

// User Operations
// Get all users
async function getAllUsers() {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows; // Return all rows
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
}

// Create a new user
async function createUser(name, image) {
    const query = `
        INSERT INTO users (name, image)
        VALUES ($1, $2)
        RETURNING *; -- Return the newly created user
    `;
    const values = [name, image];

    try {
        const result = await pool.query(query, values);

        return result.rows[0]; // Return the newly created user
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error;
    }
}


// Comment Operations
// Get all comments
async function getAllComments() {
    try {
        const result = await pool.query('SELECT * FROM comments ORDER BY id ASC');
        return result.rows; // Return all rows
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        throw error;
    }
}

// Get a comment by ID
async function getCommentById(commentId) {
    try {
        const result = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
        if (result.rows.length === 0) {
            throw new Error('Comment not found');
        }
        return result.rows[0]; // Return the single comment
    } catch (error) {
        console.error('Error fetching comment:', error.message);
        throw error;
    }
}

// Create a new comment
async function createComment(content, userId, parentId = null) {
    const query = `
        INSERT INTO comments (content, user_id, parent_id)
        VALUES ($1, $2, $3)
        RETURNING *; -- Return the newly created comment
    `;
    const values = [content, userId, parentId];

    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the newly created comment
    } catch (error) {
        console.error('Error creating comment:', error.message);
        throw error;
    }
}

// Update a comment by ID
async function updateComment(commentId, content) {
    const query = `
        UPDATE comments
        SET content = $1
        WHERE id = $2
        RETURNING *; -- Return the updated comment
    `;
    const values = [content, commentId];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Comment not found');
        }
        return result.rows[0]; // Return the updated comment
    } catch (error) {
        console.error('Error updating comment:', error.message);
        throw error;
    }
}

// Delete a comment by ID
async function deleteComment(commentId) {
    try {
        const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [commentId]);
        if (result.rows.length === 0) {
            throw new Error('Comment not found');
        }
        return result.rows[0]; // Return the deleted comment
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        throw error;
    }
}

module.exports = {
    // User Operations
    getAllUsers,
    createUser,

    // Comment Operations
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
};
