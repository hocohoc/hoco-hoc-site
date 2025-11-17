import { 
    Timestamp,
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    increment,
    setDoc,
    updateDoc 
} from "firebase/firestore";

import { auth, authProvider, db } from "../firebase/config";
import { User, signInWithPopup, signOut } from "firebase/auth";

export type Profile = {
    uid: string;
    email: string;
    creationDate: Timestamp;
    displayName: string;
    school: string;
    scores: { [section: string]: number };
    preferredLanguage: "python" | "cpp" | "java";
    admin: boolean;
    articlesStartedID: string[];
    articlesCompletedID: string[];
};

// -------------------------
// ALLOWED EMAIL EXCEPTIONS
// -------------------------
const ALLOWED_EXCEPTIONS = new Set([
    "daniel.gao6205@gmail.com",
    "mdhocohoc@gmail.com",
    "aryan.sharma0714@gmail.com",
    "ankitvmohanty5@gmail.com",
    "danielgaofei@gmail.com"
]);

// -------------------------
// SIGN-IN HANDLER
// -------------------------
export async function signInOrRegister(): Promise<User> {
    console.log("Signing in...");
    let user = await signInWithGoogle();
    return user;
}

export async function logout() {
    await signOut(auth);
}

// -------------------------
// GOOGLE LOGIN (with school + exception whitelist restriction)
// -------------------------
export async function signInWithGoogle(): Promise<User> {
    const authResult = await signInWithPopup(auth, authProvider);
    const user = authResult.user;

    const email = user.email ?? "";
    const domain = email.split("@")[1] ?? "";

    const isSchoolEmail = domain === "inst.hcpss.org";
    const isException = ALLOWED_EXCEPTIONS.has(email);

    if (!isSchoolEmail && !isException) {
        // Block access
        await signOut(auth);
        throw new Error(
            "You must sign in with your @inst.hcpss.org school email (unless you are on the exception list)."
        );
    }

    return user;
}

// -------------------------
// USER PROFILE HELPERS
// -------------------------
export async function createUserProfile(
    user: User,
    school: string,
    preferredLanguage: "python" | "cpp" | "java"
): Promise<Profile> {
    const profile: Profile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName!,
        school,
        preferredLanguage,
        creationDate: Timestamp.fromDate(new Date()),
        scores: {},
        admin: false,
        articlesCompletedID: [],
        articlesStartedID: []
    };

    await setDoc(doc(db, "users/" + profile.uid), profile);
    console.log("Profile created!");

    await updateDoc(doc(db, "aggregate/stats"), {
        totalUsers: increment(1)
    });

    return profile;
}

export async function updateUserProfile(
    uid: string,
    preferredLanguage: "python" | "cpp" | "java"
) {
    await updateDoc(doc(db, "/users/" + uid), {
        preferredLanguage
    });
}

export async function updateStartedArticles(uid: string, articleID: string) {
    await updateDoc(doc(db, "/users/" + uid), {
        articlesStartedID: arrayUnion(articleID)
    });
}

export async function updateCompletedArticles(uid: string, articleID: string) {
    await updateDoc(doc(db, "/users/" + uid), {
        articlesCompletedID: arrayUnion(articleID),
        articlesStartedID: arrayRemove(articleID)
    });
}

export async function getUserData(uid: string): Promise<Profile | undefined> {
    console.log("Fetching user data...");
    try {
        let user = await getDoc(doc(db, "users/" + uid));
        return user.exists() ? (user.data() as Profile) : undefined;
    } catch (err) {
        return undefined;
    }
}
