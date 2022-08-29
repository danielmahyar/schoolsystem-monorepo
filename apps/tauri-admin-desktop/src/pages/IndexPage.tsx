import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AdminDownloadBar from "../components/AdminDownloadBar";
import AdminHeader from "../components/AdminHeader";
import MainSidebar from "../components/MainSidebar";
import { downloadedFilesState } from "../global-state/file-downloads";

const IndexPage = () => {
  const downloadedFiles = useRecoilValue(downloadedFilesState);

  console.log(downloadedFiles);

  return (
    <motion.section
      className="w-full h-full flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 3,
        type: { type: "spring", stiffness: 100, damping: 15 },
      }}
    >
      <MainSidebar />
      <article className="w-full h-full flex flex-col relative z-0">
        <AdminHeader />

        {/* All pages will contain <section className="w-full h-full" */}
        <Outlet />

        <AnimatePresence>
          {downloadedFiles.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 200 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "tween",
                },
              }}
              exit={{ opacity: 0, y: 200 }}
              className="absolute bottom-0 h-20 z-50 w-full bg-background flex items-center justify-between rounded-t-sm overflow-x-auto overflow-y-hidden"
            >
              <AdminDownloadBar />
            </motion.section>
          )}
        </AnimatePresence>
      </article>
    </motion.section>
  );
};

export default IndexPage;
