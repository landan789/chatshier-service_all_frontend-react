export const UPDATE_MESSAGERS = 'UPDATE_MESSAGERS';

export function updateMessagers(appsMessagers) {
    return { type: UPDATE_MESSAGERS, appsMessagers };
}
