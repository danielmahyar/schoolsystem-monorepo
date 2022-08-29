import { Link, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import MainSubPage from "./pages/subpages/MainSubPage";
import CreateStudentPage from "./pages/subpages/CreateStudentPage";
import StudentViewPage from "./pages/subpages/StudentViewPage";
import StudentSubmissionPage from "./pages/subpages/StudentSubmissionPage";
import TeacherViewPage from "./pages/subpages/TeacherViewPage";
import AssignmentViewPage from "./pages/subpages/AssignmentViewPage";
import { AnimatePresence } from "framer-motion";
import LoadingPage from "./pages/LoadingPage";
import { useAuthentication } from "api";
import { AuthContext } from "api";
function App() {
  const { isLoggedIn, loading, setAuth, auth } = useAuthentication();
  console.log({ loading, isLoggedIn });

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoggedIn, loading }}>
      <main className="w-screen h-screen flex bg-slate-200 overflow-hidden">
        {/* All pages will contain <section className="w-full h-full" */}
        <AnimatePresence exitBeforeEnter>
          <Routes>
            {loading && !isLoggedIn && (
              <Route path="*" element={<LoadingPage />} />
            )}

            {!loading && isLoggedIn && (
              <Route path="/" element={<IndexPage />}>
                <Route path="/" element={<MainSubPage />} />
                <Route path="/create-student" element={<CreateStudentPage />} />
                <Route path="/student/:id" element={<StudentViewPage />} />
                <Route
                  path="/student/:id/assignment/:assignmentID"
                  element={<StudentSubmissionPage />}
                />
                <Route path="/teacher/:id" element={<TeacherViewPage />} />
                <Route
                  path="/assignment/:id"
                  element={<AssignmentViewPage />}
                />
              </Route>
            )}

            {!loading && !isLoggedIn && (
              <>
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<LoginPage />} />
              </>
            )}
          </Routes>
        </AnimatePresence>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
