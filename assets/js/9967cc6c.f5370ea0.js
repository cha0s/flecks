"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[1073],{3899:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>c,metadata:()=>d,toc:()=>t});var i=o(5893),s=o(1151);const c={title:"Hooks",description:"The key to unlocking the power of flecks."},r=void 0,d={id:"hooks",title:"Hooks",description:"The key to unlocking the power of flecks.",source:"@site/docs/hooks.mdx",sourceDirName:".",slug:"/hooks",permalink:"/flecks/docs/hooks",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Hooks",description:"The key to unlocking the power of flecks."},sidebar:"flecksSidebar",previous:{title:"Writing your code",permalink:"/flecks/docs/category/writing-your-code"},next:{title:"Gathering and Providing",permalink:"/flecks/docs/gathering"}},l={},t=[{value:"Invocation",id:"invocation",level:2},{value:"<code>invoke</code>",id:"invoke",level:3},{value:"<code>invokeAsync</code>",id:"invokeasync",level:3},{value:"<code>hook: string</code>",id:"hook-string",level:4},{value:"<code>invokeFleck</code>",id:"invokefleck",level:3},{value:"<code>hook: string</code>",id:"hook-string-1",level:4},{value:"<code>fleck: string</code>",id:"fleck-string",level:4},{value:"<code>invokeFlat</code>",id:"invokeflat",level:3},{value:"<code>hook: string</code>",id:"hook-string-2",level:4},{value:"<code>invokeComposed</code>",id:"invokecomposed",level:3},{value:"<code>invokeComposedAsync</code>",id:"invokecomposedasync",level:3},{value:"<code>hook: string</code>",id:"hook-string-3",level:4},{value:"<code>initial: any</code>",id:"initial-any",level:4},{value:"<code>invokeMerge</code>",id:"invokemerge",level:3},{value:"<code>invokeMergeAsync</code>",id:"invokemergeasync",level:3},{value:"<code>hook: string</code>",id:"hook-string-4",level:4},{value:"<code>invokeMergeUnique</code>",id:"invokemergeunique",level:3},{value:"<code>invokeMergeUniqueAsync</code>",id:"invokemergeuniqueasync",level:3},{value:"<code>hook: string</code>",id:"hook-string-5",level:4},{value:"<code>invokeReduce</code>",id:"invokereduce",level:3},{value:"<code>invokeReduceAsync</code>",id:"invokereduceasync",level:3},{value:"<code>hook: string</code>",id:"hook-string-6",level:4},{value:"<code>reduce: function</code>",id:"reduce-function",level:4},{value:"<code>initial: any</code>",id:"initial-any-1",level:4},{value:"<code>invokeSequential</code>",id:"invokesequential",level:3},{value:"<code>invokeSequentialAsync</code>",id:"invokesequentialasync",level:3},{value:"<code>hook: string</code>",id:"hook-string-7",level:4},{value:"<code>makeMiddleware</code>",id:"invokemiddleware",level:3}];function a(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["Hooks are how everything happens in flecks. There are many hooks and the hooks provided by flecks\nare documented at the ",(0,i.jsx)(n.a,{href:"./flecks/hooks",children:"hooks reference page"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["To define hooks (and turn your plain ol' boring JS modules into beautiful interesting flecks), you\nonly have to export a ",(0,i.jsx)(n.code,{children:"hooks"})," object:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"export const hooks = {\n  '@flecks/core.starting': () => {\n    console.log('hello, gorgeous');\n  },\n};\n"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Note:"})," All hooks recieve an extra final argument, which is the flecks instance."]}),"\n",(0,i.jsx)(n.h2,{id:"invocation",children:"Invocation"}),"\n",(0,i.jsx)(n.p,{children:"Hooks may be invoked using different invocation methods which may affect the order of invocation\nas well as the final result."}),"\n",(0,i.jsx)(n.p,{children:"All methods accept an arbitrary number of arguments after the specified arguments."}),"\n",(0,i.jsxs)(n.p,{children:["All methods pass the ",(0,i.jsx)(n.code,{children:"flecks"})," instance as the last argument."]}),"\n",(0,i.jsx)("style",{children:"\nh3 > code:before {\n  content: 'flecks.';\n}\n#invoke > code:after,\n#invokeasync > code:after\n{\n  content: '(hook, ...args)';\n}\n#invokeflat > code:after {\n  content: '(hook, ...args)';\n}\n#invoke,\n#invokecomposed,\n#invokemerge,\n#invokemergeunique,\n#invokereduce,\n#invokesequential\n{\n  margin-bottom: calc( var(--ifm-heading-vertical-rhythm-bottom) * var(--ifm-leading) / 2 )\n}\n#invokeasync,\n#invokecomposedasync,\n#invokemergeasync,\n#invokemergeuniqueasync,\n#invokereduceasync,\n#invokesequentialasync\n{\n  margin-top: 0;\n}\n#invokecomposed > code:after,\n#invokecomposedasync > code:after\n{\n  content: '(hook, initial, ...args)';\n}\n#invokefleck > code:after {\n  content: '(hook, fleck, ...args)';\n}\n#invokemerge > code:after,\n#invokemergeasync > code:after,\n#invokemergeunique > code:after,\n#invokemergeuniqueasync > code:after\n{\n  content: '(hook, ...args)';\n}\n#invokereduce > code:after,\n#invokereduceasync > code:after\n{\n  content: '(hook, reducer, initial, ...args)';\n}\n#invokesequential > code:after,\n#invokesequentialasync > code:after\n{\n  content: '(hook, ...args)';\n}\n#invokemiddleware > code:after\n{\n  content: '(hook, ...args)';\n}\n"}),"\n",(0,i.jsx)(n.h3,{id:"invoke",children:(0,i.jsx)(n.code,{children:"invoke"})}),"\n",(0,i.jsx)(n.h3,{id:"invokeasync",children:(0,i.jsx)(n.code,{children:"invokeAsync"})}),"\n",(0,i.jsx)(n.p,{children:"Invokes all hook implementations and returns the results keyed by the implementing flecks' paths."}),"\n",(0,i.jsx)(n.h4,{id:"hook-string",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsx)(n.h3,{id:"invokefleck",children:(0,i.jsx)(n.code,{children:"invokeFleck"})}),"\n",(0,i.jsx)(n.p,{children:"Invoke a single fleck's hook implementation and return the result."}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-1",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsx)(n.h4,{id:"fleck-string",children:(0,i.jsx)(n.code,{children:"fleck: string"})}),"\n",(0,i.jsx)(n.p,{children:"The fleck whose hook to invoke."}),"\n",(0,i.jsx)(n.h3,{id:"invokeflat",children:(0,i.jsx)(n.code,{children:"invokeFlat"})}),"\n",(0,i.jsx)(n.p,{children:"Invokes all hook implementations and returns the results as an array."}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-2",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsxs)(n.admonition,{title:"Just a spoonful of sugar",type:"tip",children:[(0,i.jsx)(n.p,{children:"The following test would pass:"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"expect(flecks.invokeFlat('some-hook'))\n  .to.deep.equal(Object.values(flecks.invoke('some-hook')));\n"})})]}),"\n",(0,i.jsx)(n.h3,{id:"invokecomposed",children:(0,i.jsx)(n.code,{children:"invokeComposed"})}),"\n",(0,i.jsx)(n.h3,{id:"invokecomposedasync",children:(0,i.jsx)(n.code,{children:"invokeComposedAsync"})}),"\n",(0,i.jsxs)(n.p,{children:["See: ",(0,i.jsx)(n.a,{href:"https://www.educative.io/edpresso/function-composition-in-javascript",children:"function composition"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"initial"})," is passed to the first implementation, which returns a result which is passed to the\nsecond implementation, which returns a result which is passed to the third implementation, etc."]}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-3",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsx)(n.h4,{id:"initial-any",children:(0,i.jsx)(n.code,{children:"initial: any"})}),"\n",(0,i.jsx)(n.p,{children:"The initial value."}),"\n",(0,i.jsxs)(n.p,{children:["Composed hooks are ",(0,i.jsx)(n.a,{href:"./ordering",children:"orderable"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"invokemerge",children:(0,i.jsx)(n.code,{children:"invokeMerge"})}),"\n",(0,i.jsx)(n.h3,{id:"invokemergeasync",children:(0,i.jsx)(n.code,{children:"invokeMergeAsync"})}),"\n",(0,i.jsx)(n.p,{children:"Invokes all hook implementations and returns the result of merging all implementations' returned objects together."}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-4",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsx)(n.h3,{id:"invokemergeunique",children:(0,i.jsx)(n.code,{children:"invokeMergeUnique"})}),"\n",(0,i.jsx)(n.h3,{id:"invokemergeuniqueasync",children:(0,i.jsx)(n.code,{children:"invokeMergeUniqueAsync"})}),"\n",(0,i.jsxs)(n.p,{children:["Specialization of ",(0,i.jsx)(n.code,{children:"invokeMerge"})," that will throw an error if any keys overlap."]}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-5",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsx)(n.h3,{id:"invokereduce",children:(0,i.jsx)(n.code,{children:"invokeReduce"})}),"\n",(0,i.jsx)(n.h3,{id:"invokereduceasync",children:(0,i.jsx)(n.code,{children:"invokeReduceAsync"})}),"\n",(0,i.jsxs)(n.p,{children:["See: ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce",children:"Array.prototype.reduce()"})]}),"\n",(0,i.jsxs)(n.p,{children:["Invokes hook implementations one at a time, their results being passed to the reducer as ",(0,i.jsx)(n.code,{children:"currentValue"}),". Returns the final reduction."]}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-6",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsx)(n.h4,{id:"reduce-function",children:(0,i.jsx)(n.code,{children:"reduce: function"})}),"\n",(0,i.jsx)(n.p,{children:"The reducer function."}),"\n",(0,i.jsx)(n.h4,{id:"initial-any-1",children:(0,i.jsx)(n.code,{children:"initial: any"})}),"\n",(0,i.jsx)(n.p,{children:"The initial value."}),"\n",(0,i.jsx)(n.h3,{id:"invokesequential",children:(0,i.jsx)(n.code,{children:"invokeSequential"})}),"\n",(0,i.jsx)(n.h3,{id:"invokesequentialasync",children:(0,i.jsx)(n.code,{children:"invokeSequentialAsync"})}),"\n",(0,i.jsxs)(n.p,{children:["Invokes all hook implementations, one after another. In the async variant, each implementation's result is ",(0,i.jsx)(n.code,{children:"await"}),"ed before invoking the next implementation."]}),"\n",(0,i.jsx)(n.h4,{id:"hook-string-7",children:(0,i.jsx)(n.code,{children:"hook: string"})}),"\n",(0,i.jsx)(n.p,{children:"The hook to invoke."}),"\n",(0,i.jsxs)(n.p,{children:["Sequential hooks are ",(0,i.jsx)(n.a,{href:"/flecks/docs/ordering",children:"orderable"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"invokemiddleware",children:(0,i.jsx)(n.code,{children:"makeMiddleware"})}),"\n",(0,i.jsx)(n.p,{children:"Hooks may be implemented in the style of Express middleware."}),"\n",(0,i.jsxs)(n.p,{children:["Each implementation will be expected to accept 0 or more arguments followed by a ",(0,i.jsx)(n.code,{children:"next"})," function\nwhich the implementation invokes when passing execution on to the next implementation."]}),"\n",(0,i.jsx)(n.p,{children:"Usage with express would look something like:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"app.use(flecks.makeMiddleware('@my/fleck.hook'));\n"})}),"\n",(0,i.jsxs)(n.p,{children:["For more information, see: ",(0,i.jsx)(n.a,{href:"http://expressjs.com/en/guide/using-middleware.html",children:"http://expressjs.com/en/guide/using-middleware.html"})]})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},1151:(e,n,o)=>{o.d(n,{Z:()=>d,a:()=>r});var i=o(7294);const s={},c=i.createContext(s);function r(e){const n=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(c.Provider,{value:n},e.children)}}}]);