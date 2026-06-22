export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          myskin REST API
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Backend is ready.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Android clients can use the compatibility endpoints{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            /skincare.php
          </code>{" "}
          and{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            /image.php
          </code>
          , which rewrite to the Next.js App Router API routes.
        </p>
      </main>
    </div>
  );
}
