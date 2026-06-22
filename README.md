![Emmanuel Béziat Logo](public/favicons/favicon-96x96.png)

# emmanuelbeziat-rest :: Emmanuel Béziat

🎲 A NodeJS App that provide a very simple REST API (just GET) from markdown files.

![Built with](https://img.shields.io/badge/built_with-fastify-blue.svg?style=flat) ![Language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)

## What?

- Fetch markdown files, parse it to create a rest API for blogging
- Environment configuration using dotenv

## Installation

```bash
# Get the repo
git clone git+ssh://git@github.com/EmmanuelBeziat/emmanuelbeziat-rest.git

# Navigate into project folder
cd emmanuelbeziat-rest

# Install dependencies
npm i
```

## Configuration

The app reads its content from filesystem paths and requires the variables
below; they are validated at startup. Copy `.env.example` to `.env` and fill
them in, or run `npm run setup` to generate `.env` interactively.

```env
PORT=<port>
HOST=<host>
POSTS="<folder path>"
CODES="<folder path>"
PORTFOLIO="<folder path>"
RSS="<rss.xml path>"
CORS_ORIGIN="<allowed origin url>"
```

## Usage

- **Start the application in development mode:**
  ```bash
  npm run dev
  ```
  Compiles the TypeScript sources and runs the app with `node --watch` for hot-reloading.

- **Start the application in production mode:**
  ```bash
  npm run prod
  ```
  Compiles the sources and runs the compiled app from `dist/`.

- **Build only:**
  ```bash
  npm run build
  ```
  Compiles `src/` to `dist/` with `tsc`.

- **Deploy the application:**
  ```bash
  npm run deploy
  ```
  Deploys for production using PM2.

- **Run tests:**
  ```bash
  npm run test
  ```
  Runs the full test suite once with Vitest. Use `npx vitest <file>` to run or watch a single test file.

- **Lint:**
  ```bash
  npm run lint
  ```
  Lints the TypeScript sources in `src/` with ESLint.

## License

This project is licensed under the MIT License.
