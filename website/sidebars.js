export default {
  flecksSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        'installation',
        'configuration',
        'creating-a-fleck',
        'adding-flecks',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        'cli',
        'environment',
        {
          type: 'category',
          label: 'Writing your code',
          link: {
            type: 'generated-index',
          },
          collapsed: false,
          items: [
            'testing',
            'gathering',
            'ordering',
            'isomorphism',
            'documentation',
          ],
        },
        'database',
        'docker',
        'sockets',
        'react',
        'electron',
        'redux',
        'repl',
      ],
    },
    {
      type: 'category',
      label: 'Generated details',
      link: {
        type: 'generated-index',
      },
      items: [
        'flecks/hooks',
        'flecks/config',
        'flecks/build-files',
        'flecks/todos',
      ],
    },
  ],
};
