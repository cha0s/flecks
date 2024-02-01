"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[1052],{2242:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>l,default:()=>h,frontMatter:()=>a,metadata:()=>c,toc:()=>d});var s=t(5893),r=t(1151),o=t(3200);const a={title:"React",description:"Define root components, enable SSR, and more."},l="React",c={id:"react",title:"React",description:"Define root components, enable SSR, and more.",source:"@site/docs/react.mdx",sourceDirName:".",slug:"/react",permalink:"/flecks/docs/react",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"React",description:"Define root components, enable SSR, and more."},sidebar:"flecksSidebar",previous:{title:"Sockets",permalink:"/flecks/docs/sockets"},next:{title:"Electron",permalink:"/flecks/docs/electron"}},i={},d=[{value:"Getting started",id:"getting-started",level:2},{value:"Add a root component",id:"add-a-root-component",level:3},{value:"Go check it out",id:"go-check-it-out",level:3},{value:"Hot module reloading",id:"hot-module-reloading",level:3},{value:"Hooks",id:"hooks",level:2},{value:"<code>useFlecks()</code>",id:"useflecks",level:3},{value:"<code>useEvent(object, eventName, fn)</code>",id:"useeventobject-eventname-fn",level:3},{value:"<code>object</code>",id:"object",level:4},{value:"<code>eventName</code>",id:"eventname",level:4},{value:"<code>fn</code>",id:"fn",level:4},{value:"<code>usePrevious(value)</code>",id:"usepreviousvalue",level:3},{value:"<code>value</code>",id:"value",level:4}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"react",children:"React"}),"\n",(0,s.jsx)(n.h2,{id:"getting-started",children:"Getting started"}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a little app to demonstrate how to use ",(0,s.jsx)(n.a,{href:"https://react.dev/",children:"React"})," in flecks:"]}),"\n",(0,s.jsx)(o.Z,{type:"app",pkg:"react-test"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cd react-test\n"})}),"\n",(0,s.jsx)(n.p,{children:"We'll also create a little fleck to hold our root component:"}),"\n",(0,s.jsx)(o.Z,{type:"fleck",pkg:"root"}),"\n",(0,s.jsxs)(n.p,{children:["We'll add the ",(0,s.jsx)(n.code,{children:"react"})," fleck to our new fleck:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cd packages/root\nnpx flecks add @flecks/react\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"tip",children:(0,s.jsxs)(n.p,{children:["We add ",(0,s.jsx)(n.code,{children:"@flecks/react"})," to ",(0,s.jsx)(n.code,{children:"packages/root"})," instead of our application directory so that our new\nfleck encapsulates all the dependencies it needs. You can distribute your flecks to others if you\ndo this right!"]})}),"\n",(0,s.jsx)(n.h3,{id:"add-a-root-component",children:"Add a root component"}),"\n",(0,s.jsxs)(n.p,{children:["Let's implement a hook to add a component to ",(0,s.jsx)(n.code,{children:"@flecks/react"}),"'s root components:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",metastring:'title="packages/root/src/index.js"',children:"import Component from './component';\n\nexport const hooks = {\n  '@flecks/react.roots': () => Component,\n};\n"})}),"\n",(0,s.jsx)(n.p,{children:"Let's also add our component source file:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-jsx",metastring:'title="packages/root/src/component.jsx"',children:"import {React} from '@flecks/react';\n\nfunction Component() {\n  return <p>hello world (from React)</p>;\n}\n\nexport default Component;\n"})}),"\n",(0,s.jsxs)(n.admonition,{title:"Hey, where's my React?",type:"tip",children:[(0,s.jsxs)(n.p,{children:["You may notice we imported ",(0,s.jsx)(n.code,{children:"React"})," from ",(0,s.jsx)(n.code,{children:"@flecks/react"})," instead of ",(0,s.jsx)(n.code,{children:"react"}),". This is provided as a\nconvenience. flecks is a very dynamic system and it may also be possible to load multiple React\nversions on your page."]}),(0,s.jsxs)(n.p,{children:["Using ",(0,s.jsx)(n.code,{children:"@flecks/react"})," makes sure your components are all using the same instance of ",(0,s.jsx)(n.code,{children:"React"}),"."]})]}),"\n",(0,s.jsx)(n.h3,{id:"go-check-it-out",children:"Go check it out"}),"\n",(0,s.jsx)(n.p,{children:"Start your application:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm run start\n"})}),"\n",(0,s.jsx)(n.p,{children:"Visit your website in your browser and you will see the hello world message!"}),"\n",(0,s.jsxs)(n.admonition,{title:"Server-Side Rendering (SSR)",type:"tip",children:[(0,s.jsxs)(n.p,{children:["If you disable JavaScript in your browser and reload the page you will still see the message. This\nis because ",(0,s.jsx)(n.strong,{children:"Server-Side Rendering (SSR) is enabled by default"}),"! If you don't want this, update your\n",(0,s.jsx)(n.code,{children:"build/flecks.yml"}),":"]}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yml",metastring:'title="build/flecks.yml"',children:"'@flecks/build': {}\n'@flecks/core':\n  id: react-test\n// highlight-start\n'@flecks/react':\n  ssr: false\n// highlight-end\n'@flecks/server': {}\n'@react-test/root:./packages/root/src': {}\n"})}),(0,s.jsx)(n.p,{children:"Now if you visit the page with JavaScript disabled, you will get a white page."})]}),"\n",(0,s.jsx)(n.h3,{id:"hot-module-reloading",children:"Hot module reloading"}),"\n",(0,s.jsx)(n.p,{children:"You'll notice that if you edit your component, the changes are immediately reflected on the page.\nThis is because we have HMR support in our application!"}),"\n",(0,s.jsx)(n.h2,{id:"hooks",children:"Hooks"}),"\n",(0,s.jsx)(n.h3,{id:"useflecks",children:(0,s.jsx)(n.code,{children:"useFlecks()"})}),"\n",(0,s.jsxs)(n.p,{children:["You may use this hook from your components to gain access to the ",(0,s.jsx)(n.code,{children:"flecks"})," instance."]}),"\n",(0,s.jsx)(n.p,{children:"Example:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-jsx",children:"function Component() {\n  const flecks = useFlecks();\n  const id = flecks.get('@flecks/core.id');\n  return <p>Your application ID is {id}</p>;\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"useeventobject-eventname-fn",children:(0,s.jsx)(n.code,{children:"useEvent(object, eventName, fn)"})}),"\n",(0,s.jsx)(n.h4,{id:"object",children:(0,s.jsx)(n.code,{children:"object"})}),"\n",(0,s.jsx)(n.p,{children:"The event emitter to listen to"}),"\n",(0,s.jsx)(n.h4,{id:"eventname",children:(0,s.jsx)(n.code,{children:"eventName"})}),"\n",(0,s.jsx)(n.p,{children:"The name of the event to listen for."}),"\n",(0,s.jsx)(n.h4,{id:"fn",children:(0,s.jsx)(n.code,{children:"fn"})}),"\n",(0,s.jsx)(n.p,{children:"The event handler to call."}),"\n",(0,s.jsx)(n.p,{children:"Example:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-jsx",children:"function Component() {\n  const flecks = useFlecks();\n  const [isConnected, setIsConnected] = useState(false);\n  useEvent(flecks.socket, 'connect', () => {\n    setIsConnected(true);\n  });\n  useEvent(flecks.socket, 'disconnect', () => {\n    setIsConnected(false);\n  });\n  return <p>Socket is {isConnected ? 'connected' : 'disconnected'}.</p>;\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"usepreviousvalue",children:(0,s.jsx)(n.code,{children:"usePrevious(value)"})}),"\n",(0,s.jsx)(n.h4,{id:"value",children:(0,s.jsx)(n.code,{children:"value"})}),"\n",(0,s.jsx)(n.p,{children:"The value whose previous value we're interested in."}),"\n",(0,s.jsxs)(n.p,{children:["See: ",(0,s.jsx)(n.a,{href:"https://blog.logrocket.com/accessing-previous-props-state-react-hooks/",children:"https://blog.logrocket.com/accessing-previous-props-state-react-hooks/"})]})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},3200:(e,n,t)=>{t.d(n,{Z:()=>l});var s=t(9286),r=t(4866),o=t(5162),a=t(5893);function l(e){let{pkg:n,type:t}=e;return(0,a.jsxs)(r.Z,{children:[(0,a.jsx)(o.Z,{value:"npm",label:"npm",children:(0,a.jsxs)(s.Z,{language:"bash",children:["npm init @flecks/",t," ",n]})}),(0,a.jsx)(o.Z,{value:"yarn",label:"Yarn",children:(0,a.jsxs)(s.Z,{language:"bash",children:["yarn create @flecks/",t," ",n]})}),(0,a.jsx)(o.Z,{value:"bun",label:"Bun",children:(0,a.jsxs)(s.Z,{language:"bash",children:["bun create @flecks/",t," ",n]})})]})}},5162:(e,n,t)=>{t.d(n,{Z:()=>a});t(7294);var s=t(512);const r={tabItem:"tabItem_Ymn6"};var o=t(5893);function a(e){let{children:n,hidden:t,className:a}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,s.Z)(r.tabItem,a),hidden:t,children:n})}},4866:(e,n,t)=>{t.d(n,{Z:()=>y});var s=t(7294),r=t(512),o=t(2466),a=t(6550),l=t(469),c=t(1980),i=t(7392),d=t(12);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:r}}=e;return{value:n,label:t,attributes:s,default:r}}))}(t);return function(e){const n=(0,i.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function p(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:t}=e;const r=(0,a.k6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,c._X)(o),(0,s.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(r.location.search);n.set(o,e),r.replace({...r.location,search:n.toString()})}),[o,r])]}function m(e){const{defaultValue:n,queryString:t=!1,groupId:r}=e,o=h(e),[a,c]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:o}))),[i,u]=f({queryString:t,groupId:r}),[m,v]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[r,o]=(0,d.Nk)(t);return[r,(0,s.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:r}),x=(()=>{const e=i??m;return p({value:e,tabValues:o})?e:null})();(0,l.Z)((()=>{x&&c(x)}),[x]);return{selectedValue:a,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),v(e)}),[u,v,o]),tabValues:o}}var v=t(2389);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=t(5893);function b(e){let{className:n,block:t,selectedValue:s,selectValue:a,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:i}=(0,o.o5)(),d=e=>{const n=e.currentTarget,t=c.indexOf(n),r=l[t].value;r!==s&&(i(n),a(r))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=c.indexOf(e.currentTarget)+1;n=c[t]??c[0];break}case"ArrowLeft":{const t=c.indexOf(e.currentTarget)-1;n=c[t]??c[c.length-1];break}}n?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":t},n),children:l.map((e=>{let{value:n,label:t,attributes:o}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>c.push(e),onKeyDown:u,onClick:d,...o,className:(0,r.Z)("tabs__item",x.tabItem,o?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function g(e){let{lazy:n,children:t,selectedValue:r}=e;const o=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:o.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function k(e){const n=m(e);return(0,j.jsxs)("div",{className:(0,r.Z)("tabs-container",x.tabList),children:[(0,j.jsx)(b,{...e,...n}),(0,j.jsx)(g,{...e,...n})]})}function y(e){const n=(0,v.Z)();return(0,j.jsx)(k,{...e,children:u(e.children)},String(n))}}}]);