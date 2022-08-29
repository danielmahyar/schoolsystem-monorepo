import { atom } from "recoil";
import { SSFileState } from "types";

export const downloadedFilesState = atom<SSFileState[]>({
  key: "DOWNLOADED_FILES",
  default: [],
});
