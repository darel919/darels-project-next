"use server"

import Link from "next/link"
import VersionDisplay from "./VersionDisplay"
import versionData from '@/generated/version-info.json';

export default async function Footer() {
    const appVersion = versionData.version || "N/A";
    const appBuildDate = versionData.buildDate || "N/A";

    return (
        <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-8 flex flex-col border-secondary border-t">
            <Link href="/" className="flex items-center">
                <img src="/favicon.ico" alt="darel's Projects" className="w-12 h-12 rounded-full" />
                <section className='ml-2'>
                    <h2 className="font-bold text-xl">darel's Projects</h2>
                    <VersionDisplay version={appVersion} buildDate={appBuildDate} />
                </section>
            </Link>
            <nav>
                <h6 className="footer-title">Links</h6>
                <a className="link link-hover" href="/about">About This Site</a>

                <a className="link link-hover" target="_blank" href="https://github.com/darel919/darels-project-next">darel's Projects on GitHub</a>
                <a className="link link-hover" target="_blank" href="https://darelisme.my.id" title="DWS home page">DWS Home</a>
                <a className="link link-hover" target="_blank" href="https://status.darelisme.my.id" title="DWS status page">Status</a>
                <a className="link link-hover" target="_blank" href="/sitemap.xml" title="Sitemap">Sitemap</a>
            </nav>
            <aside>
                <p className="opacity-40 text-xs">This site uses Microsoft Clarity and Google Analytics to help gather usage statistics.</p>
            </aside>
        </footer>
    )
}