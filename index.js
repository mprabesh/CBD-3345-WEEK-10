const app = require('./app');

// Start the server
const PORT = process.env.PROD_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
