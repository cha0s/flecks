import {
  createEntityAdapter,
  createSlice,
  hydrateLocalStorage,
  hydrateServer,
} from '@flecks/redux';

const adapter = createEntityAdapter();

export const {
  selectById: userById,
  selectEntities: usersMap,
  selectIds: usersIds,
  selectAll: usersAll,
} = adapter.getSelectors((state) => state.users);

const slice = createSlice({
  name: '@flecks/passport.users',
  initialState: adapter.getInitialState({
    entities: {0: {name: 'anonymous'}},
    ids: [0],
  }),
  extraReducers: (builder) => {
    builder.addCase(hydrateLocalStorage, (state, action) => {
      const storage = action.payload;
      state.ids = Array.from(new Set(state.ids.concat(usersIds(storage))));
      state.entities = {
        ...usersMap(storage),
        ...state.entities,
      };
    });
    builder.addCase(hydrateServer, (state, action) => {
      const {req} = action.payload;
      if (req.user.id) {
        state.ids.push(req.user.id);
        state.entities[req.user.id] = {name: req.user.email};
      }
    });
  },
});

export default slice.reducer;
