# URL shortener 
> to create a short URL from a long url

You will be able to create a a short url via GraphQL and able to go to the short url and it will redirect via a status code 301, to the original url.

## Installation
```sh
yarn install
```

## Development setup

```sh
yarn run start:dev

touch .env // << would need to add MONGO_DB_URI=mongodb uri
```

## Usage example

visit: http://localhost:2000/graphql

to create a new UrlShortener object, you can call this mutation: 
```gql
mutation createUrlShortner($input: UrlShortnerInput!) {
  createUrlShortner(input: $input) {
    error
    urlShortner {
      _id
      slug
      originalUrl
    }
  }
}

{
  "input":{
    "originalUrl": "webflow.com" 
  }
}
```

to fetch all the current saved urls:
```gql

query {
  hello
  urlShortners {
    _id
    originalUrl
    slug
    createdAt
    updatedAt
    shortUrl
  }
}
```
