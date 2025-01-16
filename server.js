const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    // const { name, password } = req.body; // Get the name and password from the request body
    // const salt = await bcrypt.genSalt(); // Generate a salt
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash password

    // console.log(salt);
    // console.log(hashedPassword);
    const user = { name: req.body.name, password: hashedPassword }; // Create a user object
    users.push(user); // Add user to the array
    res.status(201).send(); // Send a 201 status code
  } catch {
    res.status(400).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Compare the password for time attack
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
