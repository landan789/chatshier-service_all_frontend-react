export const UPDATE_APPS = 'UPDATE_APP';
export const REMOVE_APP = 'REMOVE_APP';

export function updateApps(apps) {
    return { type: UPDATE_APPS, apps };
}

export function removeApp(appId) {
    return { type: REMOVE_APP, appId };
}
