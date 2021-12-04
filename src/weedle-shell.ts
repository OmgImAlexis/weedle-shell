import { createWriteStream, lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import readline from 'readline';
import kleur from 'kleur';

readline.emitKeypressEvents(process.stdin);

const getFullCompletions = () => ({
  ...builtIns,
  ...aliases,
  ...globalPath
});

const getCompletions = () => [
  ...Object.keys(builtIns),
  ...Object.keys(aliases),
  ...Object.keys(globalPath),
];

const completer = (line: string) => {
  const completions = getCompletions();
  const hits = completions.filter((c) => c.startsWith(line));

  // show all completions if none found
  return [hits.length ? hits : completions, line];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `${kleur.green('➜')} `,
  completer
});

const aliasPath = join(process.env.HOME, '.wshell-aliases');
const loadAliases = () => {
  try {
    const file = readFileSync(aliasPath, 'utf8');
    const lines = file.split('\n');
    return Object.fromEntries(lines.map(line => line.split('=')));
  } catch (error) {
    // Failed to open the aliases file
    if (error.code === 'ENOENT') return {};
    console.error(error);
    process.exit(1);
  }
};

const loadGlobalPath = () => {
  const dirs = process.env.PATH.split(':');
  const files = dirs.map(dir => readdirSync(dir).filter(filePath => lstatSync(join(dir, filePath)).isFile()).map(file => [file, join(dir, file)])).flat();
  return Object.fromEntries(files);
};

const globalPath = loadGlobalPath();

const aliases = loadAliases();

const builtIns = {
  time() {
    console.info(new Date().toLocaleTimeString());
  },
  date() {
    console.info(new Date().toLocaleDateString());
  },
  clear() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
  },
  which(command: string) {
    const completions = getFullCompletions();
    if (!Object.keys(completions).includes(command)) throw new Error(`'Unknown command "${command}"'`);
    console.info(completions[command]);
  },
  exit(exitCode: string) {
    process.exit(exitCode ? parseInt(exitCode, 10) : 0);
  }
}

const historyPath = join(process.env.HOME, '.wshell-history');
const history = createWriteStream(historyPath, { flags: 'a' });

const writeHistory = (line: string) => {
  // Don't record any commands starting with space
  if (line.startsWith(' ')) return;
  history.write(line + '\n');
};

const exec = (line: string) => {
  const [possibleCommand, ...args] = line.split(' ');
  const command = aliases[possibleCommand] ?? possibleCommand;
  try {
    switch (true) {
      // Check built ins
      case Object.keys(builtIns).includes(command):
        builtIns[command](...args);
        break;

      // Check $PATH for process
      case Object.keys(globalPath).includes(command):
        console.info('Found %s, running…', globalPath[command]);
        break;

      default:
        if (line.trim() === '') break;
        console.info('No command found for %s', command);
        break;
    }
  } catch (error) {
    console.info('"%s" exited with %s', line, error.message);
  }

  // Check directory
  // Check file and launch
  // Check $PATH
  rl.prompt();
};

rl.on('line', writeHistory);
rl.on('line', exec);

// Send initial prompt
rl.prompt();

// Bail in debug mode
setTimeout(() => {
  process.exit(0);
}, 30_000)