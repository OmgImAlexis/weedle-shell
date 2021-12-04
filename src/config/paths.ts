import { join } from 'path';
import { env } from './env';
import { name } from "./name";

export const paths = {
    history: join(env.HOME, `.${name}-history`),
    aliases: join(env.HOME, `.${name}-aliases`),
    dotRc: join(env.HOME, `.${name}rc`),
};
