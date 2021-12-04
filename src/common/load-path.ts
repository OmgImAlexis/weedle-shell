import { lstatSync, readdirSync } from "fs";
import { join } from "path";

export const loadPath = () => {
  const dirs = process.env.PATH.split(':');
  const files = dirs.map(dir => {
    try {
      return readdirSync(dir).filter(filePath => lstatSync(join(dir, filePath)).isFile()).map(file => [file, join(dir, file)]);
    } catch {
      return [];
    }
  }).flat();
  return Object.fromEntries(files);
};