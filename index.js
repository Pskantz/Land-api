const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

// Middleware för att parse request bodies
app.use(express.json());

// Middleware för att verifiera att de inskickade fälten är korrekta
const validateNewCountry = (req, res, next) => {
  const allowedFields = ["name", "population", "capital", "language"];
  const receivedFields = Object.keys(req.body);
  const invalidFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );
  if (invalidFields.length > 0) {
    return res
      .status(404)
      .json({ message: `Invalid fields: ${invalidFields.join(", ")}` });
  }
  next();
};

// Mock-data för länder
let countries = [
  {
    id: 1,
    name: "Sverige",
    population: 10000000,
    capital: "Stockholm",
    language: "svenska",
  },
  {
    id: 2,
    name: "Norge",
    population: 5000000,
    capital: "Oslo",
    language: "norska",
  },
  {
    id: 3,
    name: "Danmark",
    population: 6000000,
    capital: "Köpenhamn",
    language: "danska",
  },
];

// Middleware för att verifiera säkerhetskoden
const verifySecurityCode = (req, res, next) => {
  const securityCode = req.headers["x-security-code"];
  if (!securityCode || securityCode !== "mySecurityCode") {
    return res.status(401).json({ message: "Ogiltig säkerhetskod" });
  }
  next();
};

// Route för att hämta information om ett specifikt land
app.get("/countries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const country = countries.find((country) => country.id === id);
  if (!country) {
    return res.status(404).json({ message: "Landet kunde inte hittas" });
  }
  const { name, population, capital, language } = country;
  res.json({ name, population, capital, language });
});

// Route för att lägga till ett nytt land
app.post("/countries", verifySecurityCode, (req, res) => {
  const { name, population, capital, language } = req.body;
  const id = countries.length + 1;
  const newCountry = { id, name, population, capital, language };
  console.log(newCountry);
  countries.push(newCountry);
  res.status(201).json(newCountry);
});

// Route för att redigera information om ett land
app.put("/countries/:id", verifySecurityCode, (req, res) => {
  const id = parseInt(req.params.id);
  const country = countries.find((country) => country.id === id);
  if (!country) {
    return res.status(404).json({ message: "Landet kunde inte hittas" });
  }
  const { name, population, capital, language } = req.body;
  country.name = name || country.name;
  country.population = population || country.population;
  country.capital = capital || country.capital;
  country.language = language || country.language;
  res.json(country);
});

// Route för att ta bort ett land
app.delete("/countries/:id", verifySecurityCode, (req, res) => {
  const id = parseInt(req.params.id);
  const index = countries.findIndex((country) => country.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Landet kunde inte hittas" });
  }
  countries.splice(index, 1);
  res.status(204).send();
});

// Starta servern
app.listen(port, () => {
  console.log(`Servern lyssnar på http://localhost:${port}`);
});
