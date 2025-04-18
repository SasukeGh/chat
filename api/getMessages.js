const { Client } = require('pg');

module.exports = async (req, res) => {
  const client = new Client({
    connectionString: process.env.PG_CONN_STRING,
  });

  try {
    await client.connect();
    const result = await client.query('SELECT sender, message, created_at FROM messages ORDER BY created_at ASC');
    await client.end();

    res.status(200).json({ messages: result.rows });
  } catch (err) {
    console.error('Error in getMessages:', err); // 💥 log error
    res.status(500).json({ error: err.message }); // send JSON instead of plain text
  }
};
