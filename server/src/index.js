// server/src/index.js

// 1. Import the Express library
const express = require('express');

// 2. Create an instance of an Express application
const app = express();

// 3. Define the port the server will run on
//    process.env.PORT is for deployment, 3001 is for local development
const PORT = process.env.PORT || 3001;

// 4. Create a basic test route
//    This is just to make sure our server is working
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// 5. Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});