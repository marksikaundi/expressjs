import express from "express";

const app = express();
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 8000;
const mockUsers = [
  { id: 1, username: "markikaundi", displayName: "Mark Sikaundi" },
  { id: 2, username: "joy", displayName: "Joy Dev" },
  { id: 3, username: "david", displayName: "David Jiri" },
  { id: 4, username: "jane", displayName: "Jane Doe" },
  { id: 5, username: "john", displayName: "John More" },
  { id: 6, username: "james", displayName: "James Bond" },
];

const mockLaptops = [
  { id: 1, name: "Macbook Pro", price: 2000 },
  { id: 2, name: "iPhone 12", price: 1000 },
  { id: 3, name: "Samsung Galaxy S21", price: 800 },
];

// localhost:3000/api/hello-world
app.get("/api/hello-world", (req, res) => {
  res.send("Hello, from Lupleg Community");
});

// localhost:3000/api
app.get("/api", loggingMiddleware, (req, res) => {
  res.send("Hello World");
});

// localhost:3000/users
app.get("/api/users", (req, res) => {
  console.log(req.query);
  const {
    query: { filter, value },
  } = req;

  // when filter  and value are undefined
  if (filter && !value) return res.status(400).send(mockUsers);

  if (filter && value) {
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  }
  return res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(200).send(newUser);
});

// localhost:3000/api/users/id
app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.status(404);
  return res.send(findUser);
});

// localhost:3000/api/laptops
app.get("/api/laptops", (req, res) => {
  res.send(mockLaptops);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// PUT
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

// PATCH
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

// DELETE
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex);
  return res.sendStatus(200);
});
