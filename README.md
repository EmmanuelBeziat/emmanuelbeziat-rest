# ![Emmanuel Béziat Logo](public/favicons/favicon-32x32.png) emmanuelbeziat-rest :: Emmanuel Béziat

🎲 A NodeJS App that provide a very simple REST API (just GET) from markdown files.

![Built with](https://img.shields.io/badge/built_with-fastify-blue.svg?style=flat) ![Built With](https://img.shields.io/badge/built_with-nunjucks-green.svg?style=flat
)

## What?

- Fetch markdown files, parse it to create a rest API for blogging
- Environment configuration using dotenv

## Installation

```bash
# Get the repo
git clone git+ssh://git@github.com/EmmanuelBeziat/emmanuelbeziat-rest.git

# Navigate into project folder
cd emmanuelbeziat-rest

# Intall dependencies
npm i
```

## .env file example

```env
PORT=<port>
HOST=<host>
LOGGER=<bool>
POSTS="<folder path>"
CODES="<folder path>"
PORTFOLIO="<folder path>"
```

## Usage

- **Start the application in development mode:**
  ```bash
  npm run dev
  ```
  Launches the application with hot-reloading for development, with changes in real-time with node watch.

- **Start the application in production mode:**
  ```bash
  npm run prod
  ```
  Runs the application in a production environment, optimized for performance and stability, with nodemon.

- **Deploy the application:**
  ```bash
  npm run deploy
  ```
  Deploys the application for production using PM2.

- **Run tests:**
  ```bash
  npm run test
  ```
  Run all tests

- **Run route tests:**
  ```bash
  npm run test:routes
  ```
  Specifically tests the application's routes to verify that they respond correctly.

- **Run environment tests:**
  ```bash
  npm run test:env
  ```
	Checks the environment configurations to ensure all necessary variables are set correctly.

## License

This project is licensed under the MIT License.

--
