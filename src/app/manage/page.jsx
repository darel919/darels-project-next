import Link from "next/link"

export default async function Manage() {
    return (
        <section className="flex flex-col items-center justify-center py-20 px-6 sm:px-10">
            <div className="z-10 w-full items-center justify-between font-mono text-sm">
                <div className="breadcrumbs text-sm mb-4">
                    <ul>
                        <li><Link href="/" className="link link-primary">Home</Link></li>
                        <li><p><b>Manage</b></p></li>
                    </ul>
                </div>
                <h1 className="text-4xl font-bold my-4">Manage</h1>
                <p>Welcome to dp-Manager. Pick what you want to manage.</p>
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <Link href="/manage/content" className="card bg-primary text-primary-content shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body">
                            <p className="card-title text-lg">Content Studio</p>
                            <p className="text-sm">Manage and organize your content efficiently.</p>
                        </div>
                    </Link>
                    <Link href="/manage/categories" className="card bg-primary text-secondary-content shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body">
                            <p className="card-title text-lg">Categories</p>
                            <p className="text-sm">Organize your categories.</p>
                        </div>
                    </Link>
                </section>
            </div>
        </section>
    )
}