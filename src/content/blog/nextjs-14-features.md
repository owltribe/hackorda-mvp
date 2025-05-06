---
title: 'Next.js 15: Key Features and Breaking Changes'
date: '2024-10-21' # Official Next.js 15 release date
category: 'Frameworks'
readTime: '6 min read' # Adjusted read time
image: '/images/blog/nextjs-15-hero.png' # Placeholder for Next.js 15 image
---

Next.js 15 is officially stable and ready for production as of October 21st, 2024. This release introduces significant updates, including support for React 19, important caching changes, and several new APIs and improvements focused on stability and developer experience.

## Upgrade Seamlessly with @next/codemod CLI

To help automate the upgrade process, Next.js introduced an enhanced codemod CLI. Running the following command helps update dependencies and apply necessary code transformations:

```bash
npx @next/codemod@canary upgrade latest
```

This tool simplifies migrating breaking changes introduced in this version. Learn more about the [Next.js Codemod CLI](https://nextjs.org/blog/next-15#smooth-upgrades-with-nextcodemod-cli).

## Breaking Change: Async Request APIs

To enable future optimizations like preparing parts of the page before a request arrives, APIs relying on request-specific data are now **asynchronous**. This affects:

*   `cookies()` from `next/headers`
*   `headers()` from `next/headers`
*   `draftMode()` from `next/headers`
*   `params` in layouts, pages, routes, etc.
*   `searchParams` in pages

You now need to `await` these functions:

```javascript
import { cookies } from 'next/headers';
 
export async function MyComponent() {
  const cookieStore = await cookies(); // Must use await
  const token = cookieStore.get('token');
  // ...
}
```

A specific codemod (`npx @next/codemod@canary next-async-request-api .`) is available to help automate this migration. See the [Async Request APIs upgrade guide](https://nextjs.org/blog/next-15#async-request-apis-breaking-change) for details.

## Breaking Change: Caching Semantics

Based on community feedback and future plans like Partial Prerendering (PPR), Next.js 15 changes some caching defaults:

*   **`GET` Route Handlers:** No longer cached by default. You must explicitly opt-in using `export dynamic = 'force-static'` if you need the previous caching behavior.
*   **Client Router Cache:** Page components are no longer cached by default during client-side navigation. This simplifies the caching model but means navigations might fetch data more often unless specific caching strategies (like `revalidate` options in `fetch`) are used.

These changes aim for a more predictable caching behavior. Read more about the [Caching Semantics changes](https://nextjs.org/blog/next-15#caching-semantics).

## React 19 Support

Next.js 15 includes support for [React 19](https://react.dev/blog/2024/04/25/react-19), bringing features like Actions, `useOptimistic`, `useActionState`, and the new `ref` prop capabilities. It also supports the experimental **React Compiler** and includes improved hydration error messages.

![React 19 Logo](/images/blog/react-19-logo.png)

## Turbopack Dev (Stable)

Turbopack for the Next.js development server (`next dev --turbo`) is now stable, offering significant performance and stability improvements for local development.

## Other Notable Updates

*   **`instrumentation.js` (Stable):** API for server lifecycle observability.
*   **`unstable_after` API (Experimental):** Execute code *after* a response finishes streaming.
*   **Enhanced Forms (`next/form`):** New experimental utilities to enhance HTML forms.
*   **`next.config.ts` Support:** Configure Next.js using TypeScript.
*   **Bundling External Packages (Stable):** New configuration options.
*   **ESLint 9 Support.**

Next.js 15 represents a major step forward, refining the App Router, embracing React 19, and adjusting core primitives like caching based on developer feedback. While the breaking changes require attention during upgrade, the new codemod tool aims to streamline the process. Dive into the [official Next.js 15 announcement](https://nextjs.org/blog/next-15) for all the details. 