import { Interface } from "readline";
import { BuiltFunction, builtIns } from "./builtIns";
import { aliases } from "./config/aliases";
import { path } from "./config/path";

export const exec = async (line: string, readLine?: Interface) => {
  const [possibleCommand, ...args] = line.split(' ');
  const command = aliases[possibleCommand] ?? possibleCommand;
  try {
    switch (true) {
      // Check built ins
      case Object.keys(builtIns).includes(command):
        const builtIn: BuiltFunction = builtIns[command];
        await Promise.resolve(builtIn(readLine, ...args));
        break;

      // Check $PATH for process
      case Object.keys(path).includes(command):
        console.info('Found %s, running…', path[command]);
        console.info('This is not implemented yet, sorry.');
        break;

      default:
        if (line.trim() === '') break;
        if (line.trim().startsWith('#') || line.trim().startsWith('//')) break;
        console.info('No command found for %s', command);
        break;
    }
  } catch (error) {
    console.info('"%s" exited with %s', line, error.message);
  }

  // Check directory
  // Check file and launch
};
