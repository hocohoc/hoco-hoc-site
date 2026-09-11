import { Article } from "@/app/services/articleService";

type Props = { video?: Article["video"]; title: string };

export default function ArticleVideo({ video, title }: Props) {
    if (!video?.url) return null;
    const url = video.url.trim();
    const youtubeMatch = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    const youtube = (video.type === "youtube" || !video.type) && youtubeMatch;
    const nativeVideo = video.type === "mp4" || url.toLowerCase().endsWith(".mp4");
    return <div className="my-4">
        {nativeVideo ? <video controls preload="metadata" aria-label={`${title} video`} className="w-full rounded">
            <source src={url} type="video/mp4" />
            {video.captionsUrl && <track kind="captions" src={video.captionsUrl} srcLang="en" label="English" default />}
            Your browser does not support this video. <a href={url}>Open the video</a>.
        </video> : <iframe
            src={youtube ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : url}
            title={`${title} video`} className="w-full aspect-video rounded" allowFullScreen
        />}
        {video.transcript && <details className="mt-3 rounded border border-slate-500 p-3">
            <summary className="cursor-pointer font-semibold">Read video transcript</summary>
            <div className="whitespace-pre-wrap mt-3">{video.transcript}</div>
        </details>}
        {video.audioDescriptionUrl && <p className="mt-3"><a className="link" href={video.audioDescriptionUrl}>Watch the version with audio description</a></p>}
    </div>;
}
