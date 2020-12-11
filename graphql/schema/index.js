const { gql } = require("apollo-server-express");
const UrlShortner = require("../../models/UrlShortner");
const shortid = require("shortid");
const { base } = require("../../models/UrlShortner");
const validUrl = require("valid-url");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    urlShortners: [UrlShortner!]
  }

  type Mutation {
    createUrlShortner(input: UrlShortnerInput!): UrlShortnerPayload
  }

  input UrlShortnerInput {
    originalUrl: String!
  }

  type UrlShortnerPayload {
    error: String
    urlShortner: UrlShortner
  }

  type UrlShortner {
    _id: String
    slug: String
    originalUrl: String
    shortUrl: String
    createdAt: String
    updatedAt: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello World!",
    urlShortners: async () => {
      return await UrlShortner.find();
    },
  },
  Mutation: {
    createUrlShortner: async (_, { input }) => {
      let { originalUrl } = input;
      // check if the the url is valid, return 401
      if (!validUrl(originalUrl)) {
        // try adding the protocol
        originalUrl = `http://${originalUrl}`;
        if (!validUrl(originalUrl)) {
          return { error: "Invalid url, please check your url" };
        }
      }

      const existingShortner = await UrlShortner.findOne({ originalUrl });
      // comment this out if we want to allow creating multiples short urls with the same originalUrl
      if (existingShortner) {
        return { urlShortner: existingShortner };
      }

      const slug = shortid.generate();
      try {
        const urlShortner = new UrlShortner({ originalUrl, slug });
        const saveShortner = await urlShortner.save();
        return { urlShortner: saveShortner };
      } catch (error) {
        return { error: error.message };
      }
    },
  },
  UrlShortner: {
    shortUrl: (parent) => {
      // TODO: move to env
      const baseURL = "http://localhost:2000";
      return `${baseURL}/${parent.slug}`;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
