// Get a runtime require function by hook or by crook. :)

// eslint-disable-next-line no-eval
module.exports = eval('"undefined" !== typeof require ? require : undefined');
