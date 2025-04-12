import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-24">
      <div className="flex-row sm:flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg>

        <div className='ml-0 sm:ml-4'>
          <h1 className="py-4 sm:pt-4 font-light text-5xl sm:text-3xl">This video isn't available</h1>
          <p className="font-light text-md sm:text-lg">It may have been removed, unavailable, or you might have an invalid link.</p>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-12">
        <Link href="/" className="btn btn-primary rounded-4xl p-4">
          Return to Home
        </Link>
      </div>
    </section>
  );
}