"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[9686],{5898:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>d,toc:()=>h});var s=n(5893),r=n(1151),a=n(3200),c=n(4283),l=(n(385),n(6569));const o={title:"Redux",description:"Define your actions, reducers, and state."},i=void 0,d={id:"redux",title:"Redux",description:"Define your actions, reducers, and state.",source:"@site/docs/redux.mdx",sourceDirName:".",slug:"/redux",permalink:"/flecks/docs/redux",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Redux",description:"Define your actions, reducers, and state."},sidebar:"flecksSidebar",previous:{title:"Electron",permalink:"/flecks/docs/electron"},next:{title:"REPL",permalink:"/flecks/docs/repl"}},u={},h=[{value:"Create an app",id:"create-an-app",level:2},{value:"Create a fleck",id:"create-a-fleck",level:2},{value:"Create a duck",id:"create-a-duck",level:2},{value:"Export your state",id:"export-your-state",level:3},{value:"Set up a contrived web example",id:"set-up-a-contrived-web-example",level:2},{value:"Check out the redux devtools",id:"check-out-the-redux-devtools",level:3},{value:"Redux in React in flecks",id:"redux-in-react-in-flecks",level:2}];function p(e){const t={admonition:"admonition",code:"code",h2:"h2",h3:"h3",img:"img",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Working with redux in flecks is easy. Let's create a small application to inspect and\nfamiliarize ourselves."}),"\n",(0,s.jsx)(t.h2,{id:"create-an-app",children:"Create an app"}),"\n",(0,s.jsx)(a.Z,{type:"app",pkg:"redux-test"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:"cd redux-test\n"})}),"\n",(0,s.jsx)(t.h2,{id:"create-a-fleck",children:"Create a fleck"}),"\n",(0,s.jsx)(a.Z,{headless:!0,type:"fleck",pkg:"packages/ducks"}),"\n",(0,s.jsxs)(t.p,{children:["We'll add the ",(0,s.jsx)(t.code,{children:"redux"})," fleck to our new fleck:"]}),"\n",(0,s.jsx)(c.Z,{headless:!0,cmd:"flecks add @flecks/redux",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:"cd packages/ducks\n"})})}),"\n",(0,s.jsx)(t.h2,{id:"create-a-duck",children:"Create a duck"}),"\n",(0,s.jsxs)(t.p,{children:["Alright, let's create a duck at ",(0,s.jsx)(t.code,{children:"packages/ducks/src/state/thing.js"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",metastring:'title="packages/ducks/src/state/thing.js"',children:"import {\n  createSelector,\n  createSlice,\n} from '@flecks/redux';\n\nexport const thingSelector = ({thing}) => thing;\n\nexport const leftSelector = createSelector([thingSelector], ({left}) => left);\n\nexport const rightSelector = createSelector([thingSelector], ({right}) => right);\n\nexport const totalSelector = createSelector(\n  [leftSelector, rightSelector],\n  (left, right) => left + right,\n);\n\nexport const initialState = () => ({\n  left: 0,\n  right: 0,\n});\n\nconst reducers = {\n  addToLeft: (state, {payload}) => {\n    state.left += payload;\n  },\n  addToRight: (state, {payload}) => {\n    state.right += payload;\n  },\n};\n\nconst slice = createSlice({\n  name: 'thing',\n  initialState: initialState(),\n  reducers,\n});\n\nexport const {\n  addToLeft,\n  addToRight,\n} = slice.actions;\n\nexport default slice.reducer;\n"})}),"\n",(0,s.jsx)(t.h3,{id:"export-your-state",children:"Export your state"}),"\n",(0,s.jsxs)(t.p,{children:["Let's create an exporter at ",(0,s.jsx)(t.code,{children:"packages/ducks/src/state/index.js"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",metastring:'title="packages/ducks/src/state/index.js"',children:"export * from './thing';\nexport {default as thing} from './thing';\n"})}),"\n",(0,s.jsx)(t.p,{children:"Not strictly necessary, but you might find it convenient to access your actions and selectors!"}),"\n",(0,s.jsx)(t.h2,{id:"set-up-a-contrived-web-example",children:"Set up a contrived web example"}),"\n",(0,s.jsxs)(t.p,{children:["Finally, we'll edit ",(0,s.jsx)(t.code,{children:"packages/ducks/src/index.js"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",metastring:'title="packages/ducks/src/index.js"',children:"import {Flecks} from '@flecks/core';\n\nimport {addToLeft, addToRight, thing} from './state';\n\nexport * from './state';\n\nexport const hooks = {\n  '@flecks/web/client.up': Flecks.priority(\n    async (flecks) => {\n      flecks.redux.dispatch(addToLeft(5));\n      flecks.redux.dispatch(addToRight(2));\n    },\n    {after: '@flecks/redux/client'},\n  ),\n  '@flecks/redux.slices': () => ({thing}),\n};\n"})}),"\n",(0,s.jsx)(t.admonition,{title:"Have a slice",type:"note",children:(0,s.jsxs)(t.p,{children:["We're using ",(0,s.jsx)(t.code,{children:"@flecks/web/client.up"})," just as a little test."]})}),"\n",(0,s.jsxs)(t.p,{children:["As a little test, we'll add ",(0,s.jsx)(t.code,{children:"@flecks/web"})," and ",(0,s.jsx)(t.code,{children:"@flecks/electron"})," so we can check out the Redux\ndevtools."]}),"\n",(0,s.jsx)(t.p,{children:"From the project root:"}),"\n",(0,s.jsx)(c.Z,{cmd:["flecks add @flecks/web","flecks add -d @flecks/electron"]}),"\n",(0,s.jsx)(t.admonition,{title:"Attention",type:"warning",children:(0,s.jsxs)(t.p,{children:["Those commands should be run ",(0,s.jsx)(t.strong,{children:"in the application root directory"}),"! Your fleck doesn't care about\ndealing with a web server or an electron app."]})}),"\n",(0,s.jsx)(t.h3,{id:"check-out-the-redux-devtools",children:"Check out the redux devtools"}),"\n",(0,s.jsx)(t.p,{children:"Now start up your application:"}),"\n",(0,s.jsx)(l.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsxs)(t.p,{children:["After a moment, Electron will appear. Press ",(0,s.jsx)(t.code,{children:"ctrl+i"})," to open devtools in Electron."]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"A screenshot showing our app running in Electron with devtools open",src:n(1146).Z+"",width:"820",height:"655"})}),"\n",(0,s.jsx)(t.p,{children:"Open up the Redux devtools:"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"A screenshot showing our app running in Electron with devtools open now hovering over the Redux devtools tab",src:n(6468).Z+"",width:"820",height:"655"})}),"\n",(0,s.jsx)(t.p,{children:"Everything is there!"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"A screenshot showing our app running in Electron with devtools open to the Redux devtools tab with our state visible",src:n(8225).Z+"",width:"820",height:"655"})}),"\n",(0,s.jsx)(t.h2,{id:"redux-in-react-in-flecks",children:"Redux in React in flecks"}),"\n",(0,s.jsxs)(t.p,{children:["How about Redux in React? No problem! Move to ",(0,s.jsx)(t.code,{children:"packages/ducks"})," and run the following command:"]}),"\n",(0,s.jsx)(c.Z,{headless:!0,cmd:"flecks add @flecks/react-redux"}),"\n",(0,s.jsx)(t.admonition,{title:"Attention",type:"warning",children:(0,s.jsxs)(t.p,{children:["That command should be run ",(0,s.jsxs)(t.strong,{children:["in ",(0,s.jsx)(t.code,{children:"packages/ducks"})]}),"! This way, the fleck encapsulates all of its\ndependencies. Your fleck is its own package. If you do things right, you can even publish your\nfleck for others to use!"]})}),"\n",(0,s.jsxs)(t.p,{children:["Let's create a component at ",(0,s.jsx)(t.code,{children:"packages/ducks/src/thing.jsx"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="packages/ducks/src/thing.jsx"',children:"import {React} from '@flecks/react';\nimport {useDispatch, useSelector} from '@flecks/react-redux';\n\nimport {\n  addToLeft,\n  addToRight,\n  leftSelector,\n  rightSelector,\n  totalSelector,\n} from './state';\n\nfunction Thing() {\n  const dispatch = useDispatch();\n  const left = useSelector(leftSelector);\n  const right = useSelector(rightSelector);\n  const total = useSelector(totalSelector);\n  return (\n    <div style={{display: 'flex', justifyContent: 'space-between'}}>\n      <button onClick={() => dispatch(addToLeft(1))}>Add 1 to Left</button>\n      <button onClick={() => dispatch(addToLeft(5))}>Add 5 to Left</button>\n      <span>Left: {left}</span>\n      <span>Total: {total}</span>\n      <span>Right: {right}</span>\n      <button onClick={() => dispatch(addToRight(1))}>Add 1 to Right</button>\n      <button onClick={() => dispatch(addToRight(5))}>Add 5 to Right</button>\n    </div>\n  )\n}\n\nexport default Thing;\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Now update ",(0,s.jsx)(t.code,{children:"packages/ducks/src/index.js"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",metastring:'title="packages/ducks/src/index.js"',children:"import {thing} from './state';\nimport Thing from './thing';\n\nexport const hooks = {\n  '@flecks/react.roots': () => Thing,\n  '@flecks/redux.slices': () => ({thing}),\n};\n"})}),"\n",(0,s.jsx)(t.p,{children:"Restart your application. It works!"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"A screenshot showing our app running in Electron after a few button presses",src:n(3007).Z+"",width:"820",height:"655"})})]})}function f(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},3200:(e,t,n)=>{n.d(t,{Z:()=>l});var s=n(9286),r=n(4866),a=n(5162),c=n(5893);function l(e){let{children:t,headless:n=!0,pkg:l,type:o}=e;return(0,c.jsx)(r.Z,{className:n&&"headless",groupId:"package-manager",children:(0,c.jsxs)(a.Z,{value:"npm",label:"npm",children:[t,(0,c.jsx)(s.Z,{language:"bash",children:"fleck"===o?`npm init @flecks/${o} -w ${l}`:`npm init @flecks/${o} ${l}`})]})})}},4283:(e,t,n)=>{n.d(t,{Z:()=>l});var s=n(9286),r=n(4866),a=n(5162),c=n(5893);function l(e){let{children:t,cmd:n,headless:l=!0}=e;const o=Array.isArray(n)?n:[n];return(0,c.jsx)(r.Z,{className:l&&"headless",groupId:"package-manager",children:(0,c.jsxs)(a.Z,{value:"npm",label:"npm",children:[t,(0,c.jsx)(s.Z,{language:"bash",children:(i="npx",o.map((e=>`${i} ${e}`)).join("\n"))})]})});var i}},385:(e,t,n)=>{n.d(t,{Z:()=>l});var s=n(9286),r=n(4866),a=n(5162),c=n(5893);function l(e){let{children:t,headless:n=!0,pkg:l}=e;return(0,c.jsx)(r.Z,{className:n&&"headless",groupId:"package-manager",children:(0,c.jsxs)(a.Z,{value:"npm",label:"npm",children:[t,(0,c.jsxs)(s.Z,{language:"bash",children:["npm install ",l]})]})})}},6569:(e,t,n)=>{n.d(t,{Z:()=>l});var s=n(9286),r=n(4866),a=n(5162),c=n(5893);function l(e){let{children:t,cmd:n,headless:l=!0}=e;return(0,c.jsx)(r.Z,{className:l&&"headless",groupId:"package-manager",children:(0,c.jsxs)(a.Z,{value:"npm",label:"npm",children:[t,(0,c.jsxs)(s.Z,{language:"bash",children:["npm run ",n]})]})})}},5162:(e,t,n)=>{n.d(t,{Z:()=>c});n(7294);var s=n(512);const r={tabItem:"tabItem_Ymn6"};var a=n(5893);function c(e){let{children:t,hidden:n,className:c}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,s.Z)(r.tabItem,c),hidden:n,children:t})}},4866:(e,t,n)=>{n.d(t,{Z:()=>w});var s=n(7294),r=n(512),a=n(2466),c=n(6550),l=n(469),o=n(1980),i=n(7392),d=n(12);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:r}}=e;return{value:t,label:n,attributes:s,default:r}}))}(n);return function(e){const t=(0,i.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:n}=e;const r=(0,c.k6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,o._X)(a),(0,s.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(r.location.search);t.set(a,e),r.replace({...r.location,search:t.toString()})}),[a,r])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,a=h(e),[c,o]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:a}))),[i,u]=f({queryString:n,groupId:r}),[x,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,a]=(0,d.Nk)(n);return[r,(0,s.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:r}),m=(()=>{const e=i??x;return p({value:e,tabValues:a})?e:null})();(0,l.Z)((()=>{m&&o(m)}),[m]);return{selectedValue:c,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),g(e)}),[u,g,a]),tabValues:a}}var g=n(2389);const m={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=n(5893);function j(e){let{className:t,block:n,selectedValue:s,selectValue:c,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:i}=(0,a.o5)(),d=e=>{const t=e.currentTarget,n=o.indexOf(t),r=l[n].value;r!==s&&(i(t),c(r))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=o.indexOf(e.currentTarget)+1;t=o[n]??o[0];break}case"ArrowLeft":{const n=o.indexOf(e.currentTarget)-1;t=o[n]??o[o.length-1];break}}t?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:a}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>o.push(e),onKeyDown:u,onClick:d,...a,className:(0,r.Z)("tabs__item",m.tabItem,a?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function b(e){let{lazy:t,children:n,selectedValue:r}=e;const a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:a.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function v(e){const t=x(e);return(0,k.jsxs)("div",{className:(0,r.Z)("tabs-container",m.tabList),children:[(0,k.jsx)(j,{...e,...t}),(0,k.jsx)(b,{...e,...t})]})}function w(e){const t=(0,g.Z)();return(0,k.jsx)(v,{...e,children:u(e.children)},String(t))}},1146:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/redux-test-1-a1382cd66041ed2c79ea9e4563623966.png"},6468:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/redux-test-2-f812b5e7f7217c1c0b5c7c8120bf8eb6.png"},8225:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/redux-test-3-cdcd86e43e2393a2b7c6f825c6d848c1.png"},3007:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/redux-test-4-c0a11ccdf63c7320a62ab9411386db28.png"}}]);