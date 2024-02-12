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
        'building-your-application',
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
        {
          type: 'category',
          label: 'Writing your fleck(s)',
          link: {
            type: 'generated-index',
          },
          collapsed: false,
          items: [
            'building-your-fleck',
            'hooks',
            'gathering',
            'ordering',
            'platforms',
            'documentation',
          ],
        },
        'cli',
        'environment',
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
