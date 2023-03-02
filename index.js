const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const router = require("./routes");

// Middleware för att parse request bodies
app.use(express.json());

router(app);

// Starta servern
app.listen(port, () => {
  console.log(`Servern lyssnar på http://localhost:${port}`);
});
