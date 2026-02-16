import { setup } from 'xstate';
import { authMachine } from './authMachine';
import { userMachine } from './userMachine';
import { storyMachine } from './storyMachine';

export const appMachine = setup({
    actors: {
        authMachine,
        userMachine,
        storyMachine
    }
}).createMachine({
    id: 'app',
    type: 'parallel',
    states: {
        auth: {
            invoke: {
                id: 'auth',
                src: 'authMachine'
            }
        },
        user: {
            invoke: {
                id: 'user',
                src: 'userMachine'
            }
        },
        story: {
            invoke: {
                id: 'story',
                src: 'storyMachine'
            }
        }
    }
});
