"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[1156],{8012:(e,t,n)=>{n.r(t),n.d(t,{Tiny:()=>d,assets:()=>c,contentTitle:()=>r,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>h});var s=n(5893),i=n(1151),o=n(9960);const a={title:"flecks: NOT a fullstack framework",description:"Introducing flecks: an exceptionally-extensible application production system.",slug:"introducing-flecks",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png"}],tags:["announcement","introducing","flecks","release"],hide_table_of_contents:!1},r=void 0,l={permalink:"/flecks/blog/introducing-flecks",source:"@site/blog/2024-01-30/introducing-flecks.mdx",title:"flecks: NOT a fullstack framework",description:"Introducing flecks: an exceptionally-extensible application production system.",date:"2024-01-30T00:00:00.000Z",formattedDate:"January 30, 2024",tags:[{label:"announcement",permalink:"/flecks/blog/tags/announcement"},{label:"introducing",permalink:"/flecks/blog/tags/introducing"},{label:"flecks",permalink:"/flecks/blog/tags/flecks"},{label:"release",permalink:"/flecks/blog/tags/release"}],readingTime:7.625,hasTruncateMarker:!0,authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],frontMatter:{title:"flecks: NOT a fullstack framework",description:"Introducing flecks: an exceptionally-extensible application production system.",slug:"introducing-flecks",authors:[{name:"cha0s",title:"Creator of flecks",url:"https://github.com/cha0s",image_url:"https://github.com/cha0s.png",imageURL:"https://github.com/cha0s.png"}],tags:["announcement","introducing","flecks","release"],hide_table_of_contents:!1},unlisted:!1},c={authorsImageUrls:[void 0]},h=[{value:"First off, \ud83d\ude4f",id:"first-off-pray",level:2},{value:"Is it <del>webscale</del> fullstack?",id:"is-it-webscale-fullstack",level:2},{value:"For real, though",id:"for-real-though",level:3},{value:"Don&#39;t get it twisted",id:"dont-get-it-twisted",level:3},{value:"Do one thing and do it well",id:"do-one-thing-and-do-it-well",level:2},{value:"Small core",id:"small-core",level:3},{value:"So where&#39;s asset optimization, data fetching, filetree routing, RSC...?",id:"so-wheres-asset-optimization-data-fetching-filetree-routing-rsc",level:3},{value:"<ins>Better <em>no</em> abstraction than the <em>wrong</em> abstraction</ins>",id:"better-no-abstraction-than-the-wrong-abstraction",level:3},{value:"The flecks way",id:"the-flecks-way",level:3},{value:"Why though?",id:"why-though",level:2},{value:"Separation of concerns",id:"separation-of-concerns",level:3},{value:"Joy",id:"joy",level:3},{value:"Because I can",id:"because-i-can",level:3},{value:"Thanks again",id:"thanks-again",level:2}];function d({children:e}){const t={span:"span",...(0,i.a)()};return(0,s.jsx)(t.span,{style:{fontSize:"0.75em"},children:e})}function u(e){const t={a:"a",admonition:"admonition",code:"code",del:"del",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["Introducing flecks: an ",(0,s.jsx)(t.strong,{children:"exceptionally-extensible application production system"}),"."]}),"\n","\n",(0,s.jsxs)(t.h2,{id:"first-off-pray",children:["First off, ","\ud83d\ude4f"]}),"\n",(0,s.jsxs)(t.p,{children:["I appreciate you checking out the project! I truly hope that you will find working with flecks\nto be a joy. Feedback is welcome over on the\n",(0,s.jsx)(t.a,{href:"https://github.com/cha0s/flecks/discussions",children:"Github discussions page"}),"!"]}),"\n",(0,s.jsx)(t.admonition,{title:'What\'s the letter before "alpha"?',type:"warning",children:(0,s.jsxs)(t.p,{children:["This is a new release and worked on by only one person: ",(0,s.jsx)(t.a,{href:"https://github.com/cha0s",children:"me"}),"! Please\nkeep this in mind!"]})}),"\n",(0,s.jsxs)(t.h2,{id:"is-it-webscale-fullstack",children:["Is it ",(0,s.jsx)(t.del,{children:"webscale"})," fullstack?"]}),"\n",(0,s.jsx)("figure",{children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"A screenshot from the 2010 &quot;MongoDB is webscale&quot; cartoon",src:n(1119).Z+"",width:"480",height:"360"}),"\n",(0,s.jsx)("figcaption",{style:{fontSize:"0.8rem"},children:(0,s.jsx)(t.em,{children:"yes, I remember"})})]})}),"\n",(0,s.jsxs)(t.p,{children:["I admit, I clickbaited with the title there just a little bit. I love fullstack! flecks is more\nthan capable of building fullstack applications. If you just want to jump to more of that sort\nof thing, you might be interested in the ",(0,s.jsx)(o.Z,{target:"_blank",to:"https://cha0s.github.io/flecks/docs/react",children:"React"}),"\npage in the documentation."]}),"\n",(0,s.jsx)(t.h3,{id:"for-real-though",children:"For real, though"}),"\n",(0,s.jsxs)(t.p,{children:["A fullstack JS application is basically appception: what you actually have is a server\napplication written in JS that serves a client application written in JS. Using\nthe same language obscures (arguably, ",(0,s.jsx)(t.em,{children:"by design"}),") the fact that these are actually two distinct\napplications."]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"A screenshot of Doctor Olivia Octopus saying &quot;There&#39;s two, actually&quot;",src:n(9517).Z+"",width:"790",height:"371"})}),"\n",(0,s.jsx)(t.admonition,{title:"Hot take",type:"danger",children:(0,s.jsxs)(t.p,{children:["Some modern framework APIs are becoming increasingly esoteric in their attempt to paper over\nthis reality\n(",(0,s.jsx)(t.a,{href:"https://github.com/cha0s/flecks/blob/master/packages/react/src/client.js#L24",children:(0,s.jsx)(t.em,{children:"*ahem*"})}),"... and\ndon't get me started on ",(0,s.jsx)(t.a,{href:"https://www.mayank.co/blog/react-server-components/",children:(0,s.jsx)(t.strong,{children:"RSC"})}),"...)."]})}),"\n",(0,s.jsx)(t.h3,{id:"dont-get-it-twisted",children:"Don't get it twisted"}),"\n",(0,s.jsxs)(t.p,{children:["To put it in basic terms: A web server is a core aspect of a fullstack application, but ",(0,s.jsx)(t.strong,{children:"a\nweb server is not a core aspect of an application"}),". The same could be said about asset\noptimization, routing, and many other core fullstack JS concepts."]}),"\n",(0,s.jsxs)(t.p,{children:["flecks is concerned with ",(0,s.jsx)(t.strong,{children:"writing applications"}),"; fullstack applications are merely a subset of\nthat."]}),"\n",(0,s.jsx)(t.h2,{id:"do-one-thing-and-do-it-well",children:"Do one thing and do it well"}),"\n",(0,s.jsxs)(t.p,{children:["The core primitive is the ",(0,s.jsx)(t.strong,{children:"fleck"})," which is... just a JS module. There exists a server\nfleck, a web fleck, a React fleck, and so on."]}),"\n",(0,s.jsx)(t.p,{children:"Here's a simple fleck that says hello when the application is starting:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"export const hooks = {\n  '@flecks/core.starting': () => {\n    console.log('hey you');\n  },\n};\n"})}),"\n",(0,s.jsxs)(t.p,{children:["That's it. It's a module that exports some hook implementations. If you're curious what kind of\nhooks we're talking about, check out\n",(0,s.jsx)(o.Z,{target:"_blank",to:"https://cha0s.github.io/flecks/docs/flecks/hooks",children:"the hooks reference page"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["You add a reference to your fleck to a file called\n",(0,s.jsx)(o.Z,{target:"_blank",to:"https://cha0s.github.io/flecks/docs/creating-a-fleck",children:(0,s.jsx)(t.code,{children:"flecks.yml"})}),"\nand you're rolling. Use the\n",(0,s.jsx)(t.a,{href:"https://cha0s.github.io/flecks/docs/creating-a-fleck",children:"built-in tooling"})," and you won't even have\nto do that by hand. Again, ",(0,s.jsx)(t.strong,{children:"a flecks application is just flecks"})," having their hook\nimplementations invoked."]}),"\n",(0,s.jsxs)(t.p,{children:["What are multiple flecks called? ",(0,s.jsx)(t.strong,{children:"flecks"}),"!"]}),"\n",(0,s.jsx)(t.admonition,{title:"Flickin' fleckers",type:"tip",children:(0,s.jsxs)(t.p,{children:["It is not a coincidence that the name of the framework uses the same word as the plural form of\nits constituting elements: the implication is that ",(0,s.jsx)(t.strong,{children:"flecks is just flecks"}),", it's not really doing\nanything special on its own. Sure, it ",(0,s.jsx)(t.em,{children:"does something"}),", but the something that it does is provide\ntools with which to orchestrate your flecks together into an application."]})}),"\n",(0,s.jsx)(t.h3,{id:"small-core",children:"Small core"}),"\n",(0,s.jsxs)(t.p,{children:["Creating an application with ",(0,s.jsx)(t.code,{children:"@flecks/create-app"})," and then doing\ne.g. ",(0,s.jsx)(t.code,{children:"yarn install --production"})," will result in a full working application with a size of\n",(0,s.jsx)(t.strong,{children:"less than 7 MB"}),". Granted, it's only a server that will start, have nothing to do, and halt in\nabout 100 ms, but it illustrates that flecks builds what you tell it to, ",(0,s.jsx)(t.strong,{children:"it is not a kitchen\nsink system"}),"."]}),"\n",(0,s.jsx)("figure",{children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"A screenshot of Fry from Futurama captioned &quot;Not sure if you&#39;re overly specific or not specific enough&quot;",src:n(2436).Z+"",width:"552",height:"414"}),"\n",(0,s.jsx)("figcaption",{style:{fontSize:"0.8rem"},children:(0,s.jsx)(t.em,{children:"When you're writing an article and curious about how the Big Kid on the Block performs in terms of raw default production application size, but can't even figure out how to measure it because you have already downloaded more than 7MB of ads for their \"hosting solution\" into your brain in the process"})})]})}),"\n",(0,s.jsx)(t.h3,{id:"so-wheres-asset-optimization-data-fetching-filetree-routing-rsc",children:"So where's asset optimization, data fetching, filetree routing, RSC...?"}),"\n",(0,s.jsx)(t.p,{children:"Well, I do admit that I don't stand before you today with a solution for every problem around\nfullstack development."}),"\n",(0,s.jsxs)(t.p,{children:["flecks is made with ",(0,s.jsx)(t.strong,{children:"cooperation and collaboration as a primary concern"}),". A fleck is ",(0,s.jsx)(t.em,{children:"just\na package"})," exactly for that reason: it should be frictionless to publish a package (or a suite)\nto the world and then add them to a project just like you would with any other package! ",(0,s.jsx)(t.strong,{children:"It should\nbe as frictionless"}),' for a developer to say "I don\'t agree with how this fleck is\nimplemented" and write their own, interacting seamlessly with everything else they actually want.']}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"I believe we can design modular solutions to these problems!"})," In order to do this, it's probably\nbetter to be standing on top of less, not more."]}),"\n",(0,s.jsx)(t.h3,{id:"better-no-abstraction-than-the-wrong-abstraction",children:(0,s.jsxs)("ins",{children:["Better ",(0,s.jsx)(t.em,{children:"no"})," abstraction than the ",(0,s.jsx)(t.em,{children:"wrong"})," abstraction"]})}),"\n",(0,s.jsxs)(t.p,{children:['I know this will come off as inflammatory but some of the more recent JS framework "paradigms" feel\nlike someone ',(0,s.jsx)(d,{children:(0,s.jsx)(d,{children:"drunk-"})}),"coded at midnight and ",(0,s.jsx)(t.em,{children:"had an epiphany"}),' about the "killer new\nthing" which means they are now going to spend the next 5 hours torturing their code only to wake\nup the next morning absolutely exhausted with a rickety codebase and a deep sense of regret as they\nrevert all the changes and pretend that it never happened.']}),"\n",(0,s.jsx)("figure",{children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"A picture of a person with their head down pouring coffee all over the place captioned &quot;I&#39;m never drinking again&quot;",src:n(1324).Z+"",width:"480",height:"325"}),"\n",(0,s.jsx)("figcaption",{style:{fontSize:"0.8rem"},children:(0,s.jsxs)(t.em,{children:[(0,s.jsx)(t.strong,{children:"obviously"})," this has never happened in ",(0,s.jsx)(t.strong,{children:"my"})," projects. ",(0,s.jsx)(d,{children:(0,s.jsx)(d,{children:"Also, I ran your credit card the whole time."})})]})})]})}),"\n",(0,s.jsx)(t.h3,{id:"the-flecks-way",children:"The flecks way"}),"\n",(0,s.jsx)(t.p,{children:"The few core architectural opinions that are held are presented as suggestions, not requirements."}),"\n",(0,s.jsxs)(t.admonition,{type:"info",children:[(0,s.jsx)(t.mdxAdmonitionTitle,{children:(0,s.jsx)(t.strong,{children:"\u201cI hold it to be the inalienable right of anybody to go to hell in his own way.\u201d"})}),(0,s.jsx)(t.p,{children:"\u2015 Robert Frost"})]}),"\n",(0,s.jsxs)(t.p,{children:["A few motivating philosophies which I ",(0,s.jsx)(t.strong,{children:"do not"})," consider to be suggestions regarding this\nproject:"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["You ",(0,s.jsx)(t.strong,{children:"shouldn't be unpleasantly surprised"})," by what happens"]}),"\n",(0,s.jsxs)(t.li,{children:["Your application has what ",(0,s.jsx)(t.strong,{children:"you"})," want in it, not what ",(0,s.jsx)(t.strong,{children:"flecks"})," wants in it"]}),"\n",(0,s.jsxs)(t.li,{children:["Developer ",(0,s.jsx)(t.strong,{children:"comfort and confidence are essential"}),", not just a nice-to-have"]}),"\n",(0,s.jsxs)(t.li,{children:["You ",(0,s.jsx)(t.strong,{children:"shouldn't have to have a full budget"})," for production deployment"]}),"\n",(0,s.jsxs)(t.li,{children:["Core architectural ",(0,s.jsx)(t.strong,{children:"opinions require transparency and justification"})]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"why-though",children:"Why though?"}),"\n",(0,s.jsx)(t.p,{children:"You might be thinking something like:"}),"\n",(0,s.jsx)("figure",{children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"A screenshot of Michael from The Office shouting &quot;NO GOD PLEASE NO&quot;",src:n(7866).Z+"",width:"720",height:"405"}),"\n",(0,s.jsxs)("figcaption",{style:{fontSize:"0.8rem"},children:[(0,s.jsx)(t.em,{children:(0,s.jsx)(t.strong,{children:"Why?!"})})," ",(0,s.jsx)(t.em,{children:"A new JavaScript framework is the last thing we need."})]})]})}),"\n",(0,s.jsxs)(t.p,{children:["Perhaps you will write a thesis explaining in great detail why there is no\nobjective reason for flecks to exist. ",(0,s.jsx)(t.strong,{children:"I'm fine with that"}),",\n",(0,s.jsx)(d,{children:"because I love it and there's nothing you can do about it."})]}),"\n",(0,s.jsx)(t.p,{children:"Seriously though, a couple reasons why I made flecks and use it to develop applications are:"}),"\n",(0,s.jsx)(t.h3,{id:"separation-of-concerns",children:"Separation of concerns"}),"\n",(0,s.jsxs)(t.p,{children:["JS has matured a lot over the years, and modules are all but a first-class concept. This has been\na huge win for Properly Structured","\u2122\ufe0f"," applications."]}),"\n",(0,s.jsxs)(t.p,{children:["However, I believe the real reason many fullstack frameworks exist today is to\n",(0,s.jsx)(t.em,{children:"centralize concerns"}),". No one wants to set up a whole database, a routing system, a webserver,\netc, ",(0,s.jsxs)(d,{children:["etc, ",(0,s.jsx)(d,{children:"etc."})]})," every time. So, the default approach has been to reach out\nfor a framework to tie it all together. To some extent this is an inevitable evolution."]}),"\n",(0,s.jsx)("figure",{children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.img,{alt:"Screenshot of Patrick Star with the caption &quot;Push them somewhere else&quot;",src:n(9943).Z+"",width:"478",height:"345"}),"\n",(0,s.jsx)("figcaption",{style:{fontSize:"0.8rem"},children:(0,s.jsxs)(t.em,{children:["You've never even ",(0,s.jsx)(t.strong,{children:"seen"})," a real ",(0,s.jsx)(o.Z,{target:"_blank",to:"https://cha0s.github.io/flecks/docs/redux",children:"duck"})]})})]})}),"\n",(0,s.jsxs)(t.p,{children:["With flecks, the first principle is to push these concerns out into modular units which do one\nthing and do it immaculately.\n",(0,s.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Unix_philosophy",children:"This is not a new concept"}),"! These units can be\ncomposed into an application that does as much or as little as you like, ",(0,s.jsxs)(d,{children:["without requiring\nyour application structure to follow some corporate diktat ",(0,s.jsxs)(d,{children:["requiring you to enter a mailing\naddress to submit a pull request. ",(0,s.jsx)(d,{children:"(don't ask...)"})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"joy",children:"Joy"}),"\n",(0,s.jsx)("div",{style:{float:"right",padding:"0 1.5rem"},children:(0,s.jsx)(t.img,{alt:"A screenshot of Marie Kondo stating &quot;This one sparks joy.&quot;",src:n(2945).Z+"",width:"242",height:"242"})}),"\n",(0,s.jsxs)(t.p,{children:["I have found this structure to work very well and to ",(0,s.jsx)(t.em,{children:"feel pleasant"}),". It's great to get up and\nrunning super quickly without having to repeat a monolithic structure over and over. It's almost\nreminiscent of those small plastic building blocks my parents used to step on. Super fun!"]}),"\n",(0,s.jsxs)(t.p,{children:["I find that I ",(0,s.jsx)(t.strong,{children:"don't have to think about what flecks is doing"})," most of the time, which is exactly\nwhat I want."]}),"\n",(0,s.jsxs)(t.p,{children:["flecks is at its best when you can forget that it exists and everything Just Works","\u2122\ufe0f","."]}),"\n",(0,s.jsx)(t.h3,{id:"because-i-can",children:"Because I can"}),"\n",(0,s.jsx)(t.p,{children:"No, seriously! Over the years interacting with various parts of the JS ecosystem I have experienced\na few fairly hostile encounters with closed-minded people who lacked the imagination to see beyond\nthe established wisdom of the week."}),"\n",(0,s.jsxs)(t.p,{children:["So I guess anyone who told me that it won't work, doesn't make sense, or other copium-based\nresponses: Here it is! Eat your hearts out and haterz get meme'd on. ","\ud83d\udc85"]}),"\n",(0,s.jsx)(t.h2,{id:"thanks-again",children:"Thanks again"}),"\n",(0,s.jsxs)(t.p,{children:["I do appreciate you reading all that! I apologize if my tone came off as overly-antagonistic (as\nopposed to ",(0,s.jsx)("em",{children:"the-correct-amount-of-"}),"antagonistic). I actually think people are ",(0,s.jsx)(t.em,{children:"afraid"})," to say some\nof the things I've said here out loud! Come send me love (or threats or whatever) at the\n",(0,s.jsx)(t.a,{href:"https://github.com/cha0s/flecks/discussions",children:"Github discussions page"}),"!"]}),"\n",(0,s.jsxs)(t.p,{children:["Most importantly: ",(0,s.jsx)(t.strong,{children:"Have fun"}),"! ","\u2764\ufe0f"]})]})}function p(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},1324:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/drinking-b50862bbaec8f4900ea0c20af31576bf.jpg"},2945:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/kondo-8ca202a300547b698dedad3b3e1299e0.jpg"},9943:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/over-there-19c01e6cdf39cc325266aa184db093f0.jpg"},7866:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/pls-no-1cfa9e8bc25e1ee3d412e5c5ddbab291.jpg"},2436:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/specific-enough-7a5f7bca00d317ed79832a435f5bcedd.jpg"},9517:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/two-actually-12439fdd460029f7bf3d496e63e09b96.jpg"},1119:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/webscale-c13cfc37833381fdb967bdd730a5d584.jpg"},1151:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>a});var s=n(7294);const i={},o=s.createContext(i);function a(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);