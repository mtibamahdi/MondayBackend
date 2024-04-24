import express from "express";
import http from "http";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());

app.post("/", (req, res) => {
  console.log(JSON.stringify(req.body, 0, 2));
  res.status(200).send(req.body);
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Express server Listening on Port 3001`);
});
