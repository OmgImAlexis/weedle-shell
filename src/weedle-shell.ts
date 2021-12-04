import { createReadLineInterface } from './create-read-line';
import { exec } from './exec';
import { write } from './history';

const weedleShell = async (argv: string[]) => {
  const [flag, ...args] = argv;
  if (flag === '-c') {
    const line = args.join(' ');

    // Write line to history file
    write(line);

    // Run command
    await exec(line);
    
    // Exit
    process.exit(0);
  } else {
    // Start readline
    const readLine = await createReadLineInterface();

    console.info('You have 30s before the demo will exit. Enjoy 🐄');
    readLine.prompt();

    // Bail in debug mode
    setTimeout(() => {
      process.exit(0);
    }, 30_000);
  }
}

const [_, __, ...args] = process.argv;
weedleShell(args).catch(error => {
  console.error(`${name} crashed with "%s"`, error.message);
});
