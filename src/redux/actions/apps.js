export const INSERT_APP = 'INSERT_APP';
export const UPDATE_APP = 'UPDATE_APP';
export const REMOVE_APP = 'REMOVE_APP';

export function insertApp(appId, app) {
    return { type: INSERT_APP, appId, app };
}

export function updateApp(appId, app) {
    return { type: UPDATE_APP, appId, app };
}

export function removeApp(appId) {
    return { type: REMOVE_APP, appId };
}
