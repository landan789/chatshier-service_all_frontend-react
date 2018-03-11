export const UPDATE_APPS = 'UPDATE_APP';
export const DELETE_APP = 'DELETE_APP';

export function updateApps(apps) {
    return { type: UPDATE_APPS, apps };
}

export function deleteApp(appId) {
    return { type: DELETE_APP, appId };
}
