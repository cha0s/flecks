"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[2837],{2011:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>c,contentTitle:()=>t,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>a});var s=n(5893),l=n(1151);const o={title:"Building your application",description:"How your application is built."},t=void 0,r={id:"building-your-application",title:"Building your application",description:"How your application is built.",source:"@site/docs/building-your-application.mdx",sourceDirName:".",slug:"/building-your-application",permalink:"/flecks/docs/building-your-application",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Building your application",description:"How your application is built."},sidebar:"flecksSidebar",previous:{title:"Adding flecks",permalink:"/flecks/docs/adding-flecks"},next:{title:"Guides",permalink:"/flecks/docs/category/guides"}},c={},a=[{value:"Roots",id:"roots",level:2},{value:"Compilation",id:"compilation",level:2},{value:"Symlinks",id:"symlinks",level:3},{value:"Paths and aliases",id:"paths-and-aliases",level:3}];function d(e){const i={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.a)(),...e.components},{Details:n}=i;return n||function(e,i){throw new Error("Expected "+(i?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(i.p,{children:["flecks takes a build manifest at ",(0,s.jsx)(i.code,{children:"build/flecks.yml"})," such as:"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{children:"'@flecks/core': {}\n'@flecks/server': {}\n'@hello-world/say-hello:./packages/say-hello': {}\n"})}),"\n",(0,s.jsxs)(i.p,{children:["and determines both the ",(0,s.jsx)(i.strong,{children:"roots"})," and ",(0,s.jsx)(i.strong,{children:"paths"})," that compose the application, and whether they\nrequire compilation."]}),"\n",(0,s.jsx)(i.h2,{id:"roots",children:"Roots"}),"\n",(0,s.jsxs)(i.p,{children:["A root is the package root of a fleck. A package root is defined as a directory with a\n",(0,s.jsx)(i.code,{children:"package.json"})," file."]}),"\n",(0,s.jsx)(i.p,{children:"Multiple fleck paths may share the same root."}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Sneaky little fleckses"}),(0,s.jsxs)(i.p,{children:[(0,s.jsx)(i.code,{children:"@flecks/react"}),"'s root contains 7 flecks!"]}),(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/client"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/router"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/router/client"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/router/server"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/server"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/tabs"})}),"\n"]})]}),"\n",(0,s.jsxs)(i.p,{children:["A root prefers to discover flecks within the ",(0,s.jsx)(i.code,{children:"src"})," directory, but will fallback to discovering\nfiles under the root if that fails."]}),"\n",(0,s.jsx)(i.admonition,{title:"Clean defaults",type:"tip",children:(0,s.jsxs)(i.p,{children:["When you create a fleck with ",(0,s.jsx)(i.code,{children:"@flecks/create-fleck"}),", it organizes your source code into a ",(0,s.jsx)(i.code,{children:"src"}),"\ndirectory as a default convention. Automatically discovering ",(0,s.jsx)(i.code,{children:"src"})," allows you to e.g.\n",(0,s.jsx)(i.code,{children:"require('@hello-world/say-hello/server')"})," instead of having to use the real filepath e.g.\n",(0,s.jsx)(i.code,{children:"require('@hello-world/say-hello/src/server')"}),"."]})}),"\n",(0,s.jsx)(i.h2,{id:"compilation",children:"Compilation"}),"\n",(0,s.jsxs)(i.p,{children:["A fleck will not always be compiled. flecks you e.g. install from ",(0,s.jsx)(i.code,{children:"npm"})," have already gone through\na compilation step and will load very fast. Skipping compilation saves a lot of time when building\nan application!"]}),"\n",(0,s.jsx)(i.p,{children:"There are some conditions which when matched will result in a fleck being compiled."}),"\n",(0,s.jsx)(i.h3,{id:"symlinks",children:"Symlinks"}),"\n",(0,s.jsx)(i.p,{children:"If you organize your application's flecks as npm workspaces (the current recommended example), npm\nwill symlink your packages in the application."}),"\n",(0,s.jsx)(i.admonition,{title:"Compilation condition",type:"info",children:(0,s.jsxs)(i.p,{children:["If a root path is a symlinked path, the root path is ",(0,s.jsx)(i.strong,{children:"compiled"}),"."]})}),"\n",(0,s.jsxs)(i.admonition,{title:"Land of linkin'",type:"warning",children:[(0,s.jsxs)(i.p,{children:[(0,s.jsx)(i.code,{children:"@flecks/create-fleck"})," uses a couple conventions to structure your fleck:"]}),(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["Source code is organized under the ",(0,s.jsx)(i.code,{children:"src"})," directory"]}),"\n",(0,s.jsxs)(i.li,{children:["Build output goes to ",(0,s.jsx)(i.code,{children:"dist/fleck"})]}),"\n"]}),(0,s.jsxs)(i.p,{children:[(0,s.jsxs)(i.strong,{children:["If the linked path ends with ",(0,s.jsx)(i.code,{children:"/dist/fleck"}),", the parent directory will be used as the root\npath!"]})," This means that ",(0,s.jsxs)(i.strong,{children:["flecks will discover the ",(0,s.jsx)(i.code,{children:"src"})," directory"]})," as explained above and use\nit when compiling your application. Nice and hot!"]})]}),"\n",(0,s.jsx)(i.h3,{id:"paths-and-aliases",children:"Paths and aliases"}),"\n",(0,s.jsxs)(i.p,{children:["Paths are the package names of flecks. From our example above, ",(0,s.jsx)(i.code,{children:"@hello-world/say-hello"})," is a\npath. ",(0,s.jsx)(i.code,{children:"./packages/say-hello"})," is an ",(0,s.jsx)(i.strong,{children:"alias"}),"."]}),"\n",(0,s.jsx)(i.admonition,{title:"Compilation condition",type:"info",children:(0,s.jsxs)(i.p,{children:["The root path of an aliased fleck is ",(0,s.jsx)(i.strong,{children:"compiled"}),"."]})}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Pitfalls with aliasing"}),(0,s.jsxs)(i.admonition,{title:"Aliased modules spaghetti",type:"warning",children:[(0,s.jsxs)(i.p,{children:["When an aliased fleck is compiled, its own ",(0,s.jsx)(i.code,{children:"node_modules"})," directory is added to the module search\npaths for the application. This makes it ",(0,s.jsx)(i.strong,{children:"very easy"})," to get started writing a modular fleck."]}),(0,s.jsxs)(i.p,{children:["There can easily come a point where aliased flecks in an application may have very esoteric\nrelationship between their ",(0,s.jsx)(i.code,{children:"node_modules"})," directories, including but not limited to duplicate\nversions of libraries being included in a compilation."]}),(0,s.jsx)(i.p,{children:"flecks makes very little effort to solve this problem as it is considered out of scope."})]}),(0,s.jsx)(i.admonition,{title:"Unlikely alias",type:"warning",children:(0,s.jsxs)(i.p,{children:["You probably shouldn't do things like name an alias the same thing as a package that actually\nexists in your ",(0,s.jsx)(i.code,{children:"node_modules"})," directory. This is mitigated if you use the default monorepo\nstructure (unless your application name is identical to a monorepo organization that already\nexists on ",(0,s.jsx)(i.code,{children:"npm"}),": ",(0,s.jsx)(i.strong,{children:"don't do that"}),")."]})}),(0,s.jsxs)(i.p,{children:["All that being said, ",(0,s.jsx)(i.strong,{children:"aliasing exists"}),"!"]}),(0,s.jsxs)(i.p,{children:["If you'd like to help define better behavior for these edge cases you could always\n",(0,s.jsx)(i.a,{href:"https://github.com/cha0s/flecks/compare",children:"submit a pull request"}),". ","\ud83d\ude04"]})]}),"\n",(0,s.jsxs)(i.admonition,{title:"Link 'em up",type:"tip",children:[(0,s.jsxs)(i.p,{children:["When you are rapidly developing anything Sufficiently Complex\u2122, ",(0,s.jsx)(i.strong,{children:"best practice is to symlink\nyour fleck"})," so that your package manager can do its job and manage your dependency tree."]}),(0,s.jsx)(i.p,{children:"Aliasing is only provided as an escape hatch."})]})]})}function h(e={}){const{wrapper:i}={...(0,l.a)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,i,n)=>{n.d(i,{Z:()=>r,a:()=>t});var s=n(7294);const l={},o=s.createContext(l);function t(e){const i=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),s.createElement(o.Provider,{value:i},e.children)}}}]);