import { createInterface } from "readline";
import { builtIns } from "./builtIns";
import { exec } from "./exec";
import { write } from "./history";
import { aliases } from './config/aliases';
import { path } from './config/path';
import { loadDotRc } from "./common/load-dot-rc";
import { getPrompt } from "./common/get-prompt";

const getCompletions = () => [
    ...Object.keys(builtIns),
    ...Object.keys(aliases),
    ...Object.keys(path),
];

const completer = (line: string) => {
    const completions = getCompletions();
    const hits = completions.filter((c) => c.startsWith(line));
  
    // show all completions if none found
    return [hits.length ? hits : completions, line];
};

export const createReadLineInterface = async () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: getPrompt(),
        completer
    });

    rl.on('line', write);
    rl.on('line', async line => {
        await exec(line, rl);
        rl.prompt();
    });

    // Load .rc file
    await loadDotRc();
    
    // Send initial prompt
    rl.prompt();

    // Set prompt to have new line after it
    rl.setPrompt(`\n${getPrompt()}`);

    return rl;
}
