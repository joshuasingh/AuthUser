const http = require("http");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const SignUp = require("./RegisterUser/SignUp");
const SignIn = require("./AuthenticateUser/SignIn");
const ProtectedResource = require("./Resources_Dir/Protected_Resources");
const RefreshAccess = require("./AuthenticateUser/RefreshAccess");

//middleware layer
app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: false }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

//route paths
app.use("/user/SignUp", SignUp);
app.use("/user/SignIn", SignIn);
app.use("/resources", ProtectedResource);
app.use("/auth/refresh", RefreshAccess);

var port = process.env.PORT || 8081;

var server = http.createServer(app);

//server is listening
server.listen(port, () => {
  console.log(`Authentication server is up and running ${port}`);
});

app.post("/login", (req, res) => {
  var { user } = req.body;

  jwt.sign(user, "accessKey", { expiresIn: "20s" });
});
