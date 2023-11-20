## Installation

### To install this project, follow these steps:

- #### Clone this repository to your local machine move to backend folder
- #### Install the required dependencies by running npm install.

#### Start the server by running `npm run server`.

## API Documentation

POST `/url/shorten`
Shortens a long URL and returns the shortened URL.

Request Body

```json
{
  "longUrl": "string"
}
```

Response

```json
{
  "shortUrl": "string"
}
```

- `shortUrl` (string): The shortened URL.


