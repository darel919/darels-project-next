'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-12">
          <div className="alert alert-error mb-4 max-w-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>An unexpected error occurred</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.location.href = '/'} className="btn text-[var(--color-text)] btn-primary hover:bg-secondary">
              Go Home
            </button>
            <button onClick={() => reset()} className="btn text-[var(--color-text)] btn-primary hover:bg-secondary">
              Try again
            </button>
          </div>
        </section>
      </body>
    </html>
  )
}