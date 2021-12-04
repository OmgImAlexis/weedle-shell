import { aliases } from './config/aliases';
import { path } from './config/path';
import { env } from './config/env';
import { name } from './config/name';
import { version } from './config/version';
import { Interface } from 'readline';
import { getPrompt } from './common/get-prompt';

export const getFullCompletions = () => ({
  ...builtIns,
  ...aliases,
  ...path
});

export type BuiltFunction = (readLine: Interface | undefined, ...args: string[]) => void | Promise<void>;

export const builtIns: Record<string, BuiltFunction> = {
  time() {
    console.info(new Date().toLocaleTimeString());
  },
  date() {
    console.info(new Date().toLocaleDateString());
  },
  clear() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
  },
  which(_readLine, command) {
    const completions = getFullCompletions();
    if (!Object.keys(completions).includes(command)) throw new Error(`'Unknown command "${command}"'`);
    console.info(completions[command]);
  },
  env() {
    console.table(env);
  },
  help() {
    console.info(`Welcome to ${name}@${version}`);
  },
  sleep: (readLine, timeWanted) => {
    readLine?.pause();
    const time = timeWanted ? parseInt(timeWanted.replace('_', ''), 10) : 0;
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    })
  },
  cd(readLine, directory) {
    process.chdir(directory);
    readLine.setPrompt(`\n${getPrompt()}`);
  },
  exit(_readLine, exitCode: string) {
    process.exit(exitCode ? parseInt(exitCode, 10) : 0);
  }
};
