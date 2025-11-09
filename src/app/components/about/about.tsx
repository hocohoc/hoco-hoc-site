import Link from "next/link";
import Leaderboard from "../leaderboard/leaderboard";
import { School } from "@/app/services/schoolsService";
import ArticleRenderer from "@/app/components/article-renderer/articleRenderer";
import { Typewriter } from "react-simple-typewriter";


export default function AboutSection() {
    const phrases = [
        "CS",
        "Algorithms",
        "Web Dev",
        "ML",
        "Python",
        "Java",
        "C++"
    ]


    const dummySchools: School[] = [
        { id: "School 1", name: "School 1", score: 5000 },
        { id: "School 2", name: "School 2", score: 4000 },
        { id: "School 3", name: "School 3", score: 3000 },
        { id: "School 4", name: "School 4", score: 2000 },
        { id: "School 5", name: "School 5", score: 1000 }
    ];

    const article = {
        title: "Hello World",
        description: "This is a dummy article for demonstration purposes.",
        tags: ["Dummy", "Demo", "Article"],
        content: "The “Hello World!” program is the first step in learning how to code with any language. This tradition was first established in the 70s by Nokia Bell Labs and has since advanced into the famous first line of code that most programmers write. It is a program that prints the text “Hello World!” to some output stream, usually the console, and it’s primarily taught for three purposes..."
    };

    const progressData = [
        { percentage: 100, color: "text-sky-400" },
        { percentage: 75, color: "text-sky-400" },
        { percentage: 50, color: "text-sky-400" },
        { percentage: 25, color: "text-sky-400" }
    ];


    return (
        <div className="p-4 md:p-8 md:py-32 py-16 w-full flex flex-wrap justify-center">
            <div className="max-w-screen-xl w-full flex flex-col gap-20 md:gap-32 justify-center">
                <div>
                    <h3 className="text-slate-200 font-bold  text-5xl md:text-6xl leading-tight pb-8">Learn <span className="block md:inline bg-gradient-to-b from-sky-300 to-sky-500 text-transparent bg-clip-text font-mono"><Typewriter words={phrases} cursor={true} cursorStyle={"_"} loop={true} /></span> <span className="underline">the fun way! </span> </h3>
                    <p className="text-lg md:text-xl font-sans text-slate-300 flex flex-row gap-2 w-full max-w-4xl">
                        The Hour of Code started as a one-hour introduction to computer science, designed to demystify &quot;code&quot;, to show that anybody can learn the basics, and to broaden participation in the field of computer science. It has since become a worldwide effort to celebrate computer science, starting with 1-hour coding activities but expanding to all sorts of community efforts. Howard County&apos;s version of Hour of Code is made by students, for students.
                    </p>
                </div>

                <div className="flex flex-col gap-8 md:gap-12 md:flex-row items-center md:space-x-4">
                    <div className="md:flex-1">
                        <h3 className="font-mono text-4xl md:text-5xl bg-gradient-to-r from-sky-300 to-sky-500 text-transparent bg-clip-text font-bold pb-4 md:pb-10">Compete For Glory!</h3>
                        <p className="font-sans mb-10  text-l text-slate-300 md:text-xl">We aim to provide aspiring computer scientists with an opportunity for skill development and friendly competition. Visit the leaderboard to check out how your high school is doing! All Howard County schools and corresponding points will be displayed here.</p>
                        <Link href={"/leaderboard"} className="btn-secondary font-mono text-lg">View Leaderboard</Link>
                    </div>

                    <div className="md:flex-1 w-full h-full md:w-60 lg:w-0 text-slate-300 bg-gray-900 rounded-md border-gray-800 border-2 overflow-hidden">
                        <Leaderboard schools={dummySchools} />
                    </div>

                </div>


                <div className="flex flex-col-reverse gap-8 md:gap-12 items-center md:flex-row">
                    <div className="md:flex-1 relative w-full h-full text-slate-300 bg-slate-800 rounded-lg border-b-2 border-gray-900 overflow-hidden">
                        <div className="absolute z-20 w-full h-full bg-gradient-to-b from-transparent via-70% via-transparent to-slate-800 rounded-lg"></div>
                        <div className="text-left w-full h-full p-4 ">
                            <div className="flex flex-row mt-5 items-center gap-2">
                                <h1 className="text-4xl md:text-5xl font-bold">{article.title}</h1>
                            </div>
                            <p className="font-mono mt-2 text-slate-300 text-sm">{article.description}</p>
                            <div className="font-mono flex gap-2 mt-2">
                                {article.tags.map((tag, index) => (
                                    <div key={index} className="bg-sky-300 text-slate-950 p-1 rounded-sm text-xs font-bold">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                            <hr className="mt-3 border-b border-slate-600" />
                            <ArticleRenderer markdown={article.content} />
                        </div>
                    </div>


                    <div className="md:flex-1 w-full font-mono">
                        <h3 className="font-mono leading-tight text-4xl md:text-5xl bg-gradient-to-r from-sky-300 to-sky-500 text-transparent bg-clip-text font-bold pb-4 md:pb-10"> Learn New Topics! </h3>
                        <p className="font-sans mb-10 text-lg md:text-xl text-slate-300">HocoHOC offers a wide variety of interesting and informative articles and games on computer science topics. By completing them, you&apos;ll not only acquire new skills but also earn your school points!</p>
                        <Link href={"/articles"} className="btn-secondary font-mono text-lg">View Articles</Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                    <div className="md:flex-1">
                        <h3 className="font-mono leading-tight text-4xl md:text-5xl bg-gradient-to-r from-sky-300 to-sky-500 text-transparent bg-clip-text font-bold pb-4 md:pb-10">Track Your Progress!</h3>
                        <p className="font-sans text-lg text-slate-300 md:text-xl mb-10">Complete quizzes to earn points! You&apos;ll be able to see how you progress through four sections: Fundamentals, Data Structures & Algorithms, Web Development, and Machine Learning.</p>
                        <Link href={"/me"} className="btn-secondary font-mono text-lg">View Dashboard</Link>
                    </div>
                    <div className="md:flex-1 w-full h-full justify-center">
                        <div className="bg-slate-800 w-full h-full rounded-lg p-4 grid grid-cols-2 grid-rows-2 justify-center items-center">
                            {progressData.map((item, index) => (
                                <div key={index} className="text-center flex flex-col items-center justify-center py-2 md:py-0 px-4 md:px-1">
                                    {/* Progress bar */}
                                    <svg className="w-24 h-24 md:w-24 md:h-24 lg:w-36 lg:h-36 relative z-10">
                                        <circle
                                            className="stroke-current text-slate-700"
                                            strokeWidth="8"
                                            fill="transparent"
                                            r="40"
                                            cx="50%"
                                            cy="50%"
                                        />
                                        <circle
                                            className={`stroke-current ${item.color}`}
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray="251.327"
                                            strokeDashoffset={(100 - item.percentage) / 100 * 251.327}
                                            r="40"
                                            cx="50%"
                                            cy="50%"
                                        />
                                        <text
                                            x="50%"
                                            y="52.5%"
                                            className={`text-lg font-bold fill-current ${item.color}`}
                                            dominantBaseline="middle"
                                            textAnchor="middle"
                                        >
                                            {`${item.percentage}%`}
                                        </text>
                                    </svg>
                                    <div className="text-md md:text-lg ">{"Section " + (index + 1)}</div> {/* Added text under each progress bar */}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
