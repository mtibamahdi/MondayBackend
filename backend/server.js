import express from "express";
import http from "http";
import bodyParser from "body-parser";
import { EventEmitter } from "events"; // Import EventEmitter from 'events'
import sse from "server-sent-events"; // Import the polyfill
import cors from "cors";

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(cors());

// Create an event emitter for SSE (better organization)
const sseEmitter = new EventEmitter();

// Function to send an SSE message to all connected clients
const sendSSE = (data) => {
  sseEmitter.emit("sse-data", JSON.stringify(data)); // Broadcast to all clients
};

// Route handler for SSE connections
app.get("/sse", (req, res) => {
  console.log("Client connected to SSE");
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Event listener for sending messages
  sseEmitter.on("sse-data", (data) => {
    res.write(`data: ${data}\n\n`);
  });

  req.on("close", () => {
    console.log("Client disconnected from SSE");
  });
});

// Your existing POST route handler
app.post("/", (req, res) => {
  console.log(JSON.stringify(req.body, 0, 2));
  res.status(200).send(req.body);

  // Trigger SSE to send data to connected clients
  sendSSE(req.body);
});

// Start the server
server.listen(process.env.PORT || 3001, () => {
  console.log(`Express server Listening on Port 3001`);
});
