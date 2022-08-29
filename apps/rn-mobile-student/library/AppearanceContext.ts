import { createContext } from "react";
import { BaseColorStruct, DarkColors } from "ui";
export const ColorModeContext = createContext<BaseColorStruct>({
    ...DarkColors
});