import { Options } from "../less";
import { ExportType, QuoteType, LogLevel } from "../typescript";

type CLIOnlyOptions = Extract<keyof Options, "importer">;

export interface CLIOptions extends Exclude<Options, CLIOnlyOptions> {
  banner: string;
  ignore: string[];
  ignoreInitial: boolean;
  exportType: ExportType;
  lessRenderOptions?: Less.Options;
  exportTypeName: string;
  exportTypeInterface: string;
  listDifferent: boolean;
  quoteType: QuoteType;
  updateStaleOnly: boolean;
  watch: boolean;
  logLevel: LogLevel;
  outputFolder: string | null;
}

export interface MainOptions extends CLIOptions, Options {}
