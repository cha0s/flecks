"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[396],{7489:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>u,contentTitle:()=>s,default:()=>d,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var l=n(5893),t=n(1151);n(3200),n(4283),n(385),n(6569);const r={title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",slug:"reimplementing-flecks-react",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png"}],tags:["flecks","education"],hide_table_of_contents:!1,image:"https://cha0s.github.io/flecks/flecks.png"},s=void 0,i={permalink:"/flecks/blog/reimplementing-flecks-react",source:"@site/blog/2024-02-03/reimplementing-flecks-react/index.mdx",title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",date:"2024-02-03T00:00:00.000Z",formattedDate:"February 3, 2024",tags:[{label:"flecks",permalink:"/flecks/blog/tags/flecks"},{label:"education",permalink:"/flecks/blog/tags/education"}],readingTime:6.9,hasTruncateMarker:!0,authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],frontMatter:{title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",slug:"reimplementing-flecks-react",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],tags:["flecks","education"],hide_table_of_contents:!1,image:"https://cha0s.github.io/flecks/flecks.png"},unlisted:!1,nextItem:{title:"flecks: NOT a fullstack framework",permalink:"/flecks/blog/introducing-flecks"}},u={authorsImageUrls:[void 0]},c=[];function o(e){const a={code:"code",p:"p",...(0,t.a)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(a.p,{children:"flecks provides some default flecks to help with common tasks such as spinning up a web server,\ndatabases, and a react runtime with babel plugins, among many other things."}),"\n",(0,l.jsxs)(a.p,{children:["In this article, we will be reimplementing a small subset of ",(0,l.jsx)(a.code,{children:"@flecks/react"})," in our own isolated\napplication so we can learn how to build with flecks."]})]})}function d(e={}){const{wrapper:a}={...(0,t.a)(),...e.components};return a?(0,l.jsx)(a,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}},3200:(e,a,n)=>{n.d(a,{Z:()=>i});var l=n(9286),t=n(4866),r=n(5162),s=n(5893);function i(e){let{children:a,headless:n=!1,pkg:i,type:u}=e;return(0,s.jsxs)(t.Z,{className:n&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(r.Z,{value:"npm",label:"npm",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["npm init @flecks/",u," ",i]})]}),(0,s.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["yarn create @flecks/",u," ",i]})]}),(0,s.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["pnpm create @flecks/",u," ",i]})]}),(0,s.jsxs)(r.Z,{value:"bun",label:"Bun",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["bun create @flecks/",u," ",i]})]})]})}},4283:(e,a,n)=>{n.d(a,{Z:()=>i});var l=n(9286),t=n(4866),r=n(5162),s=n(5893);function i(e){let{children:a,cmd:n,headless:i=!1}=e;const u=Array.isArray(n)?n:[n],c=e=>u.map((a=>`${e} ${a}`)).join("\n");return(0,s.jsxs)(t.Z,{className:i&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(r.Z,{value:"npm",label:"npm",children:[a,(0,s.jsx)(l.Z,{language:"bash",children:c("npx")})]}),(0,s.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[a,(0,s.jsx)(l.Z,{language:"bash",children:c("yarn")})]}),(0,s.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[a,(0,s.jsx)(l.Z,{language:"bash",children:c("pnpx")})]}),(0,s.jsxs)(r.Z,{value:"bun",label:"Bun",children:[a,(0,s.jsx)(l.Z,{language:"bash",children:c("bunx")})]})]})}},385:(e,a,n)=>{n.d(a,{Z:()=>i});var l=n(9286),t=n(4866),r=n(5162),s=n(5893);function i(e){let{children:a,headless:n,pkg:i}=e;return(0,s.jsxs)(t.Z,{className:n&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(r.Z,{value:"npm",label:"npm",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["npm install ",i]})]}),(0,s.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["yarn add ",i]})]}),(0,s.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["pnpm add ",i]})]}),(0,s.jsxs)(r.Z,{value:"bun",label:"Bun",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["bun add ",i]})]})]})}},6569:(e,a,n)=>{n.d(a,{Z:()=>i});var l=n(9286),t=n(4866),r=n(5162),s=n(5893);function i(e){let{children:a,cmd:n,headless:i=!1}=e;return(0,s.jsxs)(t.Z,{className:i&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(r.Z,{value:"npm",label:"npm",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["npm run ",n]})]}),(0,s.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["yarn run ",n]})]}),(0,s.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["pnpm run ",n]})]}),(0,s.jsxs)(r.Z,{value:"bun",label:"Bun",children:[a,(0,s.jsxs)(l.Z,{language:"bash",children:["bun run ",n]})]})]})}},5162:(e,a,n)=>{n.d(a,{Z:()=>s});n(7294);var l=n(512);const t={tabItem:"tabItem_Ymn6"};var r=n(5893);function s(e){let{children:a,hidden:n,className:s}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,l.Z)(t.tabItem,s),hidden:n,children:a})}},4866:(e,a,n)=>{n.d(a,{Z:()=>Z});var l=n(7294),t=n(512),r=n(2466),s=n(6550),i=n(469),u=n(1980),c=n(7392),o=n(12);function d(e){return l.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,l.isValidElement)(e)&&function(e){const{props:a}=e;return!!a&&"object"==typeof a&&"value"in a}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:a,children:n}=e;return(0,l.useMemo)((()=>{const e=a??function(e){return d(e).map((e=>{let{props:{value:a,label:n,attributes:l,default:t}}=e;return{value:a,label:n,attributes:l,default:t}}))}(n);return function(e){const a=(0,c.l)(e,((e,a)=>e.value===a.value));if(a.length>0)throw new Error(`Docusaurus error: Duplicate values "${a.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[a,n])}function p(e){let{value:a,tabValues:n}=e;return n.some((e=>e.value===a))}function m(e){let{queryString:a=!1,groupId:n}=e;const t=(0,s.k6)(),r=function(e){let{queryString:a=!1,groupId:n}=e;if("string"==typeof a)return a;if(!1===a)return null;if(!0===a&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:a,groupId:n});return[(0,u._X)(r),(0,l.useCallback)((e=>{if(!r)return;const a=new URLSearchParams(t.location.search);a.set(r,e),t.replace({...t.location,search:a.toString()})}),[r,t])]}function b(e){const{defaultValue:a,queryString:n=!1,groupId:t}=e,r=h(e),[s,u]=(0,l.useState)((()=>function(e){let{defaultValue:a,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(a){if(!p({value:a,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${a}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return a}const l=n.find((e=>e.default))??n[0];if(!l)throw new Error("Unexpected error: 0 tabValues");return l.value}({defaultValue:a,tabValues:r}))),[c,d]=m({queryString:n,groupId:t}),[b,g]=function(e){let{groupId:a}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(a),[t,r]=(0,o.Nk)(n);return[t,(0,l.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:t}),f=(()=>{const e=c??b;return p({value:e,tabValues:r})?e:null})();(0,i.Z)((()=>{f&&u(f)}),[f]);return{selectedValue:s,selectValue:(0,l.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);u(e),d(e),g(e)}),[d,g,r]),tabValues:r}}var g=n(2389);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=n(5893);function v(e){let{className:a,block:n,selectedValue:l,selectValue:s,tabValues:i}=e;const u=[],{blockElementScrollPositionUntilNextRender:c}=(0,r.o5)(),o=e=>{const a=e.currentTarget,n=u.indexOf(a),t=i[n].value;t!==l&&(c(a),s(t))},d=e=>{let a=null;switch(e.key){case"Enter":o(e);break;case"ArrowRight":{const n=u.indexOf(e.currentTarget)+1;a=u[n]??u[0];break}case"ArrowLeft":{const n=u.indexOf(e.currentTarget)-1;a=u[n]??u[u.length-1];break}}a?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.Z)("tabs",{"tabs--block":n},a),children:i.map((e=>{let{value:a,label:n,attributes:r}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:l===a?0:-1,"aria-selected":l===a,ref:e=>u.push(e),onKeyDown:d,onClick:o,...r,className:(0,t.Z)("tabs__item",f.tabItem,r?.className,{"tabs__item--active":l===a}),children:n??a},a)}))})}function x(e){let{lazy:a,children:n,selectedValue:t}=e;const r=(Array.isArray(n)?n:[n]).filter(Boolean);if(a){const e=r.find((e=>e.props.value===t));return e?(0,l.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:r.map(((e,a)=>(0,l.cloneElement)(e,{key:a,hidden:e.props.value!==t})))})}function j(e){const a=b(e);return(0,k.jsxs)("div",{className:(0,t.Z)("tabs-container",f.tabList),children:[(0,k.jsx)(v,{...e,...a}),(0,k.jsx)(x,{...e,...a})]})}function Z(e){const a=(0,g.Z)();return(0,k.jsx)(j,{...e,children:d(e.children)},String(a))}}}]);