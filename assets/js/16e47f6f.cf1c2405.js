"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[2837],{2011:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>a,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>r});var s=n(5893),t=n(1151);const o={title:"Building your application",description:"How your application is built."},l=void 0,c={id:"building-your-application",title:"Building your application",description:"How your application is built.",source:"@site/docs/building-your-application.mdx",sourceDirName:".",slug:"/building-your-application",permalink:"/flecks/docs/building-your-application",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Building your application",description:"How your application is built."},sidebar:"flecksSidebar",previous:{title:"Creating a fleck",permalink:"/flecks/docs/creating-a-fleck"},next:{title:"Adding flecks",permalink:"/flecks/docs/adding-flecks"}},a={},r=[{value:"Roots",id:"roots",level:2},{value:"Bootstrap",id:"bootstrap",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Stubs",id:"stubs",level:3},{value:"Compiling flecks",id:"compiling-flecks",level:2},{value:"Paths and aliases",id:"paths-and-aliases",level:3},{value:"Symlinks",id:"symlinks",level:3}];function d(e){const i={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.a)(),...e.components},{Details:n}=i;return n||function(e,i){throw new Error("Expected "+(i?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.p,{children:"flecks takes a build manifest such as:"}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{children:"'@flecks/build': {}\n'@flecks/core': {}\n'@flecks/server': {}\n'@aliased/fleck:./packages/aliased-fleck': {}\n"})}),"\n",(0,s.jsxs)(i.p,{children:["and determines both the ",(0,s.jsx)(i.strong,{children:"roots"})," and ",(0,s.jsx)(i.strong,{children:"paths"})," that compose the application, and whether they\nrequire compilation."]}),"\n",(0,s.jsx)(i.h2,{id:"roots",children:"Roots"}),"\n",(0,s.jsxs)(i.p,{children:["A root is the package root of a fleck. A package root is defined as a directory with a\n",(0,s.jsx)(i.code,{children:"package.json"})," file."]}),"\n",(0,s.jsx)(i.p,{children:"Multiple fleck paths may share the same root."}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Sneaky little fleckses"}),(0,s.jsxs)(i.p,{children:[(0,s.jsx)(i.code,{children:"@flecks/react"}),"'s root contains 7 flecks!"]}),(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/client"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/router"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/router/client"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/router/server"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/server"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"@flecks/react/tabs"})}),"\n"]})]}),"\n",(0,s.jsxs)(i.p,{children:["A root prefers to discover flecks within the ",(0,s.jsx)(i.code,{children:"src"})," directory, but will fallback to discovering\nfiles under the root if that fails."]}),"\n",(0,s.jsx)(i.h3,{id:"bootstrap",children:"Bootstrap"}),"\n",(0,s.jsxs)(i.p,{children:["flecks runs a bootstrap phase during which all ",(0,s.jsx)(i.strong,{children:"roots"})," are checked for the existence of a\n",(0,s.jsx)(i.code,{children:"build/flecks.bootstrap.js"})," script. If one exists, it is loaded as a fleck. The main difference\nis ",(0,s.jsx)(i.strong,{children:"the bootstrap script is executed by Node.JS as-is"})," and is not subject to any compilation or\npreprocessing."]}),"\n",(0,s.jsxs)(i.p,{children:["In addition to exporting ",(0,s.jsx)(i.code,{children:"hooks"}),", a bootstrap script may also export:"]}),"\n",(0,s.jsx)(i.h3,{id:"dependencies",children:"Dependencies"}),"\n",(0,s.jsx)(i.p,{children:"Dependent flecks will automatically be added to the build manifest."}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-js",children:"exports.dependencies = ['@some/fleck'];\n"})}),"\n",(0,s.jsx)(i.admonition,{title:"Fostering dependency",type:"tip",children:(0,s.jsxs)(i.p,{children:["If you run ",(0,s.jsx)(i.code,{children:"flecks add @some/fleck"})," in your fleck root, ",(0,s.jsx)(i.code,{children:"@some/fleck"})," will be added to your\n",(0,s.jsx)(i.code,{children:"package.json"})," and your ",(0,s.jsx)(i.code,{children:"exports.dependencies"})," will be automatically updated to include\n",(0,s.jsx)(i.code,{children:"@some/fleck"}),"."]})}),"\n",(0,s.jsx)(i.h3,{id:"stubs",children:"Stubs"}),"\n",(0,s.jsxs)(i.p,{children:["Some code isn't careful when it comes to things like accessing ",(0,s.jsx)(i.code,{children:"window"}),". flecks can stub out\nproblem modules on any platform:"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-js",children:"exports.stubs = {\n  server: ['@pixi'],\n};\n"})}),"\n",(0,s.jsxs)(i.p,{children:["This is effectively the Node.JS ",(0,s.jsx)(i.code,{children:"require()"})," version of\n",(0,s.jsxs)(i.a,{href:"https://webpack.js.org/configuration/resolve/#resolvealias",children:["Webpack's ",(0,s.jsx)(i.code,{children:"{'alias': false}"})," functionality"]}),"."]}),"\n",(0,s.jsx)(i.h2,{id:"compiling-flecks",children:"Compiling flecks"}),"\n",(0,s.jsxs)(i.p,{children:["A fleck will not always be compiled. Distributed flecks in production (e.g. one you install from\n",(0,s.jsx)(i.code,{children:"npm"}),") have already gone through a compilation step and will load very fast."]}),"\n",(0,s.jsx)(i.p,{children:"There are some conditions that, when matched, will result in a fleck being compiled."}),"\n",(0,s.jsx)(i.h3,{id:"paths-and-aliases",children:"Paths and aliases"}),"\n",(0,s.jsxs)(i.p,{children:["Paths are the package names of flecks. From our example above, ",(0,s.jsx)(i.code,{children:"@aliased/fleck"})," is a\npath. ",(0,s.jsx)(i.code,{children:"./packages/aliased-fleck"})," is an ",(0,s.jsx)(i.strong,{children:"alias"}),"."]}),"\n",(0,s.jsx)(i.admonition,{title:"Compilation condition",type:"info",children:(0,s.jsxs)(i.p,{children:["The root path of an aliased fleck is ",(0,s.jsx)(i.strong,{children:"compiled"}),"."]})}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Pitfalls with aliasing"}),(0,s.jsxs)(i.admonition,{title:"Aliased modules spaghetti",type:"warning",children:[(0,s.jsxs)(i.p,{children:["When an aliased fleck is compiled, its own ",(0,s.jsx)(i.code,{children:"node_modules"})," directory is added to the module search\npaths for the application. This makes it ",(0,s.jsx)(i.strong,{children:"very easy"})," to get started writing a modular fleck."]}),(0,s.jsxs)(i.p,{children:["There can easily come a point where aliased flecks in an application may have very esoteric\nrelationship between their ",(0,s.jsx)(i.code,{children:"node_modules"})," directories, including but not limited to duplicate\nversions of libraries being included in a compilation."]}),(0,s.jsx)(i.p,{children:"flecks makes very little effort to solve this problem as it is considered out of scope."})]}),(0,s.jsx)(i.admonition,{title:"Unlikely alias",type:"warning",children:(0,s.jsxs)(i.p,{children:["You probably shouldn't do things like name an alias the same thing as a package that actually\nexists in your ",(0,s.jsx)(i.code,{children:"node_modules"})," directory. This is mitigated if you use the default monorepo\nstructure (unless your application name is identical to a monorepo organization that already\nexists on ",(0,s.jsx)(i.code,{children:"npm"}),": ",(0,s.jsx)(i.strong,{children:"don't do that"}),")."]})}),(0,s.jsxs)(i.p,{children:["All that being said, ",(0,s.jsx)(i.strong,{children:"aliasing exists"})," and it can take you pretty far!"]}),(0,s.jsxs)(i.p,{children:["If you'd like to help define better behavior for these edge cases you could always\n",(0,s.jsx)(i.a,{href:"https://github.com/cha0s/flecks/compare",children:"submit a pull request"}),". ","\ud83d\ude04"]})]}),"\n",(0,s.jsx)(i.h3,{id:"symlinks",children:"Symlinks"}),"\n",(0,s.jsxs)(i.admonition,{title:"Compilation condition",type:"info",children:[(0,s.jsxs)(i.p,{children:["If a root path is a symlinked path, the root path is ",(0,s.jsx)(i.strong,{children:"compiled"}),"."]}),(0,s.jsxs)(i.admonition,{title:"Land of linkin'",type:"warning",children:[(0,s.jsxs)(i.p,{children:["Remember when you're linking a fleck to ",(0,s.jsxs)(i.strong,{children:["link the output ",(0,s.jsx)(i.code,{children:"dist"})," directory"]})," and not the root path\nof the fleck."]}),(0,s.jsxs)(i.p,{children:["When building a fleck, ",(0,s.jsxs)(i.a,{href:"./building-your-fleck#processing-packagejson",children:[(0,s.jsx)(i.code,{children:"package.json"})," is processed"]}),"\nand that processed output should ideally be the ",(0,s.jsx)(i.code,{children:"package.json"})," that your package manager sees."]}),(0,s.jsxs)(i.p,{children:["Don't worry: if the linked path ends with ",(0,s.jsx)(i.code,{children:"/dist"}),", the parent directory will be used as the root\npath!"]})]})]}),"\n",(0,s.jsx)(i.admonition,{title:"Link 'em up",type:"tip",children:(0,s.jsxs)(i.p,{children:["When you are developing anything Sufficiently Complex","\u2122\ufe0f",", ",(0,s.jsx)(i.strong,{children:"best practice is to symlink your\nfleck"})," so that your package manager can do its job and manage your dependency tree."]})}),"\n",(0,s.jsx)(i.p,{children:"Next, let's add and interact with some of the flecks shipped by default."})]})}function h(e={}){const{wrapper:i}={...(0,t.a)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,i,n)=>{n.d(i,{Z:()=>c,a:()=>l});var s=n(7294);const t={},o=s.createContext(t);function l(e){const i=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function c(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),s.createElement(o.Provider,{value:i},e.children)}}}]);