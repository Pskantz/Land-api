const router = (app) => {
  app.get("/countries/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const country = countries.find((country) => country.id === id);
    if (!country) {
      return res.status(404).json({ message: "Landet kunde inte hittas" });
    }
    const { name, population, capital, language } = country;
    res.json({ name, population, capital, language });
  });

  // Middleware för att verifiera säkerhetskoden
  const verifySecurityCode = (req, res, next) => {
    const securityCode = req.headers["x-security-code"];
    if (!securityCode || securityCode !== "mySecurityCode") {
      return res.status(401).json({ message: "Ogiltig säkerhetskod" });
    }
    next();
  };

  // Route för att lägga till ett nytt land
  //   app.post("/countries", verifySecurityCode, (req, res) => {
  //     const { name, population, capital, language } = req.body;
  //     const id = countries.length + 1;
  //     const newCountry = { id, name, population, capital, language };
  //     console.log(Object.keys(req.body));
  //     if (req.body > 4) {
  //       return res.status(400).json({ message: "Ogiltig data" });
  //     } else {
  //       countries.push(newCountry);
  //       res.status(201).json(newCountry);
  //     }
  //   });

  app.post("/countries", verifySecurityCode, (req, res) => {
    const { name, population, capital, language } = req.body;
    const allowedKeys = ["name", "population", "capital", "language"];
    const receivedKeys = Object.keys(req.body);

    // Kolla om någon av de mottagna nycklarna inte är tillåten
    const invalidKeys = receivedKeys.filter(
      (key) => !allowedKeys.includes(key)
    );
    if (invalidKeys.length > 0) {
      return res.status(400).json({ message: "Ogiltig data" });
    }

    const id = countries.length + 1;
    const newCountry = { id, name, population, capital, language };
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
};

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

module.exports = router;
