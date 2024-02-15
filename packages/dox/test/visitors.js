import traverse from '@babel/traverse';
import {expect} from 'chai';

import {parseCode} from '@flecks/dox/build/parser';
import {
  buildFileVisitor,
  configVisitor,
  hookImplementationVisitor,
  hookInvocationVisitor,
  hookSpecificationVisitor,
  hookVisitor,
  todoVisitor,
} from '@flecks/dox/build/visitors';

async function confirmVisited(code, visitor, test) {
  const visited = [];
  traverse(
    await parseCode(code),
    visitor((result) => {
      visited.push(result);
    }),
  );
  test(visited);
}

function constHooksWrapper(code) {
  return `
    export const hooks = {
      ${code}
    };
  `;
}

function exportsHooksWrapper(code) {
  return `
    exports.hooks = {
      ${code}
    };
  `;
}

async function confirmVisitedWrapped(code, visitor, test) {
  await Promise.all(
    [constHooksWrapper, exportsHooksWrapper]
      .map(async (wrapper) => {
        const source = wrapper(code);
        await confirmVisited(source, visitor, test(source));
      }),
  );
}

it('parses hooks', async () => {
  await confirmVisitedWrapped(
    `
      'hello': () => {},
    `,
    hookImplementationVisitor,
    () => (visited) => {
      expect(visited.length)
        .to.equal(1);
      expect(visited[0].key.value)
        .to.equal('hello');
    },
  );
});

it('visits hooks', async () => {
  await confirmVisitedWrapped(
    `
      'hello': () => {},
      'goodbye': () => {},
    `,
    hookVisitor('hello'),
    () => (visited) => {
      expect(visited.length)
        .to.equal(1);
      expect(visited[0].key.value)
        .to.equal('hello');
    },
  );
});

function buildFileWrappers(code) {
  return [
    `
      '@flecks/build.files': () => ([
        ${code}
      ]),
    `,
    `
      '@flecks/build.files': () => {
        return [
          ${code}
        ];
      },
    `,
    `
      '@flecks/build.files': function f() {
        return [
          ${code}
        ];
      },
    `,
  ];
}

it('visits build files', async () => {
  await Promise.all(
    buildFileWrappers(
      `
        /**
         * This is a description.
         *
         * It is on multiple lines.
         */
        'first.config.js',
        /**
         * This is another description.
         */
        'second.config.js',
        'third.config.js',
      `,
    )
      .map(async (wrapped) => {
        await confirmVisitedWrapped(
          wrapped,
          buildFileVisitor,
          () => (visited) => {
            expect(visited)
              .to.deep.equal([
                {
                  filename: 'first.config.js',
                  description: 'This is a description.\n\nIt is on multiple lines.',
                },
                {
                  filename: 'second.config.js',
                  description: 'This is another description.',
                },
                {
                  filename: 'third.config.js',
                  description: undefined,
                },
              ]);
          },
        );
      }),
  );
});

function configWrappers(code) {
  return [
    `
      '@flecks/core.config': () => ({
        ${code}
      }),
    `,
    `
      '@flecks/core.config': () => {
        return {
          ${code}
        };
      },
    `,
    `
      '@flecks/core.config': function f() {
        return {
          ${code}
        };
      },
    `,
  ];
}

it('visits config', async () => {
  await Promise.all(
    configWrappers(
      `
        /**
         * Description.
         */
        first: 'default',
        second: 1111,
      `,
    )
      .map(async (wrapped) => {
        await confirmVisitedWrapped(
          wrapped,
          configVisitor,
          (source) => (visited) => {
            const expected = [
              {
                key: 'first',
                description: 'Description.',
              },
              {
                key: 'second',
                description: undefined,
              },
            ];
            visited.forEach((config, i) => {
              expect(config.key)
                .to.equal(expected[i].key);
              expect(config.description)
                .to.equal(expected[i].description);
            });
            expect(source.slice(visited[0].location.start.index, visited[0].location.end.index))
              .to.equal("'default'");
            expect(source.slice(visited[1].location.start.index, visited[1].location.end.index))
              .to.equal('1111');
          },
        );
      }),
  );
});

it('visits hook invocations', async () => {
  await confirmVisited(
    `
      flecks.invoke('sup');
      flecks.invokeAsync('yep');
      flecks.gather('stuff');
      flecks.makeMiddleware('hook');
      flecks.nope();
      this.invoke('sup');
      this.invokeAsync('yep');
      this.gather('stuff');
      this.makeMiddleware('hook');
      this.nope();
    `,
    hookInvocationVisitor,
    (visited) => {
      expect(visited.length)
        .to.equal(10);
    },
  );
});

it('visits hook specifications', async () => {
  const f = '(one, two) => { return one + parseInt(two, 10); }';
  await confirmVisitedWrapped(
    `
      /**
       * This is a hook.
       * @param {number} one First.
       * @param {string} two Second.
       * @returns {number} Result.
       */
      'hook': ${f},
    `,
    hookSpecificationVisitor,
    (source) => (visited) => {
      expect(visited.length)
        .to.equal(1);
      expect(visited[0].description)
        .to.equal('This is a hook.');
      expect(visited[0].hook)
        .to.equal('hook');
      expect(visited[0].returns)
        .to.deep.equal({description: 'Result.', type: 'number'});
      expect(visited[0].params)
        .to.deep.equal([
          {description: 'First.', name: 'one', type: 'number'},
          {description: 'Second.', name: 'two', type: 'string'},
        ]);
      expect(source.slice(visited[0].location.start.index, visited[0].location.end.index))
        .to.equal(f);
    },
  );
});

it('visits todos', async () => {
  const source = `
    someStuff();

    // @todo This should be a function.
    new OhYeah();

    // @todo This is a really
    // long todo item.
    something();
  `;
  await confirmVisited(
    source,
    todoVisitor,
    (visited) => {
      expect(visited.map(({description}) => description))
        .to.deep.equal([
          'This should be a function.',
          'This is a really long todo item.',
        ]);
      expect(visited.map(({location: {start, end}}) => (source.slice(start.index, end.index))))
        .to.deep.equal([
          'new OhYeah();',
          'something();',
        ]);
    },
  );
});
