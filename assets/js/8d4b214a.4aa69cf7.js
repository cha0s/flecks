"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[4639],{8506:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>l,metadata:()=>c,toc:()=>r});var i=s(5893),t=s(1151);const l={title:"Adding flecks",description:"Add flecks to your application to extend its functionality."},o="Adding flecks",c={id:"adding-flecks",title:"Adding flecks",description:"Add flecks to your application to extend its functionality.",source:"@site/docs/adding-flecks.mdx",sourceDirName:".",slug:"/adding-flecks",permalink:"/flecks/docs/adding-flecks",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Adding flecks",description:"Add flecks to your application to extend its functionality."},sidebar:"flecksSidebar",previous:{title:"Creating a fleck",permalink:"/flecks/docs/creating-a-fleck"},next:{title:"Guides",permalink:"/flecks/docs/category/guides"}},d={},r=[{value:"Finally... a white page?",id:"finally-a-white-page",level:2},{value:"Proceed with the hooking",id:"proceed-with-the-hooking",level:2},{value:"Everything so far... plus Electron!",id:"everything-so-far-plus-electron",level:2}];function a(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"adding-flecks",children:"Adding flecks"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"@flecks/web"})," is a fleck that builds and serves a webpage. You can add it to your application\nusing the CLI:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npx flecks add @flecks/web\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Now, if you run ",(0,i.jsx)(n.code,{children:"npm start"}),", you'll see a line in the output:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"  @flecks/web/server/http HTTP server up @ 0.0.0.0:32340!\n"})}),"\n",(0,i.jsx)(n.h2,{id:"finally-a-white-page",children:"Finally... a white page?"}),"\n",(0,i.jsxs)(n.p,{children:["If you visit ",(0,i.jsx)(n.code,{children:"localhost:32340"})," in your browser, you should now see... a blank white page! Don't fret\nthough; if you open the devtools in your browser, you will see a little messaging from your\napplication that will look something like:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"[webpack-dev-server] Server started: Hot Module Replacement enabled, Live Reloading enabled, Progress disabled, Overlay enabled.\n[HMR] Waiting for update signal from WDS...\nflecks client v2.0.3 loading runtime...\n"})}),"\n",(0,i.jsx)(n.p,{children:"This is a good sign! This means we successfully added a web server with HMR enabled by default.\nOh, the possibilities..."}),"\n",(0,i.jsx)(n.h2,{id:"proceed-with-the-hooking",children:"Proceed with the hooking"}),"\n",(0,i.jsxs)(n.p,{children:["Let's make our fleck ",(0,i.jsx)(n.code,{children:"say-hello"})," hook into ",(0,i.jsx)(n.code,{children:"@flecks/web"})," client to do something when the client\ncomes up (e.g. the browser loads the page)."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/say-hello/src/index.js"',children:"export const hooks = {\n  // highlight-start\n  '@flecks/web/client.up': async () => {\n    window.document.body.append('hello world');\n  },\n  // highlight-end\n  '@flecks/server.up': async (flecks) => {\n    const {id} = flecks.get('@flecks/core');\n    process.stdout.write(`  hello server: ID ${id}\\n`);\n  },\n};\n"})}),"\n",(0,i.jsx)(n.p,{children:"Now, restart your application and refresh your website. Glorious, isn't it?"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"An image of our simple hello world application running inside a Chromium browser window",src:s(7929).Z+"",width:"628",height:"509"})}),"\n",(0,i.jsx)(n.h2,{id:"everything-so-far-plus-electron",children:"Everything so far... plus Electron!"}),"\n",(0,i.jsxs)(n.p,{children:["Let's add another core fleck. flecks ships with a core fleck ",(0,i.jsx)(n.code,{children:"@flecks/electron"}),". This runs your\napplication inside of an instance of ",(0,i.jsx)(n.a,{href:"https://www.electronjs.org/",children:"Electron"}),". You'll add the fleck:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npx flecks add -d @flecks/electron\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Finally ",(0,i.jsx)(n.code,{children:"npm start"})," and you will see something like this:"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"An image of our simple hello world application running inside an Electron window",src:s(6323).Z+"",width:"820",height:"655"})}),"\n",(0,i.jsxs)(n.p,{children:["Isn't it beautiful? ","\ud83d\ude0c"]}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsxs)(n.p,{children:["We used the ",(0,i.jsx)(n.code,{children:"-d"})," option with ",(0,i.jsx)(n.code,{children:"flecks add"})," to add ",(0,i.jsx)(n.code,{children:"@flecks/electron"})," to\n",(0,i.jsx)(n.a,{href:"https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file",children:(0,i.jsx)(n.code,{children:"devDependencies"})}),"\nsince it's only needed for development."]})})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},6323:(e,n,s)=>{s.d(n,{Z:()=>i});const i=s.p+"assets/images/flecks-electron-a0aa8d1371582b485c87402b0aa5b555.png"},7929:(e,n,s)=>{s.d(n,{Z:()=>i});const i=s.p+"assets/images/flecks-web-4d794c79b53faa14d140b2dde7e51709.png"},1151:(e,n,s)=>{s.d(n,{Z:()=>c,a:()=>o});var i=s(7294);const t={},l=i.createContext(t);function o(e){const n=i.useContext(l);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(l.Provider,{value:n},e.children)}}}]);