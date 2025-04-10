import Link from "next/link"

export default function Footer() {
    return (
        <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content py-16 px-8 flex flex-col">  
            <Link href="/" className="flex items-center gap-2">
                <img src="/favicon.ico" alt="darel's Projects" className="w-12 h-12 rounded-full" />
                <h2>darel's Projects</h2>
            </Link>
            <nav>
                <h6 className="footer-title">Links</h6>
                <a className="link link-hover" target="_blank" href="https://github.com/darel919/darels-project-next">darel's Projects on GitHub</a>
                <a className="link link-hover" target="_blank" href="https://darelisme.my.id">DWS Home</a>
            </nav>
        </footer>
    )
}