This is a [Next.js](https://nextjs.org) Orchid Web Shop implementation using [Vercel](https://vercel.com) as backend and [MongoDB](https://cloud.mongodb.com/) as database.

## Getting Started

First, install dependencies:

```bash
npm install
```

And run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## CI

The CI build executes the following checks:

- compiles the app,
- runs the tests,
- deploys the results to GitHub Pages

The CI is triggered for every check in to the `develop` and `main` branches, and also for pull requests created with these branches as target.

## Deployment

The deployment is done automatically by the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

- The `develop` branch is deployed to QA: https://moonshine-orchids-qa.vercel.app/
- The `main` branch is deployed to Production: https://moonshine-orchids.vercel.app/
