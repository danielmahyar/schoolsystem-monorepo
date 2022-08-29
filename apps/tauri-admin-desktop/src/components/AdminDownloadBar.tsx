import { desktopDir, join } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";
import { useRecoilState } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import { downloadedFilesState } from "../global-state/file-downloads";
import { MdClear } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import { useState } from "react";

const AdminDownloadBar = () => {
  const [files, setFiles] = useRecoilState(downloadedFilesState);
  const [opening, setOpening] = useState<number | null>(null);
  const handleFileOpen = async (index: number) => {
    const { PATH_IN_DESKTOP } = files[index];
    setOpening(index);
    try {
      console.log(PATH_IN_DESKTOP);
      const dir = await desktopDir();
      const path = await join(dir, PATH_IN_DESKTOP);
      await open(path);
      setOpening(null);
      const filteredFiles = files.filter((_, i) => i !== index);
      setFiles(filteredFiles);
    } catch (error) {
      console.log(error);
      setOpening(null);
    }
  };

  const handleCloseBar = () => {
    setFiles([]);
  };

  return (
    <>
      <article className="w-full flex p-4 space-x-4">
        <AnimatePresence>
          {files &&
            files.map((file, index) => (
              <motion.div
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 200 }}
                className="relative group z-30 cursor-pointer py-2 px-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center transition-all ease-in-out hover:opacity-75"
              >
                <button
                  key={index}
                  onClick={() => handleFileOpen(index)}
                  className=" rounded-xl flex items-center justify-center space-x-2 group transition-all ease-in-out hover:opacity-75"
                >
                  {opening === index ? (
                    <>
                      <svg
                        className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <IoMdDocument className="group-hover:animate-bounce" />
                      <p>{file.FILE_NAME}</p>
                    </>
                  )}
                </button>
              </motion.div>
            ))}
        </AnimatePresence>
      </article>
      <article className="w-24">
        <button
          className="h-10 w-10 text-white bg-primary flex items-center justify-center rounded-lg"
          onClick={handleCloseBar}
        >
          <MdClear />
        </button>
      </article>
    </>
  );
};

export default AdminDownloadBar;
