import TeamCard from './teamCard';
import React from 'react';

export default function TeamSection() {
    const teamMembers = [
        //directors
        { name: "Ankit Mohanty", position: "Director", image: "/headshots/ankit_headshot.png" },
        { name: "Nicholas Chen", position: "Co-Director", image: "/headshots/nicholas_headshot.png" },

        //sponsorship
        { name: "Roshan Gopi", position: "Sponsorship", image: "/headshots/roshan.jpg" },
        { name: "Ruchi Basatwar", position: "Sponsorship", image: "/headshots/ruchi.jpg" },
        { name: "Ethan Zhang", position: "Sponsorship", image: "/headshots/ethan_headshot.jpg" },

        //articles
        { name: "Saibilila Abudukelimu", position: "Articles", image: "/headshots/saibi.jpg"},
        { name: "Vrukshav Viswanath", position: "Articles", image: "/headshots/vrukshav.jpg" },
        { name: "Rudra Jhawar", position: "Articles", image: "/headshots/rudra.jpg" },
        { name: "Ehaan Akbar", position: "Articles",image: "/headshots/ehaan.jpg" },
        { name: "Jonathan Barrett", position: "Articles", image: "/headshots/jonathan.jpg" },
        { name: "Shwetha Vijayabhaskar", position: "Articles", image: "/headshots/shwetha.jpg" },
        { name: "Norman Adams", position: "Articles", image: "/headshots/norman.jpg" },
        { name: "Sherry Wei", position: "Articles", image: "/headshots/sherry_headshot.jpg" },
        //outreach
        { name: "Austen Shaheen", position: "Outreach", image: "/headshots/austen_img.jpg" },
        { name: "Temi Apata", position: "Outreach", image: "/headshots/temi.jpg" },
        { name: "Asiya Nasher-Alneam" , position: "Outreach"},

    ];

    return (
        <section aria-labelledby="team-heading" className="bg-slate-900 px-6 pt-12 pb-8 sm:px-8 md:pt-16 md:pb-10">
            <div className="mx-auto max-w-screen-xl">
                <header className="mb-4 border-b border-slate-700 pb-8">
                    <h2 id="team-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Meet the team</h2>
                    <p className="mt-3 text-base leading-relaxed text-slate-300">The students behind Howard County Hour of Code.</p>
                </header>
                <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 xl:grid-cols-3">
                    {teamMembers.map((member) => (
                        <li key={member.name} className="border-b border-slate-800 py-6">
                            <TeamCard member={member} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
