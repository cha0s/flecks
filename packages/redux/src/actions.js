import {createAction} from '@reduxjs/toolkit';

export const hydrateServer = createAction('@flecks/redux/hydrate.server');

export const hydrateLocalStorage = createAction('@flecks/redux/hydrate.localStorage');

export const storeLocalStorage = createAction('@flecks/redux.store.localStorage');
