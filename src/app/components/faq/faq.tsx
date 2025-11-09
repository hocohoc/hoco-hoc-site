
import React from 'react';
import FaqQuestion from './FaqQuestion/faqQuestion'

export default function Faq() {

    return (
        <div className="p-4 py-20 md:py-32 md:p-8 flex-col items-center text-center bg-gradient-to-tr from-gray-950 to-gray-900">
            <h3 className="font-mono mt-8 ml-25 mr-25 text-sky-300 font-bold bg-gradient-to-b from-gray-300 to-gray-400 text-transparent bg-clip-text text-5xl md:text-6xl mb-8 text-center leading-tight">Frequently Asked Questions</h3>
            <div className="mb-10 font-sans w:32 text-sm md:text-lg max-w-screen-xl mx-auto flex flex-col :text-4xl md:flex-row gap-0 md:gap-10 justify-center items-start">
                <div className="w-full md:w-1/2 flex flex-col">
                    <FaqQuestion
                        question={"When is the Hour of Code?"}
                        answer={`Howard County Hour of Code is a 7-day event taking place from December 8 to December 14, 2025.`}
                    />
                    <FaqQuestion
                        question={"How do I participate in the Hour of Code?"}
                        answer={`Login on the website using your HCPSS Google account, navigate to the Articles tab on this website, and start reading articles and answering questions! By completing articles, you will earn you and your school points.`}
                    />
                    <FaqQuestion
                        question={"What device should I use?"}
                        answer={`Any device should work fine, we've worked hard to provide a good experience on all screen sizes. However, if you do experience a problem, using a larger screen never hurts!`}
                    />
                    <FaqQuestion
                        question={"How do the points/prizes work?"}
                        answer={`
                        Points are earned by completing articles, which are transformed into raffle tickets at the end of the event. Scroll up to our prizes section to see what you can win this year.
                    `}

                    />
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                    <FaqQuestion
                        question={"Why should I learn about computer science?"}
                        answer={`Computer science helps nurture problem-solving skills, logic and creativity. Every student should have the opportunity to learn computer science, and through this event, you will get the chance to see what computer science is all about and its wide range of topics. By starting early in learning about computer science, students will have a foundation for success in any 21st-century career path.`}
                    />
                    <FaqQuestion
                        question={"How do I keep learning after Hour of Code?"}
                        answer={`If you liked learning about CS, then consider taking some of our county’s courses! CS is also unique in that there is a wide array of online resources to help you learn, from YouTube tutorials to free courses to online forums. Make sure to take advantage of these!`}
                    />
                    <FaqQuestion
                        question={"I still have questions. Where can I ask them?"}
                        answer={`Please email any questions to mdhocohoc@gmail.com and we will get back to you as soon as possible.`}
                    />
                    <FaqQuestion
                        question={"I found something wrong, what do I do?"}
                        answer={`If you find a bug or incorrect information in an article, please report it to mdhocohoc@gmail.com. Bug hunters may receive special swag!`}
                    />
                </div>
            </div>
        </div>
    )
}

