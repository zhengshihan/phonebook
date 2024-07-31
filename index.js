const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

app.use(morgan("tiny"));

const cors = require("cors");

app.use(cors());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info", (request, response) => {
  response.send(
    `<h1>Phonebook has info for ${
      persons.length
    } people</h1><br/><h1>${new Date().toISOString()}</h1>`
  );
});
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "the name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "the number is missing",
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({ message: "Name must be unique." });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId().toString(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
