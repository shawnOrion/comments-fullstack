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

// User and comments data
const USERS = [
    { id: 1, name: "juliusomo", image: "https://play.rosebud.ai/assets/image-juliusomo.webp?SuPD" },
    { id: 2, name: "Kimberly Smith", image: "https://play.rosebud.ai/assets/avatar-kimberly-smith.webp?AZSq" },
    { id: 3, name: "Max Blagun", image: "https://play.rosebud.ai/assets/image-maxblagun.webp?HLis" },
];

const COMMENTS = [
    { content: "How does my new comments section look?", user_id: 1, parent_id: null },
    { content: "Woah, your project looks awesome! How long have you been coding for?", user_id: 3, parent_id: null },
];

// Function to populate the database
async function populateDatabase() {
    try {
        console.log('Inserting users...');
        for (const user of USERS) {
            await pool.query(
                'INSERT INTO users (id, name, image) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                [user.id, user.name, user.image]
            );
        }
        console.log('Users inserted successfully.');

        console.log('Inserting comments...');
        for (const comment of COMMENTS) {
            await pool.query(
                'INSERT INTO comments (content, user_id, parent_id) VALUES ($1, $2, $3)',
                [comment.content, comment.user_id, comment.parent_id]
            );
        }
        console.log('Comments inserted successfully.');
    } catch (error) {
        console.error('Error populating database:', error.message);
    } finally {
        await pool.end();
        console.log('Database connection closed.');
    }
}

// Run the population script
populateDatabase();
