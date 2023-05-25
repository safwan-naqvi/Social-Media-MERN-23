const express = require("express");
const dbConnect = require("./database/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8000;
dbConnect();

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Backend is running on ${PORT}`);
});
