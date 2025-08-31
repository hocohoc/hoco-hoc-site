import TeamCard from './teamCard';
import React from 'react';

export default function TeamSection() {
    const teamMembers = [
        //directors
        { name: "Daniel Gao", position: "Director", image: "/headshots/daniel_headshot.png" },
        { name: "Ankit Mohanty", position: "Director", image: "/headshots/ankit_headshot.png" },
        { name: "Jayson Liu", position: "Web Dev", image: "/headshots/jayson_headshot.jpg" },
        { name: "Oluwadarasimi Adedeji", position: "Web Dev", image: "/headshots/dara_headshot.jpg" },
        { name: "Jay Patel", position: "Article Lead", image: "/headshots/jay_headshot.jpg" },
        { name: "Tristan Carter", position: "Articles", image: "/headshots/tristan_headshot.png" },
        { name: "Sai Chandra", position: "Articles", image: "/headshots/sai_headshot.png" },
        { name: "Suhas Anumolu", position: "Articles", image: "/headshots/suhas_headshot.png" },
        { name: "Annchi Liu", position: "Articles", image: "/headshots/annchi_headshot.png" },
        { name: "Ayaan Kalra", position: "Articles", image: "/headshots/ayaan_headshot.jpg" },
        // { name: "Austen Shaheen", position: "Articles", image: "/headshots/austen_headshot.jpg" },
        { name: "Ayush Mishura", position: "Articles", image: "/headshots/ayush_headshot.png" },
        { name: "Raj Bhagat", position: "Articles", image: "/headshots/raj_headshot.jpg" },
        { name: "Yoan Fodjong", position: "Articles", image: "/headshots/yoan_headshot.png" },
        { name: "Anjali Vallabhaneni", position: "Outreach", image: "/headshots/anjali_headshot.jpg" },
        { name: "Daniel Oh", position: "Outreach", image: "/headshots/daniel_oh_headshot.png" },
        // { name: "Shalin Vakil", position: "Sponsorships", image: "/headshots/shalin_headshot.jpg" },
    ];

    return (
        <div className="flex flex-col items-center p-4 md:p-8 py-20 md:py-32">
            <h3 className="font-mono text-sky-300 font-bold bg-gradient-to-b from-sky-300 to-sky-500 text-transparent bg-clip-text text-5xl md:text-6xl mb-10 text-center">Meet the Team</h3>
            <div className="flex w-full flex-col max-w-screen-xl items-center">
                <div className="gap-x-4 gap-y-4 grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr justify-center">
                    {teamMembers.map((member, index) => (
                        <TeamCard key={index} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );

}
