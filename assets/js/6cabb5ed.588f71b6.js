"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[9339],{2034:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>r,contentTitle:()=>o,default:()=>h,frontMatter:()=>c,metadata:()=>l,toc:()=>a});var i=s(5893),t=s(1151);const c={title:"Building and testing",description:"Learn how to build, test, and override defaults for your fleck"},o=void 0,l={id:"building-your-fleck",title:"Building and testing",description:"Learn how to build, test, and override defaults for your fleck",source:"@site/docs/building-your-fleck.mdx",sourceDirName:".",slug:"/building-your-fleck",permalink:"/flecks/docs/building-your-fleck",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Building and testing",description:"Learn how to build, test, and override defaults for your fleck"},sidebar:"flecksSidebar",previous:{title:"Writing your fleck(s)",permalink:"/flecks/docs/category/writing-your-flecks"},next:{title:"Hooks",permalink:"/flecks/docs/hooks"}},r={},a=[{value:"<code>package.json</code> and entry points",id:"packagejson-and-entry-points",level:2},{value:"Who cares? Everything works without it!",id:"who-cares-everything-works-without-it",level:3},{value:"Processing <code>package.json</code>",id:"processing-packagejson",level:3},{value:"webpack build configuration",id:"webpack-build-configuration",level:2},{value:"<code>build/fleck.webpack.config.js</code>",id:"buildfleckwebpackconfigjs",level:3},{value:"Testing",id:"testing",level:2},{value:"Example source",id:"example-source",level:3},{value:"Example test",id:"example-test",level:3},{value:"Platform-specificity",id:"platform-specificity",level:3},{value:"Check it",id:"check-it",level:4},{value:"Linting",id:"linting",level:2},{value:"<code>build/default.eslint.config.js</code>",id:"builddefaulteslintconfigjs",level:3}];function d(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"@flecks/create-fleck"})," sets up an environment that makes building, testing, and distributing\nyour flecks easy."]}),"\n",(0,i.jsxs)(n.h2,{id:"packagejson-and-entry-points",children:[(0,i.jsx)(n.code,{children:"package.json"})," and entry points"]}),"\n",(0,i.jsxs)(n.p,{children:["flecks automatically uses the ",(0,i.jsx)(n.code,{children:"files"})," key in your ",(0,i.jsx)(n.code,{children:"package.json"})," to determine the\n",(0,i.jsx)(n.a,{href:"https://webpack.js.org/concepts/entry-points/",children:"entry points"})," of your fleck. Entry points are\nautomatically discovered from the ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.code,{children:"src"})})," directory of your fleck."]}),"\n",(0,i.jsxs)(n.p,{children:["Think of your ",(0,i.jsx)(n.code,{children:"files"})," key as a sort of ",(0,i.jsx)(n.code,{children:"exports"}),", but for your files. If your ",(0,i.jsx)(n.code,{children:"package.json"}),"'s\n",(0,i.jsx)(n.code,{children:"files"})," key looks like this:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'  "files": [\n    "client.js",\n    "index.js",\n    "something-else.js"\n  ],\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Other code could ",(0,i.jsx)(n.code,{children:"import"})," any of those paths (e.g. ",(0,i.jsx)(n.code,{children:"@your/fleck/client"}),", ",(0,i.jsx)(n.code,{children:"@your/fleck"}),",\n",(0,i.jsx)(n.code,{children:"@your/fleck/something-else"}),")."]}),"\n",(0,i.jsxs)(n.p,{children:["You may have a structure like ",(0,i.jsx)(n.code,{children:"src/client/index.js"})," and the entry point discovery would still\nwork as expected above."]}),"\n",(0,i.jsx)(n.h3,{id:"who-cares-everything-works-without-it",children:"Who cares? Everything works without it!"}),"\n",(0,i.jsxs)(n.p,{children:["Who cares about exporting, though? I created a fleck and everything Just Works","\u2122\ufe0f",". This\nseems like extra busywork for no reason!"]}),"\n",(0,i.jsx)(n.admonition,{title:"Sharing is caring",type:"tip",children:(0,i.jsxs)(n.p,{children:["The reason we take care of the ",(0,i.jsx)(n.code,{children:"files"})," key in our ",(0,i.jsx)(n.code,{children:"package.json"})," is because ",(0,i.jsxs)(n.strong,{children:["this\nis how we make sure we can publish working flecks to ",(0,i.jsx)(n.code,{children:"npm"})]}),"! this tooling is directed toward\nmaking it easier and frictionless to share code."]})}),"\n",(0,i.jsxs)(n.h3,{id:"processing-packagejson",children:["Processing ",(0,i.jsx)(n.code,{children:"package.json"})]}),"\n",(0,i.jsxs)(n.p,{children:["flecks augments your source ",(0,i.jsx)(n.code,{children:"package.json"})," during the build process and outputs a\n",(0,i.jsxs)(n.strong,{children:["built ",(0,i.jsx)(n.code,{children:"package.json"})]})," to ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.code,{children:"dist"})}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["If you generate a fleck using ",(0,i.jsx)(n.code,{children:"create-fleck"}),", its ",(0,i.jsx)(n.code,{children:"files"})," key will look like this:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'  "files": [\n    "index.js"\n  ],\n'})}),"\n",(0,i.jsxs)(n.p,{children:["flecks automatically adds some paths to the ",(0,i.jsx)(n.code,{children:"files"})," key of your built ",(0,i.jsx)(n.code,{children:"package.json"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"build"})," directory"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"src"})," directory (if sources exist)"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"sourcemaps"})," for each entry point (e.g. ",(0,i.jsx)(n.code,{children:"index.js"})," -> ",(0,i.jsx)(n.code,{children:"index.js.map"}),")"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"test"})," directory (if tests exist)"]}),"\n"]}),"\n",(0,i.jsxs)(n.admonition,{title:"Hook that one, too",type:"info",children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"@flecks/fleck"})," invokes a hook\n",(0,i.jsx)(n.a,{href:"./flecks/hooks#flecksfleckpackagejson",children:(0,i.jsx)(n.code,{children:"@flecks/fleck.packageJson"})})," which exposes this for any\nother fleck to process ",(0,i.jsx)(n.code,{children:"package.json"})," when building a fleck."]}),(0,i.jsxs)(n.p,{children:["For instance, ",(0,i.jsx)(n.code,{children:"@flecks/web"})," implements this hook. ",(0,i.jsx)(n.code,{children:"@flecks/web"})," will automatically output\nCSS, fonts, and other frontend assets to the ",(0,i.jsx)(n.code,{children:"assets"})," directory in your build output. If any of\nthese frontend assets exist, ",(0,i.jsx)(n.code,{children:"@flecks/web"})," will automatically add the ",(0,i.jsx)(n.code,{children:"assets"})," directory to the\n",(0,i.jsx)(n.code,{children:"files"})," key of your built ",(0,i.jsx)(n.code,{children:"package.json"}),". You don't have to think about it!"]})]}),"\n",(0,i.jsxs)(n.admonition,{title:"Normal distribution",type:"warning",children:[(0,i.jsxs)(n.p,{children:["What this means is that when we publish a fleck we don't publish the root directory, ",(0,i.jsxs)(n.strong,{children:["we publish\nthe ",(0,i.jsx)(n.code,{children:"dist"})," output directory"]}),"."]}),(0,i.jsxs)(n.p,{children:["The same applies when ",(0,i.jsx)(n.a,{href:"./building-your-application#symlinks",children:"symlinking your fleck"})," in an\napplication."]})]}),"\n",(0,i.jsx)(n.h2,{id:"webpack-build-configuration",children:"webpack build configuration"}),"\n",(0,i.jsx)(n.h3,{id:"buildfleckwebpackconfigjs",children:(0,i.jsx)(n.code,{children:"build/fleck.webpack.config.js"})}),"\n",(0,i.jsx)(n.p,{children:"flecks provides a default webpack configuration for your fleck. This may not be what you want, so\nyou may override it:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",metastring:'title="build/fleck.webpack.config.js"',children:"const flecksWebpackDefaults = require('@flecks/fleck/build/fleck.webpack.config');\nmodule.exports = async (env, argv, flecks) => {\n  const config = await flecksWebpackDefaults(env, argv, flecks);\n  // ...\n  return config;\n};\n"})}),"\n",(0,i.jsx)(n.p,{children:"You don't actually have to extend the configuration like that, you could return your own! That's\njust an illustration of how you can override the defaults."}),"\n",(0,i.jsx)(n.p,{children:"That being said, the defaults (including the automatic entry point stuff above and so much more)\nwill absolutely make your life easier."}),"\n",(0,i.jsx)(n.h2,{id:"testing",children:"Testing"}),"\n",(0,i.jsxs)(n.p,{children:["flecks uses Mocha and Chai to run your tests. When you create a fleck, it includes a run script\n",(0,i.jsx)(n.code,{children:"test"}),". If you run it in your new empty fleck, you will see the output:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"No fleck tests found.\n"})}),"\n",(0,i.jsx)(n.p,{children:"No tests exist by default. Let's look at some example code and tests to understand how it works."}),"\n",(0,i.jsx)(n.h3,{id:"example-source",children:"Example source"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/example/src/index.js"',children:"export const add2 = (n) => n + 2;\n\nexport const add3 = (n) => n + 3;\n"})}),"\n",(0,i.jsx)(n.h3,{id:"example-test",children:"Example test"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/example/test/add2.js"',children:"import {expect} from 'chai';\n\nconst {add2} = require('@testing/unit');\n\nit('can add two to a number', () => {\n  // highlight-next-line\n  expect(add2(2)).to.equal(5);\n});\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"We intentionally made an error so we can see what a failed test looks like."})}),"\n",(0,i.jsxs)(n.p,{children:["If we run the following command ",(0,i.jsxs)(n.strong,{children:["from within ",(0,i.jsx)(n.code,{children:"packages/example"})]}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run test\n"})}),"\n",(0,i.jsx)(n.p,{children:"We would see the following output:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"  1) can add two to a number\n\n  0 passing (11ms)\n  1 failing\n\n  1) can add two to a number:\n\n      AssertionError: expected 4 to equal 5\n      + expected - actual\n\n      -4\n      +5\n"})}),"\n",(0,i.jsx)(n.p,{children:"It catches the error! If we fixed it:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/example/test/add2.js"',children:"import {expect} from 'chai';\n\nconst {add2} = require('@testing/unit');\n\nit('can add two to a number', () => {\n  // highlight-next-line\n  expect(add2(2)).to.equal(4);\n});\n"})}),"\n",(0,i.jsx)(n.p,{children:"and try again:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run test\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"  \u2713 can add two to a number\n\n  1 passing (4ms)\n"})}),"\n",(0,i.jsx)(n.p,{children:"Everything's good!"}),"\n",(0,i.jsx)(n.h3,{id:"platform-specificity",children:"Platform-specificity"}),"\n",(0,i.jsx)(n.p,{children:"flecks also allows you to write tests that only target a specific platform. Let's add web support\nand then write a test that only runs for the client:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npx flecks add @flecks/web\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Now, let's add a test. We add a client test by adding a ",(0,i.jsx)(n.code,{children:"client"})," directory to our ",(0,i.jsx)(n.code,{children:"test"}),"\ndirectory and putting tests there:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/example/test/client/add3.js"',children:"import {expect} from 'chai';\n\nconst {add3} = require('@testing/unit');\n\nit('can add three to a number', () => {\n  // highlight-next-line\n  expect(add3(2)).to.equal(6);\n});\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"We intentionally made a mistake again to show a test failure."})}),"\n",(0,i.jsx)(n.h4,{id:"check-it",children:"Check it"}),"\n",(0,i.jsx)(n.p,{children:"Start your application, visit your website in the browser, and you will see:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"A screenshot of a browser showing the test runner page with our test failing",src:s(5408).Z+"",width:"1800",height:"1141"})}),"\n",(0,i.jsx)(n.p,{children:"The test is failing! That's what we expected."}),"\n",(0,i.jsx)(n.p,{children:"Now, edit your client test to fix it:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/unit/test/client/add3.js"',children:"import {expect} from 'chai';\n\nconst {add3} = require('@testing/unit');\n\nit('can add three to a number', () => {\n  // highlight-next-line\n  expect(add3(2)).to.equal(5);\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Save the file. If you still have your application running, go look at the page. You'll notice that\n",(0,i.jsx)(n.strong,{children:"it updated automatically"})," to look like:"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"A screenshot of a browser showing the test runner page with our test passing",src:s(5480).Z+"",width:"1833",height:"850"})}),"\n",(0,i.jsx)(n.p,{children:"Awesome, everything passes!"}),"\n",(0,i.jsxs)(n.admonition,{title:"Sanity check",type:"info",children:[(0,i.jsxs)(n.p,{children:["If you run ",(0,i.jsx)(n.code,{children:"npm run test"})," in your ",(0,i.jsx)(n.code,{children:"packages/example"})," directory, you will see that only one test was\nrun:"]}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"  \u2713 can add two to a number\n\n  1 passing (3ms)\n"})}),(0,i.jsx)(n.p,{children:"That's correct; we only run client tests on the client."})]}),"\n",(0,i.jsx)(n.h2,{id:"linting",children:"Linting"}),"\n",(0,i.jsxs)(n.p,{children:["flecks automatically includes support for ESLint through a ",(0,i.jsx)(n.code,{children:"lint"})," run script. flecks configures a\nlot of default rules including a lightly-tweaked version of\n",(0,i.jsx)(n.a,{href:"https://airbnb.io/javascript/",children:(0,i.jsx)(n.code,{children:"eslint-config-airbnb"})})," as well as overrides for special\ncircumstances: for instance, loosening some rules for the ",(0,i.jsx)(n.code,{children:"test"})," directory."]}),"\n",(0,i.jsx)(n.h3,{id:"builddefaulteslintconfigjs",children:(0,i.jsx)(n.code,{children:"build/default.eslint.config.js"})}),"\n",(0,i.jsxs)(n.p,{children:["You may want to completely change these defaults and you can do so by creating a file\n",(0,i.jsx)(n.code,{children:"build/default.eslint.config.js"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",metastring:'title="build/default.eslint.config.js"',children:"const flecksEslintDefaults = require('@flecks/build/build/default.eslint.config');\nmodule.exports = async (flecks) => ({\n  extends: [\n    await flecksEslintDefaults(flecks),\n  ],\n  // ...\n});\n"})}),"\n",(0,i.jsx)(n.p,{children:"Again, you don't actually have to extend the configuration like that, you could return your own!"}),"\n",(0,i.jsx)(n.admonition,{title:"Wait a minute, is that asynchronous ESLint configuration?",type:"info",children:(0,i.jsxs)(n.p,{children:["ESLint has made *",(0,i.jsx)(n.em,{children:"async noises"}),"* lately, but as of this writing, the actually-working version requires\nyou to write synchronous configuration files. ",(0,i.jsx)(n.em,{children:"So how does flecks do it"}),"? Honestly?\n",(0,i.jsx)(n.a,{href:"https://github.com/cha0s/flecks/blob/master/packages/build/build/eslint.config.js",children:"Don't ask..."}),"\nWe interface with torturous APIs so you don't have to!"]})})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},5408:(e,n,s)=>{s.d(n,{Z:()=>i});const i=s.p+"assets/images/flecks-test-client-failed-49e983143a480c8c9d4923f33d085bb9.png"},5480:(e,n,s)=>{s.d(n,{Z:()=>i});const i=s.p+"assets/images/flecks-test-client-passed-8ca37755e8231280a12ef6a2240da94b.png"},1151:(e,n,s)=>{s.d(n,{Z:()=>l,a:()=>o});var i=s(7294);const t={},c=i.createContext(t);function o(e){const n=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(c.Provider,{value:n},e.children)}}}]);