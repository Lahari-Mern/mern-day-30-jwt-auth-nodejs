const express = require('express');
const jwt     = require('jsonwebtoken');

const app        = express();
const SECRET_KEY = "mysecretkey123";

app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "12345") {

    const token = jwt.sign(
      { email: email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      message: "Login Successful",
      token: token
    });

  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Token Required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.user = decoded;
    next();
  });
}

app.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: "Welcome to Profile",
    user: req.user
  });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});