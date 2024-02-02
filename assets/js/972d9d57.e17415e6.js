"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[937],{3134:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>a});var i=s(5893),t=s(1151);const r={description:"flecks makes a joy of JavaScript app development.",slug:"/"},o="Introduction",l={id:"introduction",title:"Introduction",description:"flecks makes a joy of JavaScript app development.",source:"@site/docs/introduction.mdx",sourceDirName:".",slug:"/",permalink:"/flecks/docs/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{description:"flecks makes a joy of JavaScript app development.",slug:"/"},sidebar:"flecksSidebar",next:{title:"Getting Started",permalink:"/flecks/docs/category/getting-started"}},c={},a=[{value:"Features",id:"features",level:2},{value:"Design principles",id:"design-principles",level:2},{value:"Staying connected",id:"staying-connected",level:2},{value:"Something missing?",id:"something-missing",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"introduction",children:"Introduction"}),"\n",(0,i.jsxs)(n.p,{children:["\u26a1\ufe0f flecks will help you build a ",(0,i.jsx)(n.strong,{children:"flexible and powerful application in no time"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["\ud83d\udcb8 Save time and money and don't duplicate effort. Instead, ",(0,i.jsx)(n.strong,{children:"lean on infrastructure that already exists"})," to solve your problems."]}),"\n",(0,i.jsxs)(n.p,{children:["\ud83e\uddd0 flecks is an ",(0,i.jsx)(n.strong,{children:"exceptionally-extensible fullstack application production system"}),". Its true purpose\nis to make application development a more joyful endeavor. Intelligent defaults combined with\na highly dynamic structure motivate consistency while allowing you to easily express your own\narchitectural opinions."]}),"\n",(0,i.jsx)(n.h2,{id:"features",children:"Features"}),"\n",(0,i.jsx)(n.p,{children:"flecks is built with supreme attention to the developer and end-user experience."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\ud83e\udde9 ",(0,i.jsx)(n.strong,{children:"Small but pluggable"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The simplest application is two flecks, ",(0,i.jsx)(n.code,{children:"core"})," and ",(0,i.jsx)(n.code,{children:"server"})," (",(0,i.jsx)(n.strong,{children:"7 MB"})," production server size): you don't pay for what you don't buy"]}),"\n",(0,i.jsxs)(n.li,{children:["Endlessly configurable through built-in ",(0,i.jsx)(n.a,{href:"./docs/flecks/hooks",children:"hooks"})," and then your own"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\ud83d\udee0\ufe0f ",(0,i.jsx)(n.strong,{children:"Ready to build maintainable and performant production applications"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"./docs/documentation",children:"Documentation"})," generation for your project with no fuss"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"./docs/building-your-fleck#testing",children:"Write tests"}),", run on server/in browser/..."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"./docs/react",children:"React"})," / ",(0,i.jsx)(n.a,{href:"./docs/redux",children:"redux"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"./docs/sockets",children:"Realtime sockets"})," with lots of goodies like binary packing and packet dispatching"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"./docs/database",children:"Databases"})," using ",(0,i.jsx)(n.a,{href:"https://sequelize.org/",children:"Sequelize"})," to connect and ",(0,i.jsx)(n.a,{href:"https://www.docker.com/",children:"Docker"})," to easily persist"]}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"./docs/electron",children:"Electron"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"./docs/docker",children:"Docker"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"./docs/repl",children:"REPL"})}),"\n",(0,i.jsx)(n.li,{children:"babel + Webpack 5"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\ud83d\udc77 ",(0,i.jsx)(n.strong,{children:"Developers, developers, developers"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Easy to create a fleck; no need to publish packages or use voodoo"}),"\n",(0,i.jsx)(n.li,{children:"HMR (even on the server)"}),"\n",(0,i.jsx)(n.li,{children:"Configured to get instantly up and running with a consistent path toward production"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Our shared goal\u2014to help you quickly develop your application. We share our best practices to help you build your application right and well."}),"\n",(0,i.jsx)(n.h2,{id:"design-principles",children:"Design principles"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Little to learn"}),". flecks should be easy to learn and use as the API is quite small. Most things will still be achievable by users, even if it takes them more code and more time to write. Not having abstractions is better than having the wrong abstractions, and we don't want users to have to hack around the wrong abstractions. Mandatory talk\u2014",(0,i.jsx)(n.a,{href:"https://www.youtube.com/watch?v=4anAwXYqLG8",children:"Minimal API Surface Area"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Intuitive"}),". Users will not feel overwhelmed when looking at the project directory of a flecks project or adding new features. It should look intuitive and easy to build on top of, using approaches they are familiar with."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Modular"}),". flecks is built from the ground up with separation of concerns as a first-class concern."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Sensible defaults"}),". Common and popular performance optimizations and configurations will be done for users but they are given the option to override them. One should have to go out of their way in order to do the wrong thing."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"No vendor lock-in"}),". Users are not required to use the default flecks, although they are encouraged to."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Minimize duplicated effort"}),". For instance, we ripped a lot of this wording off of the Docusaurus introduction page. ","\ud83d\udc83"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"We believe that, as developers, knowing how something works helps us become better at using it. Hence we're dedicating effort to explaining the architecture and various aspects of flecks with the hope that users reading it will gain a deeper understanding and be even more proficient in using it."}),"\n",(0,i.jsx)(n.h2,{id:"staying-connected",children:"Staying connected"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/cha0s/flecks",children:"GitHub"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://discord.gg/SH66yQBwNf",children:"Discord"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.reddit.com/r/flecks/",children:"reddit"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://twitter.com/makeflecks",children:"X / Twitter"})}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"something-missing",children:"Something missing?"}),"\n",(0,i.jsxs)(n.p,{children:["If you find issues with the documentation or have suggestions on how to improve the documentation or the project in general, please ",(0,i.jsx)(n.a,{href:"https://github.com/cha0s/flecks/issues/new",children:"file an issue"})," for us."]})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>l,a:()=>o});var i=s(7294);const t={},r=i.createContext(t);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);