"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[2528],{6711:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var s=t(5893),i=t(1151);const r={title:"Testing",description:"Easily test your code across platforms."},a="Testing",c={id:"testing",title:"Testing",description:"Easily test your code across platforms.",source:"@site/docs/testing.mdx",sourceDirName:".",slug:"/testing",permalink:"/flecks/docs/testing",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Testing",description:"Easily test your code across platforms."},sidebar:"flecksSidebar",previous:{title:"Writing your code",permalink:"/flecks/docs/category/writing-your-code"},next:{title:"Hooks",permalink:"/flecks/docs/hooks"}},o={},d=[];function l(e){const n={admonition:"admonition",code:"code",h1:"h1",img:"img",p:"p",pre:"pre",strong:"strong",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"testing",children:"Testing"}),"\n",(0,s.jsx)(n.p,{children:"flecks uses Mocha and Chai to run your tests."}),"\n",(0,s.jsx)(n.p,{children:"Let's create a small test application to illustrate how testing works in flecks:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npx @flecks/create-app testing\n"})}),"\n",(0,s.jsx)(n.p,{children:"Move into your new project directory and create a fleck:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npx @flecks/create-fleck unit\n"})}),"\n",(0,s.jsx)(n.p,{children:"You will notice a line in the output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"No fleck tests found.\n"})}),"\n",(0,s.jsx)(n.p,{children:"flecks is trying to run the tests for the fleck, but none exist by default. Let's add some code\nand then add some tests to verify that it works."}),"\n",(0,s.jsxs)(n.p,{children:["Edit ",(0,s.jsx)(n.code,{children:"packages/unit/src/index.js"})," to add some code:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/unit/src/index.js"',children:"export const add2 = (n) => n + 2;\n\nexport const add3 = (n) => n + 3;\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Now create a ",(0,s.jsx)(n.code,{children:"packages/unit/test"})," directory and add a source file ",(0,s.jsx)(n.code,{children:"add2.js"})," inside:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/unit/test/add2.js"',children:"import {expect} from 'chai';\n\nconst {add2} = require('@testing/unit');\n\nit('can add two to a number', () => {\n  // highlight-next-line\n  expect(add2(2)).to.equal(5);\n});\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"We intentionally made an error so we can see what a failed test looks like."})}),"\n",(0,s.jsxs)(n.p,{children:["Now run the following command ",(0,s.jsxs)(n.strong,{children:["from within ",(0,s.jsx)(n.code,{children:"packages/unit"})]}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm run test\n"})}),"\n",(0,s.jsx)(n.p,{children:"You will see the following output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  1) can add two to a number\n\n  0 passing (11ms)\n  1 failing\n\n  1) can add two to a number:\n\n      AssertionError: expected 4 to equal 5\n      + expected - actual\n\n      -4\n      +5\n"})}),"\n",(0,s.jsx)(n.p,{children:"It caught the error! Let's fix it up:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/unit/test/add2.js"',children:"import {expect} from 'chai';\n\nconst {add2} = require('@testing/unit');\n\nit('can add two to a number', () => {\n  // highlight-next-line\n  expect(add2(2)).to.equal(4);\n});\n"})}),"\n",(0,s.jsx)(n.p,{children:"and try again:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm run test\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  \u2713 can add two to a number\n\n  1 passing (4ms)\n"})}),"\n",(0,s.jsx)(n.p,{children:"flecks also allows you to write tests that only target a specific platform. Let's add a webserver\nand then write a test that only runs for the client:"}),"\n",(0,s.jsx)(n.admonition,{type:"warning",children:(0,s.jsxs)(n.p,{children:["Make sure you run the following command in your ",(0,s.jsx)(n.strong,{children:"project directory"}),", not the ",(0,s.jsx)(n.code,{children:"packages/unit"}),"\ndirectory."]})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npx flecks add @flecks/web\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Now, let's add a test. We add a client test by adding a ",(0,s.jsx)(n.code,{children:"platforms/client"})," directory to our ",(0,s.jsx)(n.code,{children:"test"}),"\ndirectory and putting tests there:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/unit/test/platforms/client/add3.js"',children:"import {expect} from 'chai';\n\nconst {add3} = require('@testing/unit');\n\nit('can add three to a number', () => {\n  // highlight-next-line\n  expect(add3(2)).to.equal(6);\n});\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"We intentionally made a mistake again to show a test failure."})}),"\n",(0,s.jsx)(n.p,{children:"Now start your application:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm start\n"})}),"\n",(0,s.jsx)(n.p,{children:"Visit your website in the browser and you will see:"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"A screenshot of a browser showing the test runner page with our test failing",src:t(5408).Z+"",width:"1800",height:"1141"})}),"\n",(0,s.jsx)(n.p,{children:"The test is failing! That's what we expected."}),"\n",(0,s.jsx)(n.p,{children:"Now, edit your client test to fix it:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/unit/test/platforms/client/add3.js"',children:"import {expect} from 'chai';\n\nconst {add3} = require('@testing/unit');\n\nit('can add three to a number', () => {\n  // highlight-next-line\n  expect(add3(2)).to.equal(5);\n});\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Save the file. If you still have your application running, go look at the page. You'll notice that\n",(0,s.jsx)(n.strong,{children:"it updated automatically"})," to look like:"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"A screenshot of a browser showing the test runner page with our test passing",src:t(5480).Z+"",width:"1833",height:"850"})}),"\n",(0,s.jsx)(n.p,{children:"Awesome, everything passes!"}),"\n",(0,s.jsxs)(n.admonition,{title:"Sanity check",type:"info",children:[(0,s.jsxs)(n.p,{children:["If you run ",(0,s.jsx)(n.code,{children:"npm run test"})," in your ",(0,s.jsx)(n.code,{children:"packages/unit"})," directory, you will see that only one test was\nrun:"]}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  \u2713 can add two to a number\n\n  1 passing (3ms)\n"})}),(0,s.jsx)(n.p,{children:"That's correct; we only run client tests on the client."})]})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},5408:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/flecks-test-client-failed-49e983143a480c8c9d4923f33d085bb9.png"},5480:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/flecks-test-client-passed-8ca37755e8231280a12ef6a2240da94b.png"},1151:(e,n,t)=>{t.d(n,{Z:()=>c,a:()=>a});var s=t(7294);const i={},r=s.createContext(i);function a(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);