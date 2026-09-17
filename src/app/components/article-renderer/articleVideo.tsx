"use client";

import { useEffect, useRef, useState } from "react";
import { Article } from "@/app/services/articleService";

type Props = { video?: Article["video"]; title: string };

export default function ArticleVideo({ video, title }: Props) {
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const playerRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        // A cached failure can occur before React hydrates the native player.
        if (playerRef.current?.error) setFailedUrl(video?.url?.trim() || null);
    }, [video?.url]);
    if (!video?.url) return null;
    const url = video.url.trim();
    const youtubeMatch = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    const youtube = (video.type === "youtube" || !video.type) && youtubeMatch;
    const nativeVideo = video.type === "mp4" || url.toLowerCase().endsWith(".mp4");
    return <div className="my-4">
        {nativeVideo ? <video ref={playerRef} key={url} src={url} onError={() => setFailedUrl(url)} controls preload="metadata" aria-label={`${title} video`} className="w-full rounded">
            {video.captionsUrl && <track kind="captions" src={video.captionsUrl} srcLang="en" label="English" default />}
            Your browser does not support this video. <a href={url}>Open the video</a>.
        </video> : <iframe
            src={youtube ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : url}
            title={`${title} video`} className="w-full aspect-video rounded" allowFullScreen
        />}
        {failedUrl === url && <p role="alert" className="mt-3">This video could not be loaded. Try reloading the page or <a className="link" href="mailto:mdhocohoc@gmail.com">contact the HoCoHOC team for help accessing this lesson</a>.</p>}
        {video.transcript && <details className="mt-3 rounded border border-slate-500 p-3">
            <summary className="cursor-pointer font-semibold">Read video transcript</summary>
            <div className="whitespace-pre-wrap mt-3">{video.transcript}</div>
        </details>}
        {video.audioDescriptionUrl && <p className="mt-3"><a className="link" href={video.audioDescriptionUrl}>Watch the version with audio description</a></p>}
    </div>;
}
