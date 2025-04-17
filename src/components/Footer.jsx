"use server"

import fs from 'fs/promises';
import path from 'path';

import Link from "next/link"

export default async function Footer() {
    let versionData = { version: "N/A", buildDate: "N/A" };
    try {
        const filePath = path.join(process.cwd(), 'public', 'versioning', 'v');
        const fileContent = await fs.readFile(filePath, 'utf8');
        versionData = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading version data:', error);
    }
    return (
        <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content pt-10 pb-20 px-8 flex flex-col border-secondary border-t-1">  
            <Link href="/" className="flex items-center">
                <img src="/favicon.ico" alt="darel's Projects" className="w-12 h-12 rounded-full" />

                <section className='ml-2'>
                <h2 className="font-bold text-xl">darel's Projects</h2>
                {versionData.version !== "N/A" && (
                    <div className="text-xs opacity-35 font-mono">
                        <p>Version: {versionData.version}</p>
                        <p>Build: {new Date(versionData.buildDate).toLocaleDateString()}</p>
                    </div>
                    )}
                </section>
            </Link>

            <nav>
                <h6 className="footer-title">External Links</h6>
                <a className="link link-hover" href="/about">About This Site</a>
                <a className="link link-hover" target="_blank" href="https://github.com/darel919/darels-project-next">darel's Projects on GitHub</a>
                <a className="link link-hover" target="_blank" href="https://darelisme.my.id">DWS Home</a>
            </nav>
        </footer>
    )
}