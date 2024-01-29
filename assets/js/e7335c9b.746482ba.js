"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[7639],{4243:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>a});var t=s(5893),c=s(1151);const o={title:"package.json and entrypoints",description:"Entrypoint detection and more."},i="package.json and entry points",r={id:"package-json",title:"package.json and entrypoints",description:"Entrypoint detection and more.",source:"@site/docs/package-json.mdx",sourceDirName:".",slug:"/package-json",permalink:"/flecks/docs/package-json",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"package.json and entrypoints",description:"Entrypoint detection and more."},sidebar:"flecksSidebar",previous:{title:"Platforms",permalink:"/flecks/docs/platforms"},next:{title:"Documentation",permalink:"/flecks/docs/documentation"}},l={},a=[];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,c.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"packagejson-and-entry-points",children:[(0,t.jsx)(n.code,{children:"package.json"})," and entry points"]}),"\n",(0,t.jsxs)(n.p,{children:["When developing a fleck (or any other package), we can specifiy the files included in the package\nwithin our ",(0,t.jsx)(n.code,{children:"package.json"}),"'s ",(0,t.jsx)(n.code,{children:'"files"'})," key. However, flecks augments your source ",(0,t.jsx)(n.code,{children:"package.json"}),"\nduring the build process and outputs a ",(0,t.jsxs)(n.strong,{children:["built ",(0,t.jsx)(n.code,{children:"package.json"})]}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["If you generate a fleck using ",(0,t.jsx)(n.code,{children:"create-fleck"}),", its ",(0,t.jsx)(n.code,{children:'"files"'})," key will look like this:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'  "files": [\n    "index.js"\n  ],\n'})}),"\n",(0,t.jsxs)(n.p,{children:["This tells flecks that ",(0,t.jsx)(n.code,{children:"index.js"})," is an\n",(0,t.jsx)(n.a,{href:"https://webpack.js.org/concepts/entry-points/",children:"entry point"}),". Any file resolvable by webpack will\nbe treated as an entry point and a separate file will be built and output."]}),"\n",(0,t.jsxs)(n.p,{children:["flecks automatically adds some paths to the ",(0,t.jsx)(n.code,{children:'"files"'})," key of your built ",(0,t.jsx)(n.code,{children:"package.json"}),":"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"build"})," directory"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"src"})," directory (if sources exist)"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"sourcemaps"})," for each entry point (e.g. ",(0,t.jsx)(n.code,{children:"index.js"})," -> ",(0,t.jsx)(n.code,{children:"index.js.map"}),")"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"test"})," directory (if tests exist)"]}),"\n"]}),"\n",(0,t.jsxs)(n.admonition,{title:"Hook that one, too",type:"tip",children:[(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"@flecks/fleck"})," invokes a hook\n",(0,t.jsx)(n.a,{href:"./flecks/hooks#flecksfleckpackagejson",children:(0,t.jsx)(n.code,{children:"@flecks/fleck.packageJson"})})," which exposes this for any\nother fleck to process ",(0,t.jsx)(n.code,{children:"package.json"})," when building a fleck."]}),(0,t.jsxs)(n.p,{children:["For instance, ",(0,t.jsx)(n.code,{children:"@flecks/web"})," implements this hook. ",(0,t.jsx)(n.code,{children:"@flecks/web"})," will automatically output\nCSS, fonts, and other frontend assets to the ",(0,t.jsx)(n.code,{children:"assets"})," directory in your build output. If any of\nthese frontend assets exist, ",(0,t.jsx)(n.code,{children:"@flecks/web"})," will automatically add the ",(0,t.jsx)(n.code,{children:"assets"})," directory to the\n",(0,t.jsx)(n.code,{children:'"files"'})," key of your built ",(0,t.jsx)(n.code,{children:"package.json"}),". You don't have to think about it!"]})]}),"\n",(0,t.jsxs)(n.p,{children:["If you look at the\n",(0,t.jsxs)(n.a,{href:"https://www.npmjs.com/package/@flecks/react?activeTab=code",children:["published ",(0,t.jsx)(n.code,{children:"@flecks/react"})," package on ",(0,t.jsx)(n.code,{children:"npm"})]}),"\nyou will see a tree of files published in the package:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"A screenshot showing the file tree of the @flecks/react package on npm",src:s(7713).Z+"",width:"786",height:"736"})}),"\n",(0,t.jsxs)(n.p,{children:["However, if you look at\n",(0,t.jsxs)(n.a,{href:"https://github.com/cha0s/flecks/blob/master/packages/react/package.json#L22",children:["the ",(0,t.jsx)(n.code,{children:'"files"'})," key definition in ",(0,t.jsx)(n.code,{children:"package.json"})," in the ",(0,t.jsx)(n.code,{children:"@flecks/react"})," source"]}),"\nyou will see that it includes far fewer files:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'  "files": [\n    "client.js",\n    "context.js",\n    "fake-context.js",\n    "index.js",\n    "router/client.js",\n    "router/context.js",\n    "router/index.js",\n    "router/server.js",\n    "server.js",\n    "tabs.js"\n  ],\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Think of your ",(0,t.jsx)(n.code,{children:'"files"'})," key as a sort of ",(0,t.jsx)(n.code,{children:"exports"}),", but for your files. Other code could ",(0,t.jsx)(n.code,{children:"import"}),"\nany of those paths (e.g. ",(0,t.jsx)(n.code,{children:"@flecks/react/client"}),", ",(0,t.jsx)(n.code,{children:"@flecks/react/router/client"}),",\n",(0,t.jsx)(n.code,{children:"@flecks/react/tabs"}),", etc.)."]}),"\n",(0,t.jsx)(n.p,{children:"You don't have to think about or remember any of those other files! Let flecks handle it for you."})]})}function h(e={}){const{wrapper:n}={...(0,c.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},7713:(e,n,s)=>{s.d(n,{Z:()=>t});const t=s.p+"assets/images/flecks-react-npm-a39f6a82db985c9fbf2c84f20734177d.png"},1151:(e,n,s)=>{s.d(n,{Z:()=>r,a:()=>i});var t=s(7294);const c={},o=t.createContext(c);function i(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);