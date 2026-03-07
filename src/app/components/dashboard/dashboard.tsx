"use client"
import { Profile } from "@/app/services/userService"
import SectionProgressCard from "../section-progress-card/sectionProgressCard"
import { Article, getAllArticles, getSections } from "@/app/services/articleService";
import ArticleCard from "../article-card/articleCard";
import { useQuery } from "@tanstack/react-query";
import ErrorPopup from "../error-popup/errorPopup";
import BadgesDisplay from "../badges-display/badgesDisplay";

type Props = {
  profile: Profile
}

export default function ProfileDashboard(props: Props) {
  let startedArticles: Article[] = []
  let completedArticles: Article[] = []

  const { data: sections, isLoading: loadingSections, error: sectionLoadErr } = useQuery({
    queryKey: ["sections"],
    queryFn: getSections,
    enabled: !!props.profile
  })

  const { data: articles, isLoading: loadingArticles, error: articleLoadErr } = useQuery({
    queryKey: ["articles"],
    queryFn: getAllArticles,
    enabled: !!props.profile
  })

  if (props.profile && !loadingArticles && !articleLoadErr) {
    startedArticles = (articles.filter(a => props.profile.articlesStartedID.includes(a.id)))
    completedArticles = (articles.filter(a => props.profile.articlesCompletedID.includes(a.id)))
  }

  return <main className="w-full h-full flex flex-col gap-4">
    {(sectionLoadErr || articleLoadErr) && (
      <ErrorPopup error={articleLoadErr || sectionLoadErr}>
        <p className="mb-4">An error occured while loading your dashboard. </p>
      </ErrorPopup>
    )}
    <BadgesDisplay profile={props.profile} />
    <div className="flex flex-row flex-wrap w-full items-stretch gap-4">
      {!loadingSections ? (
        sections.sort((a, b) => a.index - b.index).map(section =>
          <SectionProgressCard className="flex-1 min-w-64 h-52" key={section.id} section={section} points={props.profile.scores[section.id]} />
        )
      ) : (
        Array.from(Array(3), (_, i) => <div key={i} className="h-52 min-w-48 flex-1 animate-pulse bg-slate-800 rounded"> </div>)
      )}
    </div>
    <div className="grid grid-cols-1 flex-1 gap-4">
      <div className="rounded bg-slate-800">
        <div className="p-4 pb-2">
          <h1 className="text-xl font-bold"> Jump Back In </h1>
        </div>
        <div className="flex flex-row max-w-full gap-2 p-4 pt-2 overflow-x-scroll overflow-y-hidden">
          {!loadingArticles ? (
            startedArticles.map(art => <ArticleCard complete={false} key={art.id} article={art} />)
          ) : (
            Array.from(Array(10), (_, i) => <div key={i} className="flex-1 min-h-44 min-w-60 animate-pulse bg-slate-700 rounded" />)
          )}
          {!loadingArticles && startedArticles.length == 0 && (
            <div className="flex-1 flex items-center min-h-44 justify-center">
              <h1> Looks pretty empty here. Start reading articles to make progress! </h1>
            </div>
          )}
        </div>
      </div>
      <div className="rounded bg-slate-800">
        <div className="p-4 pb-2">
          <h1 className="text-xl font-bold"> Recently Completed </h1>
        </div>
        <div className="flex flex-row max-w-full gap-2 p-4 pt-2 overflow-x-scroll overflow-y-hidden">
          {!loadingArticles ? (
            completedArticles.map(art => <ArticleCard complete={true} key={art.id} article={art} />)
          ) : (
            Array.from(Array(10), (_, i) => <div key={i} className="flex-1 min-h-44 min-w-60 animate-pulse bg-slate-700 rounded" />)
          )}
          {!loadingArticles && completedArticles.length == 0 && (
            <div className="flex-1 flex items-center min-h-44 justify-center">
              <h1> Looks pretty empty here. Start reading articles to make progress! </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  </main>
}
