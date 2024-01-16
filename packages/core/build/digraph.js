class Digraph {

  arcs = new Map();

  addDependency(head, tail) {
    this.ensureTail(head);
    this.ensureTail(tail).add(head);
  }

  detectCycles() {
    const cycles = [];
    const visited = new Set();
    const walking = new Set();
    const walk = (vertex) => {
      if (!visited.has(vertex)) {
        visited.add(vertex);
        walking.add(vertex);
        const it = this.neighbors(vertex);
        for (let current = it.next(); true !== current.done; current = it.next()) {
          const {value: neighbor} = current;
          if (!visited.has(neighbor)) {
            walk(neighbor);
          }
          else if (walking.has(neighbor)) {
            cycles.push([vertex, neighbor]);
          }
        }
      }
      walking.delete(vertex);
    };
    const {tails} = this;
    for (let current = tails.next(); true !== current.done; current = tails.next()) {
      walk(current.value);
    }
    return cycles;
  }

  ensureTail(tail) {
    if (!this.arcs.has(tail)) {
      this.arcs.set(tail, new Set());
    }
    return this.arcs.get(tail);
  }

  neighbors(vertex) {
    return this.arcs.get(vertex).values();
  }

  sort() {
    const visited = new Set();
    const scores = new Map();
    const walk = (vertex, score) => {
      visited.add(vertex);
      const neighbors = this.neighbors(vertex);
      for (let current = neighbors.next(); true !== current.done; current = neighbors.next()) {
        const {value: neighbor} = current;
        if (!visited.has(neighbor)) {
          // eslint-disable-next-line no-param-reassign
          score = walk(neighbor, score);
        }
      }
      scores.set(vertex, score);
      return score - 1;
    };
    let score = this.arcs.size - 1;
    const {tails} = this;
    for (let current = tails.next(); true !== current.done; current = tails.next()) {
      const {value: vertex} = current;
      if (!visited.has(vertex)) {
        score = walk(vertex, score);
      }
    }
    return Array.from(scores.entries())
      .sort(([, l], [, r]) => l - r)
      .map(([vertex]) => vertex);
  }

  removeDependency(head, tail) {
    if (this.arcs.has(tail)) {
      this.arcs.get(tail).delete(head);
    }
  }

  get tails() {
    return this.arcs.keys();
  }

}

module.exports = Digraph;
