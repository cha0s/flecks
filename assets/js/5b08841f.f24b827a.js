"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[396],{7489:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>u});var n=a(5893),r=a(1151);a(3200),a(4283),a(385),a(6569);const l={title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",slug:"reimplementing-flecks-react",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png"}],tags:["flecks","education"],hide_table_of_contents:!1,image:"https://cha0s.github.io/flecks/flecks.png"},s=void 0,i={permalink:"/flecks/blog/reimplementing-flecks-react",source:"@site/blog/2024-02-03/reimplementing-flecks-react/index.mdx",title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",date:"2024-02-03T00:00:00.000Z",formattedDate:"February 3, 2024",tags:[{label:"flecks",permalink:"/flecks/blog/tags/flecks"},{label:"education",permalink:"/flecks/blog/tags/education"}],readingTime:6.905,hasTruncateMarker:!0,authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],frontMatter:{title:"Reimplementing `@flecks/react` by hand",description:"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works",slug:"reimplementing-flecks-react",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],tags:["flecks","education"],hide_table_of_contents:!1,image:"https://cha0s.github.io/flecks/flecks.png"},unlisted:!1,nextItem:{title:"flecks: NOT a fullstack framework",permalink:"/flecks/blog/introducing-flecks"}},c={authorsImageUrls:[void 0]},u=[];function o(e){const t={code:"code",p:"p",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"flecks provides some default flecks to help with common tasks such as spinning up a web server,\ndatabases, and a react runtime with babel plugins, among many other things."}),"\n",(0,n.jsxs)(t.p,{children:["In this article, we will be reimplementing a small subset of ",(0,n.jsx)(t.code,{children:"@flecks/react"})," in our own isolated\napplication so we can learn how to build with flecks."]})]})}function d(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(o,{...e})}):o(e)}},3200:(e,t,a)=>{a.d(t,{Z:()=>i});var n=a(9286),r=a(4866),l=a(5162),s=a(5893);function i(e){let{children:t,headless:a=!0,pkg:i,type:c}=e;return(0,s.jsx)(r.Z,{className:a&&"headless",groupId:"package-manager",children:(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[t,(0,s.jsx)(n.Z,{language:"bash",children:"fleck"===c?`npm init @flecks/${c} -w ${i}`:`npm init @flecks/${c} ${i}`})]})})}},4283:(e,t,a)=>{a.d(t,{Z:()=>i});var n=a(9286),r=a(4866),l=a(5162),s=a(5893);function i(e){let{children:t,cmd:a,headless:i=!0}=e;const c=Array.isArray(a)?a:[a];return(0,s.jsx)(r.Z,{className:i&&"headless",groupId:"package-manager",children:(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[t,(0,s.jsx)(n.Z,{language:"bash",children:(u="npx",c.map((e=>`${u} ${e}`)).join("\n"))})]})});var u}},385:(e,t,a)=>{a.d(t,{Z:()=>i});var n=a(9286),r=a(4866),l=a(5162),s=a(5893);function i(e){let{children:t,headless:a=!0,pkg:i}=e;return(0,s.jsx)(r.Z,{className:a&&"headless",groupId:"package-manager",children:(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[t,(0,s.jsxs)(n.Z,{language:"bash",children:["npm install ",i]})]})})}},6569:(e,t,a)=>{a.d(t,{Z:()=>i});var n=a(9286),r=a(4866),l=a(5162),s=a(5893);function i(e){let{children:t,cmd:a,headless:i=!0}=e;return(0,s.jsx)(r.Z,{className:i&&"headless",groupId:"package-manager",children:(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[t,(0,s.jsxs)(n.Z,{language:"bash",children:["npm run ",a]})]})})}},5162:(e,t,a)=>{a.d(t,{Z:()=>s});a(7294);var n=a(512);const r={tabItem:"tabItem_Ymn6"};var l=a(5893);function s(e){let{children:t,hidden:a,className:s}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,n.Z)(r.tabItem,s),hidden:a,children:t})}},4866:(e,t,a)=>{a.d(t,{Z:()=>y});var n=a(7294),r=a(512),l=a(2466),s=a(6550),i=a(469),c=a(1980),u=a(7392),o=a(12);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}(a);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function m(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:a}=e;const r=(0,s.k6)(),l=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,c._X)(l),(0,n.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(r.location.search);t.set(l,e),r.replace({...r.location,search:t.toString()})}),[l,r])]}function f(e){const{defaultValue:t,queryString:a=!1,groupId:r}=e,l=h(e),[s,c]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:l}))),[u,d]=p({queryString:a,groupId:r}),[f,g]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,l]=(0,o.Nk)(a);return[r,(0,n.useCallback)((e=>{a&&l.set(e)}),[a,l])]}({groupId:r}),b=(()=>{const e=u??f;return m({value:e,tabValues:l})?e:null})();(0,i.Z)((()=>{b&&c(b)}),[b]);return{selectedValue:s,selectValue:(0,n.useCallback)((e=>{if(!m({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);c(e),d(e),g(e)}),[d,g,l]),tabValues:l}}var g=a(2389);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=a(5893);function v(e){let{className:t,block:a,selectedValue:n,selectValue:s,tabValues:i}=e;const c=[],{blockElementScrollPositionUntilNextRender:u}=(0,l.o5)(),o=e=>{const t=e.currentTarget,a=c.indexOf(t),r=i[a].value;r!==n&&(u(t),s(r))},d=e=>{let t=null;switch(e.key){case"Enter":o(e);break;case"ArrowRight":{const a=c.indexOf(e.currentTarget)+1;t=c[a]??c[0];break}case"ArrowLeft":{const a=c.indexOf(e.currentTarget)-1;t=c[a]??c[c.length-1];break}}t?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":a},t),children:i.map((e=>{let{value:t,label:a,attributes:l}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:n===t?0:-1,"aria-selected":n===t,ref:e=>c.push(e),onKeyDown:d,onClick:o,...l,className:(0,r.Z)("tabs__item",b.tabItem,l?.className,{"tabs__item--active":n===t}),children:a??t},t)}))})}function w(e){let{lazy:t,children:a,selectedValue:r}=e;const l=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:l.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function x(e){const t=f(e);return(0,k.jsxs)("div",{className:(0,r.Z)("tabs-container",b.tabList),children:[(0,k.jsx)(v,{...e,...t}),(0,k.jsx)(w,{...e,...t})]})}function y(e){const t=(0,g.Z)();return(0,k.jsx)(x,{...e,children:d(e.children)},String(t))}}}]);