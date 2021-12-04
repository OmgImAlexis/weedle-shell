import { readFileSync } from "fs";
import { paths } from "../config/paths";
import { exec } from '../exec';
import pEachSeries from 'p-each-series';

/**
 * Load the .rc file
 */
export const loadDotRc = async () => {
    try {
        const file = readFileSync(paths.dotRc, 'utf8');
        const lines = file.split('\n');

        // For every line in the rc file let's just run it
        await pEachSeries(lines, async line => {
            await exec(line);
        });
    } catch (error) {
        // Failed to open the rc file
        if (error.code === 'ENOENT') return;

        // Not sure what happened?
        // Throw!
        throw error;
    }
}
