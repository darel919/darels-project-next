'use client'

export default function Error({ error, reset }) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-24">
      <div className="flex-col sm:flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 sm:h-12 w-6 sm:w-12" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span className="ml-0 sm:ml-2 py-6 font-light text-3xl sm:text-2xl">{error.message}</span>
      </div>
      <div className="flex gap-4">
        <button onClick={() => window.location.href = '/'} className="btn btn-primary rounded-4xl p-4">
          Return to Home
        </button>
        {/* <button onClick={() => reset()} className="btn btn-secondary">
          Try again
        </button> */}
      </div>
    </section>
  )
}