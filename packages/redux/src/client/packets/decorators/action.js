export default (Action, flecks) => class ActionClient extends Action {

  static async respond(packet) {
    flecks.get('$flecks/redux/store').dispatch(packet.data);
  }

};
