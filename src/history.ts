import { createWriteStream } from 'fs';
import { paths } from "./config/paths";

// Open append only stream to history file
const history = createWriteStream(paths.history, { flags: 'a' });

// Write a line to the history file
export const write = (line: string) => {
  // Don't record any commands starting with space
  if (line.startsWith(' ')) return;

  // Write the line
  history.write(line + '\n');
};
