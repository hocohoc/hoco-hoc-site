export default function LeadershipIntro() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://hocohoc.org/#ankit-mohanty",
        name: "Ankit Mohanty",
        jobTitle: "Director",
        description: "Ankit Mohanty is the Director of HoCoHOC, Howard County Hour of Code / AI.",
        memberOf: {
            "@type": "Organization",
            "@id": "https://hocohoc.org/#organization",
            name: "Howard County Hour of Code / AI",
            alternateName: "HoCoHOC",
            url: "https://hocohoc.org/",
        },
    };

    return (
        <>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300">
                HoCoHOC is led by Director Ankit Mohanty and Co-Director Nicholas Chen,
                bringing coding and AI activities to students across Howard County.
            </p>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </>
    );
}
