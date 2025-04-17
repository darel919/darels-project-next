'use client';

import { useAuthStore } from "@/lib/authStore";
import Link from "next/link";

export default function CategoriesHeader({title, desc, id}) {
  const { userSession } = useAuthStore();
  const isSuperadmin = userSession?.user?.user_metadata?.provider_id === process.env.NEXT_PUBLIC_SUPERADMIN;

  return (
    <section className="flex flex-row items-center justify-between">
      <section>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="mb-2">{desc}</p>
      </section>
      {isSuperadmin && (
        <Link href={`/manage/categories/edit?list=${id}`}>
          <button className='btn btn-primary text-color text-[var(--color-text)]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            Manage
          </button>
        </Link>
      )}
    </section>
  );
}