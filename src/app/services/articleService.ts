import { db } from "../firebase/config"
import { DocumentReference, arrayUnion, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc } from "firebase/firestore"


export type Article = {
    id: string
    title: string,
    description: string,
    content: string,
    tags: string[],
    sectionID: string,
    index: number,
    sponsor?: {
        name: string,
        imageUrl: string,
        siteUrl: string
        message?: string; 
    }
    quiz?: {
        points: number
    }
}

export type Section = {
    id: string,
    index: number,
    title: string,
    description: string,
    points: {
        [articleID: string]: number
    }
    articles: DocumentReference[]
}

//for admin
export async function createSection(section: Section) {
    let ref = doc(db, "sections/" + section.id)
    await setDoc(ref, section, { merge: true })
}

export async function incrementViewCount() {
    let ref = doc(db, "aggregate/stats");
    await updateDoc(ref, {
        totalViews: increment(1)
    })
}

export async function createArticle(article: Article, section_id: string) {
    let ref = doc(db, "articles/" + article.id)

    await setDoc(ref, article, { merge: true })
    await updateDoc(doc(db, "sections/" + section_id), {
        articles: arrayUnion(ref)
    })
}

export async function getSections(): Promise<Section[]> {
    const sectionsRef = collection(db, "sections")

    const sections = await getDocs(sectionsRef)
    let result: Section[] = []

    sections.forEach(section => {
        const data = section.data()
        result.push({ id: section.id, ...data } as Section)
    })

    return result
}

export async function getSection(sectionId: string): Promise<Section> {
    const sectionDoc = await getDoc(doc(db, "sections/" + sectionId))
    const sectionData = sectionDoc.data()

    return { id: sectionDoc.id, ...sectionData } as Section
}

export async function getAllArticles(): Promise<Article[]> {
    const articlesRef = collection(db, "articles")
    const articles = await getDocs(articlesRef)

    let result = [];

    articles.forEach(article => result.push({ id: article.id, ...article.data() }))

    return result;
}

export async function getArticleFromID(articleId: string): Promise<Article> {

    const articleDoc = await getDoc(doc(db, "articles/" + articleId))
    if (articleDoc.data()) {
        let article: Article = { id: articleDoc.id, ...articleDoc.data() } as Article
        return article;
    } else {
        throw new Error("Article not found!")
    }
}

export async function getArticleFromRef(articleRef: DocumentReference): Promise<Article> {
    return getArticleFromID(articleRef.id)
}

export async function setArticleQuiz(articleID: string, sectionID: string, hasQuiz: boolean, pts: number) {
    const articleRef = doc(db, "articles/" + articleID)
    const sectionRef = doc(db, "sections/" + sectionID)
    await updateDoc(articleRef, {
        quiz: hasQuiz ? {
            points: pts
        } : undefined
    })
    await updateDoc(sectionRef, {
        ["points." + articleID]: hasQuiz ? pts : 0
    })
}
