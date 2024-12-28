require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

// Create a connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to remove the most recent user
async function removeMostRecentUser() {
    try {
        console.log('Fetching the most recent user...');

        // Query to get the most recent user by ID
        const result = await pool.query('SELECT * FROM users ORDER BY id DESC LIMIT 1');
        const mostRecentUser = result.rows[0];

        if (!mostRecentUser) {
            console.log('No users found in the database.');
            return null;
        }

        console.log('Most recent user:', mostRecentUser);

        // Delete the most recent user
        await pool.query('DELETE FROM users WHERE id = $1', [mostRecentUser.id]);
        console.log(`User with ID ${mostRecentUser.id} successfully removed.`);

        return mostRecentUser.id;
    } catch (error) {
        console.error('Error removing the most recent user:', error.message);
        throw error;
    }
}

// Function to reset the sequence to align with the current maximum ID
async function resetSequence() {
    try {
        console.log('Resetting the sequence to align with the maximum ID...');

        // Reset the sequence to the new maximum ID
        await pool.query("SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM users))");
        console.log('Sequence successfully reset.');
    } catch (error) {
        console.error('Error resetting the sequence:', error.message);
        throw error;
    }
}

// Main function to remove the most recent user and reset the sequence
async function main() {
    try {
        
        const removedUserId = await removeMostRecentUser();

        if (removedUserId !== null) {
            await resetSequence();
        }
    } catch (error) {
        console.error('Error executing script:', error.message);
    } finally {
        await pool.end();
        console.log('Database connection closed.');
    }
}

// Run the script
main();
