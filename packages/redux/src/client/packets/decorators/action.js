export default (Action, flecks) => class ActionClient extends Action {

  static async respond(packet) {
    flecks.redux.dispatch(packet.data);
  }

};
