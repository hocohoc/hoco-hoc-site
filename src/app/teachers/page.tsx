"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";
import {
  getSchoolByID,
  type School,
  onScoresChange,
} from "../services/schoolsService";

type FirestoreUser = {
  displayName?: string;
  email?: string;
  school?: string;
  scores?: { [id: string]: number };
  articlesCompletedID?: string[];
  articlesStartedID?: string[];
  admin?: boolean;
};

type Student = FirestoreUser & {
  uid: string;
};

function isTeacherEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith("@hcpss.org");
}

export default function TeachersPage() {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [teacherSchool, setTeacherSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [schoolTotalScore, setSchoolTotalScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const [articleTitles, setArticleTitles] = useState<Record<string, string>>(
    {}
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // NEW: pagination state
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalScore = (scores: { [id: string]: number } | undefined): number =>
    scores ? Object.values(scores).reduce((s, v) => s + v, 0) : 0;

  // --- Auth + load users ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      setUnauthorized(false);

      if (!user) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      setAuthUser(user);

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          setError("No Firestore user document found for this account.");
          setLoading(false);
          return;
        }

        const data = snap.data() as FirestoreUser;

        const emailIsTeacher = isTeacherEmail(user.email);
        const userIsAdmin = !!data.admin;

        // Authorization rule: either @hcpss.org OR admin
        if (!emailIsTeacher && !userIsAdmin) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        setIsAdmin(userIsAdmin);

        // If they're NOT admin, they must have a school and only see that school
        if (!userIsAdmin) {
          if (!data.school) {
            setError("This teacher account does not have a school set.");
            setLoading(false);
            return;
          }

          const school = getSchoolByID(data.school);
          if (!school) {
            setError(`Unknown school id: ${data.school}`);
            setLoading(false);
            return;
          }

          setTeacherSchool(school);
          setSelectedSchoolId(school.id);

          const q = query(
            collection(db, "users"),
            where("school", "==", data.school)
          );

          const unsubStudents = onSnapshot(
            q,
            (snapshot) => {
              const docs: Student[] = [];
              snapshot.forEach((docSnap) => {
                const d = docSnap.data() as FirestoreUser;

                // Filter out teachers/admins from the students table
                if (d.admin || isTeacherEmail(d.email)) return;

                docs.push({ uid: docSnap.id, ...d });
              });

              setStudents(docs);
              setLoading(false);
            },
            (err) => {
              console.error(err);
              setError(err.message);
              setLoading(false);
            }
          );

          return () => {
            unsubStudents();
          };
        }

        // Admin: can see ALL schools / students
        const q = collection(db, "users");
        const unsubStudents = onSnapshot(
          q,
          (snapshot) => {
            const docs: Student[] = [];
            snapshot.forEach((docSnap) => {
              const d = docSnap.data() as FirestoreUser;

              // Admins & teachers are not in the "students" list
              if (d.admin || isTeacherEmail(d.email)) return;

              docs.push({ uid: docSnap.id, ...d });
            });

            setStudents(docs);
            setLoading(false);
          },
          (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
          }
        );

        return () => {
          unsubStudents();
        };
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load teacher info.");
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  // --- Scores per school (for currently selected school) ---
  useEffect(() => {
    if (!selectedSchoolId) {
      setSchoolTotalScore(null);
      return;
    }

    const unsub = onScoresChange((scores) => {
      setSchoolTotalScore(scores[selectedSchoolId] ?? 0);
    });

    return () => unsub();
  }, [selectedSchoolId]);

  // If admin has no school set, pick the first school with students once loaded
  const schoolOptions = useMemo(() => {
    const ids = new Set<string>();
    students.forEach((s) => {
      if (s.school) ids.add(s.school);
    });

    return Array.from(ids)
      .map((id) => getSchoolByID(id))
      .filter((s): s is School => !!s)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

  useEffect(() => {
    if (isAdmin && !selectedSchoolId && schoolOptions.length > 0) {
      setSelectedSchoolId(schoolOptions[0].id);
    }
  }, [isAdmin, selectedSchoolId, schoolOptions]);

  // Students for the currently selected school
  const filteredStudents = useMemo(() => {
    if (isAdmin) {
      if (!selectedSchoolId) return [];
      return students.filter((s) => s.school === selectedSchoolId);
    }

    // Non-admin teachers already only see their school from the query
    return students;
  }, [students, isAdmin, selectedSchoolId]);

  const rankedStudents = useMemo(
    () =>
      [...filteredStudents].sort(
        (a, b) => totalScore(b.scores) - totalScore(a.scores)
      ),
    [filteredStudents]
  );

  // NEW: reset / clamp pagination when things change
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, selectedSchoolId, isAdmin]);

  const totalPages = useMemo(
    () =>
      rankedStudents.length === 0
        ? 1
        : Math.max(1, Math.ceil(rankedStudents.length / pageSize)),
    [rankedStudents.length, pageSize]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize; // NEW
  const pagedStudents = useMemo(
    () => rankedStudents.slice(startIndex, startIndex + pageSize),
    [rankedStudents, startIndex, pageSize]
  );

  const articleStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudents.forEach((s) => {
      (s.articlesCompletedID ?? []).forEach((articleId) => {
        counts[articleId] = (counts[articleId] ?? 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredStudents]);

  // Load article titles for all articles that appear in stats
  useEffect(() => {
    const missingIds = articleStats
      .map(([articleId]) => articleId)
      .filter((id) => !articleTitles[id]);

    if (missingIds.length === 0) return;

    missingIds.forEach(async (articleId) => {
      try {
        const articleRef = doc(db, "articles", articleId);
        const snap = await getDoc(articleRef);
        if (snap.exists()) {
          const data = snap.data() as { title?: string };
          setArticleTitles((prev) => ({
            ...prev,
            [articleId]: data.title ?? articleId,
          }));
        } else {
          setArticleTitles((prev) => ({
            ...prev,
            [articleId]: articleId,
          }));
        }
      } catch (err) {
        console.error("Failed to load article", articleId, err);
      }
    });
  }, [articleStats, articleTitles]);

  const selectedSchool: School | null = useMemo(() => {
    if (selectedSchoolId) {
      return getSchoolByID(selectedSchoolId) ?? null;
    }
    return teacherSchool;
  }, [selectedSchoolId, teacherSchool]);

  // ---- UI states (now dark) ----

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Loading teacher dashboard…
      </div>
    );

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        You must be logged in with an <code>@hcpss.org</code> account or an
        admin account to view this page.
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <p className="text-red-400">
          Error loading teacher dashboard: {error}
        </p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Something went wrong loading your teacher profile.
      </div>
    );
  }

  // ---- Main dashboard (dark theme) ----

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <p className="text-sm text-gray-300">
          Signed in as {authUser.email}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
          <div>
            Viewing school:{" "}
            <span className="font-medium text-white">
              {selectedSchool ? selectedSchool.name : "No school selected"}
            </span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <label htmlFor="school-select" className="text-gray-400">
                Select school:
              </label>
              <select
                id="school-select"
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
                value={selectedSchoolId ?? ""}
                onChange={(e) =>
                  setSelectedSchoolId(e.target.value || null)
                }
              >
                {schoolOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {schoolTotalScore != null && selectedSchool && (
          <p className="text-sm text-gray-300">
            Total points for this school:{" "}
            <span className="font-semibold text-white">
              {schoolTotalScore}
            </span>
          </p>
        )}
      </header>

      {/* Top students */}
      <section>
        {/* header + page size selector */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Top Students</h2>
          {rankedStudents.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>Students per page:</span>
              <select
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {rankedStudents.length === 0 ? (
          <p className="text-sm text-gray-400">
            No students found for this school yet.
          </p>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-right">Total Points</th>
                  <th className="px-3 py-2 text-right">
                    Articles Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedStudents.map((s, idx) => (
                  <tr
                    key={s.uid}
                    className={
                      (startIndex + idx) % 2 === 0
                        ? "bg-gray-900"
                        : "bg-gray-800"
                    }
                  >
                    <td className="px-3 py-2">{startIndex + idx + 1}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(s)}
                        className="text-blue-400 hover:underline"
                      >
                        {s.displayName ?? "(no name)"}
                      </button>
                    </td>
                    <td className="px-3 py-2">{s.email}</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {totalScore(s.scores)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {s.articlesCompletedID?.length ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* NEW: pagination footer */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-300 bg-gray-900 border-t border-gray-700">
              <span>
                Showing{" "}
                {rankedStudents.length === 0
                  ? 0
                  : startIndex + 1}{" "}
                –
                {Math.min(startIndex + pageSize, rankedStudents.length)} of{" "}
                {rankedStudents.length} students
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded border border-gray-700 ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded border border-gray-700 ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected student details */}
        {selectedStudent && (
          <div className="mt-4 border border-gray-700 rounded-lg p-4 bg-gray-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Articles completed by{" "}
                  {selectedStudent.displayName ||
                    selectedStudent.email ||
                    "Student"}
                </h3>
                <p className="text-xs text-gray-400">
                  Click another student to view their progress.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Close
              </button>
            </div>

            <div className="mt-3">
              {(selectedStudent.articlesCompletedID ?? []).length ===
              0 ? (
                <p className="text-sm text-gray-400">
                  This student has not completed any articles yet.
                </p>
              ) : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {Array.from(
                    new Set(selectedStudent.articlesCompletedID ?? [])
                  ).map((articleId) => (
                    <li key={articleId}>
                      {articleTitles[articleId] ?? articleId}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Article stats */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Articles Completed by Students
        </h2>
        {articleStats.length === 0 ? (
          <p className="text-sm text-gray-400">
            No completed articles recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left">Article</th>
                  <th className="px-3 py-2 text-right">
                    # of Students Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {articleStats.map(([articleId, count], idx) => (
                  <tr
                    key={articleId}
                    className={
                      idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    }
                  >
                    <td className="px-3 py-2">
                      {articleTitles[articleId] ?? articleId}
                    </td>
                    <td className="px-3 py-2 text-right">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
