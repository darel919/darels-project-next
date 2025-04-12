import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-24">
      <div className="flex-row sm:flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>

        <div className='ml-0 sm:ml-4'>
          <h1 className="py-4 sm:pt-4 font-light text-5xl sm:text-4xl">Page Not Found</h1>
          <p className="font-light text-md sm:text-lg">It seems like you may've been lost. Let's go home.</p>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-12">
        <Link href="/" className="btn btn-primary rounded-4xl p-4">
          Home
        </Link>
      </div>
    </section>
  );
}