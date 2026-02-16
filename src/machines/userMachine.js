import { setup, assign } from 'xstate';
import { checkAchievements } from '../utils/achievements';

export const userMachine = setup({
    types: {
        context: {},
        events: {}
    },
    actions: {
        updateLocalUser: assign({
            user: ({ context, event }) => {
                return { ...context.user, ...event.data };
            }
        }),
        calculateXP: assign({
            user: ({ context, event }) => {
                const { amount } = event;
                const prev = context.user;
                const newXP = prev.xp + amount;
                const newTotalXP = prev.totalXP + amount;

                // This machine handles the *logic*, ensuring it's decoupled from UI
                // We can emit a 'LEVEL_UP' event if needed, or just update state
                if (newXP >= prev.nextLevelXp) {
                    return {
                        ...prev,
                        xp: newXP - prev.nextLevelXp,
                        level: prev.level + 1,
                        nextLevelXp: Math.floor(prev.nextLevelXp * 1.5),
                        totalXP: newTotalXP
                    };
                }

                return {
                    ...prev,
                    xp: newXP,
                    totalXP: newTotalXP
                };
            }
        }),
        checkAchievements: assign({
            user: ({ context }) => {
                // Wrapper around utility logic
                const newAchievements = checkAchievements({
                    storiesCreated: context.user.storiesCreated,
                    gamesCreated: context.user.gamesCreated,
                    level: context.user.level,
                    totalXP: context.user.totalXP,
                    dailyStreak: context.user.dailyStreak
                }, context.user.achievements);

                if (newAchievements.length > 0) {
                    return {
                        ...context.user,
                        achievements: [...context.user.achievements, ...newAchievements.map(a => a.id)]
                    };
                }
                return context.user;
            }
        })
    }
}).createMachine({
    id: 'user',
    initial: 'idle',
    context: {
        user: null, // Will be populated from storage or auth
        syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'
        lastError: null
    },
    states: {
        idle: {
            on: {
                'USER.LOAD_DATA': {
                    target: 'loading',
                    actions: assign({ user: ({ event }) => event.data })
                }
            }
        },
        loading: {
            always: 'ready'
        },
        ready: {
            on: {
                'USER.AWARD_XP': {
                    actions: ['calculateXP', 'checkAchievements'] // Chained actions
                },
                'USER.SYNC_START': {
                    target: 'syncing'
                },
                'USER.UPDATE_PROFILE': {
                    actions: 'updateLocalUser'
                }
            }
        },
        syncing: {
            on: {
                'USER.SYNC_SUCCESS': {
                    target: 'ready',
                    actions: assign({ syncStatus: 'synced' })
                },
                'USER.SYNC_FAILURE': {
                    target: 'ready',
                    actions: assign({ syncStatus: 'error', lastError: ({ event }) => event.error })
                }
            }
        }
    }
});
