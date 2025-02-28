const jsonServer = require("json-server");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Enable CORS (Prevents CORS issues)
server.use(cors());
server.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
   res.header("Access-Control-Allow-Headers", "Content-Type");
   next();
});

// Redirect root `/` to `/links`
server.get("/", (req, res) => {
   res.redirect("/links");
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
   console.log(`✅ JSON Server is running at http://0.0.0.0:${PORT}`);
});
