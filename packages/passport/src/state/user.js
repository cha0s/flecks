import {
  createSelector,
  createSlice,
  hydrateServer,
} from '@flecks/redux';

import {userById} from './users';

export const userIdSelector = (state) => state.user;

export const userSelector = createSelector(
  [(state) => state, userIdSelector],
  userById,
);

const slice = createSlice({
  name: '@flecks/passport.user',
  initialState: 0,
  extraReducers: (builder) => {
    builder.addCase(hydrateServer, (state, action) => {
      const {req} = action.payload;
      return req.user.id;
    });
  },
});

export default slice.reducer;
