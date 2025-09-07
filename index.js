const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const healthRoutes = require('./routes/healthRoutes.js')

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
