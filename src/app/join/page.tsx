export default function JoinPage() {
    const formUrl = "https://docs.google.com/forms/d/1TTzWRtjzJbkiUUJgKmIX8aVYjvkV1itZoV0X8Cj7jMw/viewform?embedded=true";

    return (
        <main className="p-4 flex flex-col items-center">
            <div className="max-w-4xl w-full">
                <div className="bg-sky-800 p-4 rounded mb-4 border-2 border-sky-900">
                    <h1 className="font-mono text-2xl font-bold">Join HocoHOC</h1>
                    <p className="text-sm text-slate-300">
                        Fill out the form below to join the Howard County Hour of Code / AI program.
                    </p>
                </div>
                <div className="bg-slate-900/60 border-2 border-slate-800 rounded p-2">
                    <iframe
                        src={formUrl}
                        title="HocoHOC Join Form"
                        className="w-full min-h-[1200px] rounded"
                        loading="lazy"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-3">
                    If the form doesn&apos;t load,{" "}
                    <a href={formUrl.replace("?embedded=true", "")} className="underline hover:text-sky-300" target="_blank" rel="noopener noreferrer">
                        open it in a new tab
                    </a>
                    .
                </p>
            </div>
        </main>
    );
}
