import { hostname } from "os";
import { cwd } from "process";
import kleur from "kleur";

export const getPrompt = () => `[${hostname}] ${cwd()}\n${kleur.green('➜')} `;
