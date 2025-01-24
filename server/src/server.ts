import http from "http";
import "dotenv/config";

import { app } from "./app";

const PORT = process.env.PORT || 8765;

const server = http.createServer(app);

// Start server
(async () => {
  server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}...`);
  });
})();
