import TeamCard from './teamCard';
import React from 'react';

export default function TeamSection() {
    const teamMembers = [
        //directors
        { name: "Daniel Gao", position: "Director", image: "/headshots/daniel_headshot.png" },
        { name: "Ankit Mohanty", position: "Director", image: "/headshots/ankit_headshot.png" },
        { name: "Oluwadarasimi Adedeji", position: "Web Dev", image: "/headshots/dara_headshot.jpg" },
        { name: "Jay Patel", position: "Article Lead", image: "/headshots/jay_headshot.jpg" },
        { name: "Sai Chandra", position: "Articles", image: "/headshots/sai_headshot.png" },
        { name: "Austen", position: "Articles", image: "/headshots/austen_img.jpg" },
        { name: "Ayaan Kalra", position: "Articles", image: "/headshots/ayaan_headshot.jpg" },
        { name: "Raj Bhagat", position: "Articles", image: "/headshots/raj_headshot.jpg" },
        { name: "Nicholas Chen", position: "Articles", image: "/headshots/NicholasChen_headshot.jpg" },
        { name: "Suhas Anumolu", position: "Articles", image: "/headshots/suhas_headshot.png" },
        { name: "Daniel Oh", position: "Outreach", image: "/headshots/daniel_oh_headshot.png" },
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
