import fs from "fs";
import path from "path";
import less from "less";
import {
  camelCase,
  camelCaseTransformMerge,
  paramCase,
  snakeCase,
} from "change-case";

import { sourceToClassNames } from "./source-to-class-names";
import { LessAliasesPlugin } from "./aliases-plugin";
import { MainOptions } from "../core";

export type ClassName = string;
export type ClassNames = ClassName[];

type AliasesFunc = (filePath: string) => string;
export type Aliases = Record<string, string | string[] | AliasesFunc>;

export interface Options {
  includePaths?: string[];
  aliases?: Aliases;
  nameFormat?: NameFormat | NameFormat[];
}

interface Transformer {
  (className: ClassName): string;
}

const transformersMap = {
  camel: (className: ClassName) =>
    camelCase(className, { transform: camelCaseTransformMerge }),
  dashes: (className: ClassName) =>
    /-/.test(className) ? camelCase(className) : className,
  kebab: (className: ClassName) => transformersMap.param(className),
  none: (className: ClassName) => className,
  param: (className: ClassName) => paramCase(className),
  snake: (className: ClassName) => snakeCase(className),
} as const;

type NameFormatWithTransformer = keyof typeof transformersMap;
const NAME_FORMATS_WITH_TRANSFORMER = Object.keys(
  transformersMap
) as NameFormatWithTransformer[];

export const NAME_FORMATS = [...NAME_FORMATS_WITH_TRANSFORMER, "all"] as const;
export type NameFormat = (typeof NAME_FORMATS)[number];

export const nameFormatDefault: NameFormat = "camel";
export const configFilePathDefault: string = "tlm.config.js";

// Options 这里实际上传递的是 MainOptions
export const fileToClassNames = async (
  file: string,
  options: Options = {} as MainOptions
): Promise<ClassNames> => {
  // options
  const aliases = options.aliases || {};
  const includePaths = options.includePaths || [];
  const lessRenderOptions = (options as MainOptions).lessRenderOptions || {};
  const rawNameFormat = options.nameFormat;

  const nameFormat = (
    typeof rawNameFormat === "string" ? [rawNameFormat] : rawNameFormat
  ) as NameFormat[];

  const nameFormats: NameFormatWithTransformer[] = nameFormat
    ? nameFormat.includes("all")
      ? NAME_FORMATS_WITH_TRANSFORMER
      : (nameFormat as NameFormatWithTransformer[])
    : [nameFormatDefault];

  // less render
  const fileContent = fs.readFileSync(file, "UTF-8");
  const result = await less.render(fileContent, {
    filename: path.resolve(file),
    paths: includePaths,
    syncImport: true,
    plugins: [new LessAliasesPlugin(aliases)],
    ...lessRenderOptions,
  });

  // get classnames
  const { exportTokens } = await sourceToClassNames(result.css);
  const classNames = Object.keys(exportTokens);
  const transformers = nameFormats.map((item) => transformersMap[item]);
  const transformedClassNames = new Set<ClassName>([]);
  classNames.forEach((className: ClassName) => {
    transformers.forEach((transformer: Transformer) => {
      transformedClassNames.add(transformer(className));
    });
  });

  return Array.from(transformedClassNames).sort((a, b) => a.localeCompare(b));
};
