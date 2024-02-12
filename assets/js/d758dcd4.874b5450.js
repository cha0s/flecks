"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[8446],{5559:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>d,default:()=>f,frontMatter:()=>c,metadata:()=>h,toc:()=>u});var s=t(5893),l=t(1151),o=t(3200),r=t(4283),i=t(385),a=t(6569);const c={title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",slug:"reimplementing-flecks-react",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png"}],tags:["flecks","education"],hide_table_of_contents:!1,image:"https://cha0s.github.io/flecks/flecks.png"},d=void 0,h={permalink:"/flecks/blog/reimplementing-flecks-react",source:"@site/blog/2024-02-03/reimplementing-flecks-react/index.mdx",title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",date:"2024-02-03T00:00:00.000Z",formattedDate:"February 3, 2024",tags:[{label:"flecks",permalink:"/flecks/blog/tags/flecks"},{label:"education",permalink:"/flecks/blog/tags/education"}],readingTime:6.88,hasTruncateMarker:!0,authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],frontMatter:{title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",slug:"reimplementing-flecks-react",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],tags:["flecks","education"],hide_table_of_contents:!1,image:"https://cha0s.github.io/flecks/flecks.png"},unlisted:!1,nextItem:{title:"flecks: NOT a fullstack framework",permalink:"/flecks/blog/introducing-flecks"}},p={authorsImageUrls:[void 0]},u=[{value:"Generate some stuff",id:"generate-some-stuff",level:2},{value:"Do stuff with React",id:"do-stuff-with-react",level:2},{value:"Whoops",id:"whoops",level:3},{value:"Modify the build",id:"modify-the-build",level:3},{value:"Web integration",id:"web-integration",level:2},{value:"Dependencies",id:"dependencies",level:3},{value:"Client implementation",id:"client-implementation",level:3},{value:"What are we doing here exactly?",id:"what-are-we-doing-here-exactly",level:3},{value:"Passing React",id:"passing-react",level:3},{value:"For real this time",id:"for-real-this-time",level:2},{value:"Enjoy",id:"enjoy",level:3}];function m(e){const n={admonition:"admonition",code:"code",h2:"h2",h3:"h3",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",...(0,l.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"flecks provides some default flecks to help with common tasks such as spinning up a web server,\ndatabases, and a react runtime with babel plugins, among many other things."}),"\n",(0,s.jsxs)(n.p,{children:["In this article, we will be reimplementing a small subset of ",(0,s.jsx)(n.code,{children:"@flecks/react"})," in our own isolated\napplication so we can learn how to build with flecks."]}),"\n","\n",(0,s.jsxs)(n.admonition,{title:"Save yourself the trouble",type:"warning",children:[(0,s.jsx)(n.p,{children:"In practice, there's not much need to reimplement React support, you can just lean on what's\nalready provided -- that is in fact the entire point of flecks!"}),(0,s.jsx)(n.p,{children:"This is just an illustration for the sake of understanding."})]}),"\n",(0,s.jsx)(n.h2,{id:"generate-some-stuff",children:"Generate some stuff"}),"\n",(0,s.jsx)(n.p,{children:"First, let's generate a little application starter:"}),"\n",(0,s.jsx)(o.Z,{type:"app",pkg:"illustration"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cd illustration\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We'll create two flecks, one called ",(0,s.jsx)(n.code,{children:"react"}),":"]}),"\n",(0,s.jsx)(o.Z,{headless:!0,type:"fleck",pkg:"packages/react"}),"\n",(0,s.jsxs)(n.p,{children:["and one called ",(0,s.jsx)(n.code,{children:"component"}),":"]}),"\n",(0,s.jsx)(o.Z,{headless:!0,type:"fleck",pkg:"packages/component"}),"\n",(0,s.jsxs)(n.p,{children:["A quick look at ",(0,s.jsx)(n.code,{children:"build/flecks.yml"})," shows:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yml",children:"'@flecks/build': {}\n'@flecks/core':\n  id: illustration\n'@flecks/server': {}\n'@illustration/component:./packages/component': {}\n'@illustration/react:./packages/react': {}\n"})}),"\n",(0,s.jsx)(n.h2,{id:"do-stuff-with-react",children:"Do stuff with React"}),"\n",(0,s.jsxs)(n.p,{children:["Let's go in our ",(0,s.jsx)(n.code,{children:"component"})," package and make some React noises. We'll create\n",(0,s.jsx)(n.code,{children:"@illustration/component/src/component.jsx"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/src/component.jsx"',children:"function Component() {\n  // Just for now so we don't need the React instance just yet...\n  return false;\n}\nexport default Component;\n"})}),"\n",(0,s.jsxs)(n.p,{children:["and we'll import it in to ",(0,s.jsx)(n.code,{children:"@illustration/component/src/index.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/src/index.js"',children:"import Component from './component';\n"})}),"\n",(0,s.jsx)(n.p,{children:"Start your application:"}),"\n",(0,s.jsx)(a.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsx)(n.h3,{id:"whoops",children:"Whoops"}),"\n",(0,s.jsx)(n.p,{children:"Uh, oh! We got an error:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"Module not found: Error: Can't resolve './component'\n\n      no extension\n        [...]/illustration/packages/component/src/component doesn't exist\n      .mjs\n        [...]/illustration/packages/component/src/component.mjs doesn't exist\n      .js\n        [...]/illustration/packages/component/src/component.js doesn't exist\n      .json\n        [...]/illustration/packages/component/src/component.json doesn't exist\n      .wasm\n        [...]/illustration/packages/component/src/component.wasm doesn't exist\n\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We can see that ",(0,s.jsx)(n.code,{children:"jsx"})," wasn't one of the extensions that got searched! This is because of flecks's\n",(0,s.jsx)(n.strong,{children:"small core philosophy"}),". It's just a JS application by default. The whole point is that we are\nabout to implement React support ourselves! Let's do that."]}),"\n",(0,s.jsx)(n.h3,{id:"modify-the-build",children:"Modify the build"}),"\n",(0,s.jsxs)(n.p,{children:["We need to add the ability to discover (and compile) JSX files. We'll do this in\n",(0,s.jsx)(n.code,{children:"@illustration/react"}),"."]}),"\n",(0,s.jsx)(n.admonition,{title:"Just a phase",type:"info",children:(0,s.jsxs)(n.p,{children:["flecks has a ",(0,s.jsx)(n.strong,{children:"bootstrap"})," phase where build hooks like ",(0,s.jsx)(n.code,{children:"@flecks/core.babel"})," are invoked. This is\nin contrast to the ",(0,s.jsx)(n.strong,{children:"runtime"})," phase which is where hooks like ",(0,s.jsx)(n.code,{children:"@flecks/server.up"}),"\nare invoked."]})}),"\n",(0,s.jsxs)(n.p,{children:["Let's modify ",(0,s.jsx)(n.code,{children:"@illustration/react/build/flecks.bootstrap.js"})," like so:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"exports.dependencies = [];\n\nexports.hooks = {\n  // babel config to compile JSX\n  '@flecks/core.babel': () => ({presets: ['@babel/preset-react']}),\n  // implicit extensions\n  '@flecks/build.extensions': () => ['.jsx'],\n};\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We're using ",(0,s.jsx)(n.code,{children:"@babel/preset-react"})," now, so let's move into ",(0,s.jsx)(n.code,{children:"@illustration/react"})," and add it to our\ndependencies:"]}),"\n",(0,s.jsx)(i.Z,{headless:!0,pkg:"@babel/preset-react"}),"\n",(0,s.jsx)(n.p,{children:"Start your application again:"}),"\n",(0,s.jsx)(a.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsx)(n.p,{children:"Everything comes up right! Only thing is, we don't actually have a web server yet!"}),"\n",(0,s.jsx)(n.h2,{id:"web-integration",children:"Web integration"}),"\n",(0,s.jsxs)(n.p,{children:["flecks provides ",(0,s.jsx)(n.code,{children:"@flecks/web"})," which implements a web server and runtime upon which we may build\nweb applications. A React application is a specialization of a web application, so let's lean on\n",(0,s.jsx)(n.code,{children:"@flecks/web"})," so we don't have to completely reinvent the wheel!"]}),"\n",(0,s.jsx)(n.h3,{id:"dependencies",children:"Dependencies"}),"\n",(0,s.jsxs)(n.p,{children:["Move into ",(0,s.jsx)(n.code,{children:"@illustration/react"})," and add ",(0,s.jsx)(n.code,{children:"@flecks/web"})," as well as ",(0,s.jsx)(n.code,{children:"react"})," and ",(0,s.jsx)(n.code,{children:"react-dom"}),":"]}),"\n",(0,s.jsx)(i.Z,{headless:!0,pkg:"@flecks/web react react-dom"}),"\n",(0,s.jsxs)(n.p,{children:["Add ",(0,s.jsx)(n.code,{children:"@flecks/web"})," to the dependencies in ",(0,s.jsx)(n.code,{children:"@illustration/react/build/flecks.bootstrap.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/react/build/flecks.bootstrap.js"',children:"// highlight-next-line\nexports.dependencies = ['@flecks/web'];\n"})}),"\n",(0,s.jsx)(n.h3,{id:"client-implementation",children:"Client implementation"}),"\n",(0,s.jsxs)(n.p,{children:["Before we proceed we'll need to actually do something in our new web client. Let's add some code to\n",(0,s.jsx)(n.code,{children:"@illustration/react/src/index.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/react/src/index.js"',children:"import React from 'react';\nimport {createRoot} from 'react-dom/client';\n\nexport const hooks = {\n  '@flecks/web/client.up': async (container) => {\n    // Render the root we create with react-dom\n    createRoot(container).render(\n      // What to render though..?\n    );\n    console.log('rendered');\n  },\n};\n"})}),"\n",(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsxs)(n.mdxAdmonitionTitle,{children:[(0,s.jsx)(n.code,{children:"export const"})," all of a sudden"]}),(0,s.jsxs)(n.p,{children:["Since we're dealing with the ",(0,s.jsx)(n.strong,{children:"runtime"})," phase now, we get access to the nice stuff we're used to\nlike ",(0,s.jsx)(n.code,{children:"export const hooks"})," instead of ",(0,s.jsx)(n.code,{children:"exports.hooks"}),"."]}),(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Rule of thumb"}),": if you are in ",(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.code,{children:"build"})})," you're probably in the ",(0,s.jsx)(n.strong,{children:"bootstrap"})," phase. Otherwise,\nyou are in the ",(0,s.jsx)(n.strong,{children:"runtime"})," phase."]})]}),"\n",(0,s.jsx)(n.p,{children:"Now, restart your application:"}),"\n",(0,s.jsx)(a.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsxs)(n.p,{children:["You'll see that we're now getting the ",(0,s.jsx)(n.code,{children:"rendered"})," message in the console."]}),"\n",(0,s.jsx)(n.h3,{id:"what-are-we-doing-here-exactly",children:"What are we doing here exactly?"}),"\n",(0,s.jsxs)(n.p,{children:["What are we going to render, though? This is where ",(0,s.jsx)(n.strong,{children:"hooks"})," come into play!"]}),"\n",(0,s.jsxs)(n.p,{children:["Our ",(0,s.jsx)(n.code,{children:"@illustration/react"})," fleck needs to be able to gather and render components on behalf of\nother flecks so they don't have to do all of this root rendering busywork."]}),"\n",(0,s.jsxs)(n.p,{children:["We'll implement a hook: ",(0,s.jsx)(n.code,{children:"@illustration/react.roots"})," that will allow other flecks to implement their\nReact root components. We'll then collect and render them all."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/react/src/client.js"',children:"  '@flecks/web/client.up': async (container, flecks) => {\n    // highlight-start\n    const results = flecks.invoke('@illustration/react.roots');\n    // highlight-end\n    // By default `invoke` returns an object: {[fleckPath]: result, ...}\n    // So, we'll map it into a flat list of components and use the fleck path as the key prop:\n    // highlight-start\n    const Components = Object.entries(results)\n      .map(([fleckPath, Component]) => React.createElement(Component, {key: fleckPath}));\n    // highlight-end\n    // Finally we'll render all our components as children of the `React.StrictMode` component:\n    // highlight-start\n    createRoot(container).render(React.createElement(React.StrictMode, {}, Components));\n    console.log('rendered roots: %O', results);\n    // highlight-end\n  },\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Refreshing the page shows ",(0,s.jsx)(n.code,{children:"rendered roots: Object {  }"})," in the console. Getting closer!"]}),"\n",(0,s.jsxs)(n.p,{children:["Let's go back over to ",(0,s.jsx)(n.code,{children:"@illustration/component/src/index.js"})," and implement ",(0,s.jsx)(n.strong,{children:"our"})," hook:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/src/index.js"',children:"import Component from './component';\n\n// highlight-start\nexport const hooks = {\n  '@illustration/react.roots': () => Component,\n};\n// highlight-end\n"})}),"\n",(0,s.jsx)(n.p,{children:"Refresh one more time and you will see:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'rendered roots:  Object { "@illustration/component": Component() }\n'})}),"\n",(0,s.jsx)(n.p,{children:"Awesome!"}),"\n",(0,s.jsx)(n.h3,{id:"passing-react",children:"Passing React"}),"\n",(0,s.jsxs)(n.p,{children:["If you remember, our original component just ",(0,s.jsx)(n.code,{children:"return false"}),"'d up there, and we only\nadded ",(0,s.jsx)(n.code,{children:"react"})," to ",(0,s.jsx)(n.code,{children:"@illustration/react"}),". So how do we use it from ",(0,s.jsx)(n.code,{children:"@illustration/component"}),"?\nWell, ",(0,s.jsx)(n.code,{children:"@flecks/react"})," just re-exports it so you don't have to worry about this exact thing. Let's\nfollow suit in ",(0,s.jsx)(n.code,{children:"@illustration/react"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/react/src/index.js"',children:"import React from 'react';\nimport {createRoot} from 'react-dom/client';\n\n// highlight-next-line\nexport {React};\n\nexport const hooks = {\n  '@flecks/web/client.up': async (container, flecks) => {\n    const results = flecks.invoke('@illustration/react.roots');\n    // By default `invoke` returns a map: {[fleckPath]: result}\n    // So, we'll map it into a flat list of components and use the fleck path as the key:\n    const Components = Object.entries(results)\n      .map(([fleckPath, Component]) => React.createElement(Component, {key: fleckPath}));\n    // Finally we'll render all our components as children of the `React.StrictMode` component:\n    createRoot(container).render(React.createElement(React.StrictMode, {}, Components));\n    console.log('rendered roots: %O', results);\n  },\n};\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Back over in ",(0,s.jsx)(n.code,{children:"@illustration/component/src/component.jsx"}),", we'll use it:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/src/component.jsx"',children:"// highlight-next-line\nimport {React} from '@illustration/react';\n\nfunction Component() {\n  // highlight-next-line\n  return <p>Hello world</p>;\n}\nexport default Component;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Now refresh the page and you will see exactly what you expect!"}),"\n",(0,s.jsx)(n.h2,{id:"for-real-this-time",children:"For real this time"}),"\n",(0,s.jsxs)(n.p,{children:["Other aspects like HMR will be left as an exercise for the reader. Or... you could just use\n",(0,s.jsx)(n.code,{children:"@flecks/react"}),"! You really should do that and save yourself the trouble. Back in our application's\n",(0,s.jsx)(n.code,{children:"build/flecks.yml"})," let's remove our half-baked React implementation:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yml",children:"'@flecks/build': {}\n'@flecks/core':\n  id: illustration\n'@flecks/server': {}\n'@illustration/component:./packages/component': {}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Move into ",(0,s.jsx)(n.code,{children:"@illustration/component"})," and ",(0,s.jsxs)(n.strong,{children:["add ",(0,s.jsx)(n.code,{children:"@flecks/react"})," using the flecks CLI"]}),":"]}),"\n",(0,s.jsx)(r.Z,{headless:!0,cmd:"flecks add @flecks/react"}),"\n",(0,s.jsxs)(n.p,{children:["This is a twofer! It ",(0,s.jsxs)(n.strong,{children:["adds the package to ",(0,s.jsx)(n.code,{children:"dependencies"})," in ",(0,s.jsx)(n.code,{children:"package.json"})]})," and it also ",(0,s.jsxs)(n.strong,{children:["adds\na fleck dependency in ",(0,s.jsx)(n.code,{children:"flecks.bootstrap.js"})]}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",metastring:'title="packages/component/package.json"',children:'{\n  "name": "@illustration/component",\n  "version": "1.0.0",\n  "scripts": {\n    "build": "flecks build",\n    "clean": "flecks clean",\n    "lint": "flecks lint",\n    "test": "flecks test"\n  },\n  "files": [\n    "index.js"\n  ],\n  "dependencies": {\n    "@flecks/core": "^3.0.0",\n    // highlight-next-line\n    "@flecks/react": "^3.2.1"\n  },\n  "devDependencies": {\n    "@flecks/build": "^3.0.0",\n    "@flecks/fleck": "^3.0.0"\n  }\n}\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/build/flecks.bootstrap.js"',children:"// highlight-next-line\nexports.dependencies = ['@flecks/react'];\n\nexports.hooks = {};\n"})}),"\n",(0,s.jsxs)(n.admonition,{title:"Achievement unlocked: dependence",type:"tip",children:[(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"@illustration/component"})," has specified all of its dependencies!"]}),(0,s.jsx)(n.p,{children:"It might seem like a bit of busywork to explicitly specify your dependencies because flecks makes\nit so easy to get along without needing to."}),(0,s.jsxs)(n.p,{children:["However by doing so you unlock the potential of ",(0,s.jsx)(n.strong,{children:"sharing your code with others"})," which gets at the\nheart of the flecks way: sharing solutions to repeated problems. Remember: ",(0,s.jsx)(n.strong,{children:"Future you is just\nas likely to be the beneficiary!"})]})]}),"\n",(0,s.jsxs)(n.p,{children:["Swap the ",(0,s.jsx)(n.code,{children:"React"})," import in ",(0,s.jsx)(n.code,{children:"@illustration/component/src/component.jsx"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/src/component.jsx"',children:"// highlight-next-line\nimport {React} from '@flecks/react';\n\nfunction Component() {\n  return <p>Hello world</p>;\n}\nexport default Component;\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Swap the hook implementation in ",(0,s.jsx)(n.code,{children:"@illustration/component/src/index.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/component/src/index.js"',children:"import Component from './component';\n\nexport const hooks = {\n  // highlight-next-line\n  '@flecks/react.roots': () => Component,\n};\n"})}),"\n",(0,s.jsxs)(n.admonition,{title:"Copy that",type:"info",children:[(0,s.jsx)(n.p,{children:"It's what we spent all of this time doing, but better!"}),(0,s.jsx)(n.p,{children:"The entire reason flecks exists is to minimize duplicated effort."})]}),"\n",(0,s.jsx)(n.h3,{id:"enjoy",children:"Enjoy"}),"\n",(0,s.jsx)(a.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsxs)(n.p,{children:["Now all that's left is to ",(0,s.jsx)(n.strong,{children:"have fun"}),"!"]})]})}function f(e={}){const{wrapper:n}={...(0,l.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},3200:(e,n,t)=>{t.d(n,{Z:()=>i});var s=t(9286),l=t(4866),o=t(5162),r=t(5893);function i(e){let{children:n,headless:t=!0,pkg:i,type:a}=e;return(0,r.jsx)(l.Z,{className:t&&"headless",groupId:"package-manager",children:(0,r.jsxs)(o.Z,{value:"npm",label:"npm",children:[n,(0,r.jsx)(s.Z,{language:"bash",children:"fleck"===a?`npm init @flecks/${a} -w ${i}`:`npm init @flecks/${a} ${i}`})]})})}},4283:(e,n,t)=>{t.d(n,{Z:()=>i});var s=t(9286),l=t(4866),o=t(5162),r=t(5893);function i(e){let{children:n,cmd:t,headless:i=!0}=e;const a=Array.isArray(t)?t:[t];return(0,r.jsx)(l.Z,{className:i&&"headless",groupId:"package-manager",children:(0,r.jsxs)(o.Z,{value:"npm",label:"npm",children:[n,(0,r.jsx)(s.Z,{language:"bash",children:(c="npx",a.map((e=>`${c} ${e}`)).join("\n"))})]})});var c}},385:(e,n,t)=>{t.d(n,{Z:()=>i});var s=t(9286),l=t(4866),o=t(5162),r=t(5893);function i(e){let{children:n,headless:t=!0,pkg:i}=e;return(0,r.jsx)(l.Z,{className:t&&"headless",groupId:"package-manager",children:(0,r.jsxs)(o.Z,{value:"npm",label:"npm",children:[n,(0,r.jsxs)(s.Z,{language:"bash",children:["npm install ",i]})]})})}},6569:(e,n,t)=>{t.d(n,{Z:()=>i});var s=t(9286),l=t(4866),o=t(5162),r=t(5893);function i(e){let{children:n,cmd:t,headless:i=!0}=e;return(0,r.jsx)(l.Z,{className:i&&"headless",groupId:"package-manager",children:(0,r.jsxs)(o.Z,{value:"npm",label:"npm",children:[n,(0,r.jsxs)(s.Z,{language:"bash",children:["npm run ",t]})]})})}},5162:(e,n,t)=>{t.d(n,{Z:()=>r});t(7294);var s=t(512);const l={tabItem:"tabItem_Ymn6"};var o=t(5893);function r(e){let{children:n,hidden:t,className:r}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,s.Z)(l.tabItem,r),hidden:t,children:n})}},4866:(e,n,t)=>{t.d(n,{Z:()=>y});var s=t(7294),l=t(512),o=t(2466),r=t(6550),i=t(469),a=t(1980),c=t(7392),d=t(12);function h(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return h(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:l}}=e;return{value:n,label:t,attributes:s,default:l}}))}(t);return function(e){const n=(0,c.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function u(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:t}=e;const l=(0,r.k6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,a._X)(o),(0,s.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(l.location.search);n.set(o,e),l.replace({...l.location,search:n.toString()})}),[o,l])]}function f(e){const{defaultValue:n,queryString:t=!1,groupId:l}=e,o=p(e),[r,a]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!u({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:o}))),[c,h]=m({queryString:t,groupId:l}),[f,g]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[l,o]=(0,d.Nk)(t);return[l,(0,s.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:l}),x=(()=>{const e=c??f;return u({value:e,tabValues:o})?e:null})();(0,i.Z)((()=>{x&&a(x)}),[x]);return{selectedValue:r,selectValue:(0,s.useCallback)((e=>{if(!u({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);a(e),h(e),g(e)}),[h,g,o]),tabValues:o}}var g=t(2389);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=t(5893);function k(e){let{className:n,block:t,selectedValue:s,selectValue:r,tabValues:i}=e;const a=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.o5)(),d=e=>{const n=e.currentTarget,t=a.indexOf(n),l=i[t].value;l!==s&&(c(n),r(l))},h=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=a.indexOf(e.currentTarget)+1;n=a[t]??a[0];break}case"ArrowLeft":{const t=a.indexOf(e.currentTarget)-1;n=a[t]??a[a.length-1];break}}n?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":t},n),children:i.map((e=>{let{value:n,label:t,attributes:o}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>a.push(e),onKeyDown:h,onClick:d,...o,className:(0,l.Z)("tabs__item",x.tabItem,o?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function b(e){let{lazy:n,children:t,selectedValue:l}=e;const o=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===l));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:o.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==l})))})}function w(e){const n=f(e);return(0,j.jsxs)("div",{className:(0,l.Z)("tabs-container",x.tabList),children:[(0,j.jsx)(k,{...e,...n}),(0,j.jsx)(b,{...e,...n})]})}function y(e){const n=(0,g.Z)();return(0,j.jsx)(w,{...e,children:h(e.children)},String(n))}}}]);