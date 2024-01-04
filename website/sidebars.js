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
        'adding-flecks',
        'creating-a-fleck',
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
        'database',
        'sockets',
        'react',
        'electron',
        'isomorphism',
        'redux',
        'repl',
        'documentation',
      ],
    },
    {
      type: 'category',
      label: 'Generated details',
      link: {
        type: 'generated-index',
      },
      items: [
        'flecks/@flecks/dox/hooks',
        'flecks/@flecks/dox/config',
        'flecks/@flecks/dox/build-configs',
        'flecks/@flecks/dox/TODO',
      ],
    },
  ],
};
