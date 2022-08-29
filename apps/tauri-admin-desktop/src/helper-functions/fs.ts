import {
  BaseDirectory,
  createDir,
  readDir,
  writeBinaryFile,
} from "@tauri-apps/api/fs";
import { AxiosInstance } from "axios";
import { SSFile, SSFileState } from "types";

export const DEFAULT_DESKTOP_FOLDER = "admin-downloads";

export const downloadFileToClient = async (
  axios: AxiosInstance,
  fileMetaData: SSFile,
  desktopFolderName = DEFAULT_DESKTOP_FOLDER
): Promise<SSFileState> => {
  try {
    await createDir(desktopFolderName, {
      dir: BaseDirectory.Desktop,
      recursive: true,
    });

    const { data }: { data: Blob } = await axios.get(fileMetaData.FILE_URL, {
      responseType: "blob",
    });
    const buffer = await data.arrayBuffer();
    const fileExists = (
      await readDir("admin-downloads", {
        dir: BaseDirectory.Desktop,
        recursive: true,
      })
    ).some((p) => p.name === fileMetaData.FILE_NAME);
    const fileName = fileExists
      ? `${Date.now().toString()}-${fileMetaData.FILE_NAME}`
      : fileMetaData.FILE_NAME;
    const filePath = `${desktopFolderName}/${fileName}`;
    await writeBinaryFile(filePath, buffer, { dir: BaseDirectory.Desktop });
    const parsedFile: SSFileState = {
      FILE_URL: fileMetaData.FILE_URL,
      FILE_NAME: fileName,
      UPLOADED_AT: fileMetaData.UPLOADED_AT,
      PATH_IN_DESKTOP: `${desktopFolderName}/${fileMetaData.FILE_NAME}`,
    };
    return parsedFile;
  } catch (error) {
    throw error;
  }
};
