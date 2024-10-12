import path from "path";
import { MainOptions } from "../core/types";

const CURRENT_WORKING_DIRECTORY = process.cwd();

/**
 * Given a file path to a SCSS file, generate the corresponding type definition
 * file path.
 *
 * @param file the SCSS file path
 */
export const getTypeDefinitionPath = (
  file: string,
  options?: MainOptions
): string => {
  if (options?.outputFolder) {
    const relativePath = path.relative(CURRENT_WORKING_DIRECTORY, file);
    const resolvedPath = path.resolve(
      CURRENT_WORKING_DIRECTORY,
      options?.outputFolder,
      relativePath
    );

    return `${resolvedPath}.d.ts`;
  } else {
    return `${file}.d.ts`;
  }
};
