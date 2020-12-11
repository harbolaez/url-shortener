require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const UrlShorter = require("./models/UrlShortner");

const { typeDefs, resolvers } = require("./graphql/schema");

connectDB();

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.applyMiddleware({ app });

app.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const urlShorter = await UrlShorter.findOne({ slug });
    if (urlShorter) {
      res.status(301).redirect(urlShorter.originalUrl);
    }
    return res.status(400).json({ message: "This short url doesn't exists" });
  } catch (_) {
    res.status(500).json({ message: "Internal error" });
  }
});

app.use(cors({ origin: "*" }));

app.get("/api/status", (req, res) => {
  res.send({ status: "ok" });
});

app.listen({ port: 2000 }, () =>
  console.log(`🚀 Server ready at http://localhost:2000${server.graphqlPath}`)
);
