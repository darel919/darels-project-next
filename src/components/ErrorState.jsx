'use client';

import { useRouter } from 'next/navigation';

export default function ErrorState({ message, actionText = "Return to Home", actionDesc, action = "home" }) {
  const router = useRouter();
  
  const handleAction = () => {
    switch (action) {
      case 'reload':
        window.location.reload();
        break;
      case 'home':
        router.push('/');
        break;
      case 'categories':
        router.push('/categories');
        break;
      case 'manage':
        router.push('/manage');
        break;
      default:
        if (action.startsWith('/')) {
          router.push(action);
        } else {
          router.push('/');
        }
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-12">
      <div className="flex-row sm:flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-10 sm:h-12 w-10 sm:w-12" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex flex-col ml-0 sm:ml-4">
          <span className="my-4 sm:my-0 font-light text-4xl">{message}</span>
          {actionDesc && <p className="mt-2 text-md">{actionDesc}</p>}
        </div>
      </div>
      <button onClick={handleAction} className="btn text-[var(--color-text)] btn-primary hover:bg-secondary rounded-4xl p-4 mt-4 sm:mt-6">
        {actionText}
      </button>
    </section>
  );
}