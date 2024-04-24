import express from "express";
import http from "http";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());

// Function to send an SSE message to all connected clients
const sendSSE = (data) => {
  server.emit("sse-data", JSON.stringify(data)); // Broadcast to all connected clients
};

// Route handler for SSE connections
app.get("/sse", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Event listener for sending messages
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
app.listen(process.env.PORT || 3001, () => {
  console.log(`Express server Listening on Port 3001`);
});

// Event emitter for SSE (optional, for better organization)
const sseEmitter = new EventEmitter();
server.on("sse-data", (data) => {
  server.getConnections((err, connections) => {
    connections.forEach((connection) => {
      connection.write(`data: ${data}\n\n`); // Send data to each connection
    });
  });
});
