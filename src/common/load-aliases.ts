import { readFileSync } from "fs";
import { paths } from "../config/paths";

export const loadAliases = () => {
  try {
    const file = readFileSync(paths.aliases, 'utf8');
    const lines = file.split('\n');
    return Object.fromEntries(lines.map(line => line.split('=')));
  } catch (error) {
    // Failed to open the aliases file
    if (error.code === 'ENOENT') return {};
    throw error;
  }
};