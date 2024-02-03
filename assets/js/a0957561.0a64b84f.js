"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[5048],{8536:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"reimplementing-flecks-react","metadata":{"permalink":"/flecks/blog/reimplementing-flecks-react","source":"@site/blog/2024-02-03/reimplementing-flecks-react/index.mdx","title":"Reimplementing `@flecks/react` by hand","description":"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works","date":"2024-02-03T00:00:00.000Z","formattedDate":"February 3, 2024","tags":[{"label":"flecks","permalink":"/flecks/blog/tags/flecks"},{"label":"education","permalink":"/flecks/blog/tags/education"}],"readingTime":7.3,"hasTruncateMarker":true,"authors":[{"name":"cha0s","title":"Creator of flecks","url":"https://github.com/cha0s","image_url":"https://github.com/cha0s.png","imageURL":"https://github.com/cha0s.png"}],"frontMatter":{"title":"Reimplementing `@flecks/react` by hand","description":"By reimplementing a simplified version of a built-in fleck, we will learn how flecks works","slug":"reimplementing-flecks-react","authors":[{"name":"cha0s","title":"Creator of flecks","url":"https://github.com/cha0s","image_url":"https://github.com/cha0s.png","imageURL":"https://github.com/cha0s.png"}],"tags":["flecks","education"],"hide_table_of_contents":false,"image":"https://cha0s.github.io/flecks/flecks.png"},"unlisted":false,"nextItem":{"title":"flecks: NOT a fullstack framework","permalink":"/flecks/blog/introducing-flecks"}},"content":"import Create from \'@site/helpers/create\';\\nimport Execute from \'@site/helpers/execute\';\\nimport Install from \'@site/helpers/install-package\';\\nimport Run from \'@site/helpers/run\';\\n\\nflecks provides some default flecks to help with common tasks such as spinning up a web server,\\ndatabases, and a react runtime with babel plugins, among many other things.\\n\\nIn this article, we will be reimplementing a small subset of `@flecks/react` in our own isolated\\napplication so we can learn how to build with flecks.\\n\\n{/* truncate */}\\n\\n:::warning[Save yourself the trouble]\\n\\nIn practice, there\'s not much need to reimplement React support, you can just lean on what\'s\\nalready provided -- that is in fact the entire point of flecks!\\n\\nThis is just an illustration for the sake of understanding.\\n\\n:::\\n\\n## Generate some stuff\\n\\nFirst, let\'s generate a little application starter:\\n\\n<Create type=\\"app\\" pkg=\\"illustration\\" />\\n\\n```\\ncd illustration\\n```\\n\\nWe\'ll create two flecks, one called `react`:\\n\\n<Create headless type=\\"fleck\\" pkg=\\"react\\" />\\n\\nand one called `component`:\\n\\n<Create headless type=\\"fleck\\" pkg=\\"component\\" />\\n\\nA quick look at `build/flecks.yml` shows:\\n\\n```yml\\n\'@flecks/build\': {}\\n\'@flecks/core\':\\n  id: illustration\\n\'@flecks/server\': {}\\n// highlight-start\\n\'@illustration/component:./packages/component\': {}\\n\'@illustration/react:./packages/react\': {}\\n// highlight-end\\n```\\n\\n## Do stuff with React\\n\\nLet\'s go in our `component` package and make some React noises. We\'ll create\\n`@illustration/component/src/component.jsx`:\\n\\n```js title=\\"packages/component/src/component.jsx\\"\\n// highlight-next-line\\nfunction Component() {\\n  // Just for now so we don\'t need the React instance just yet...\\n  // highlight-start\\n  return false;\\n}\\nexport default Component;\\n// highlight-end\\n```\\n\\nand we\'ll import it in to `@illustration/component/src/index.js`:\\n\\n```js title=\\"packages/component/src/index.js\\"\\n// highlight-next-line\\nimport Component from \'./component\';\\n```\\n\\nStart your application:\\n\\n<Run headless cmd=\\"start\\" />\\n\\n### Whoops\\n\\nUh, oh! We got an error:\\n\\n```\\nModule not found: Error: Can\'t resolve \'./component\'\\n\\n      no extension\\n        [...]/illustration/packages/component/src/component doesn\'t exist\\n      .mjs\\n        [...]/illustration/packages/component/src/component.mjs doesn\'t exist\\n      .js\\n        [...]/illustration/packages/component/src/component.js doesn\'t exist\\n      .json\\n        [...]/illustration/packages/component/src/component.json doesn\'t exist\\n      .wasm\\n        [...]/illustration/packages/component/src/component.wasm doesn\'t exist\\n\\n```\\n\\nWe can see that `jsx` wasn\'t one of the extensions that got searched! This is because of flecks\'s\\n**small core philosophy**. It\'s just a JS application by default. The whole point is that we are\\nabout to implement React support ourselves! Let\'s do that.\\n\\n### Modify the build\\n\\nWe need to add the ability to discover (and compile) JSX files. We\'ll do this in\\n`@illustration/react`.\\n\\n:::info[Just a phase]\\n\\nflecks has a **bootstrap** phase where build hooks like `@flecks/core.babel` are invoked. This is\\nin contrast to the **runtime** phase which is where hooks like `@flecks/server.up`\\nare invoked.\\n\\n:::\\n\\nLet\'s modify `@illustration/react/build/flecks.bootstrap.js` like so:\\n\\n```js\\nexports.dependencies = [];\\n\\nexports.hooks = {\\n  // babel config to compile JSX\\n// highlight-next-line\\n  \'@flecks/core.babel\': () => ({presets: [\'@babel/preset-react\']}),\\n  // implicit extensions\\n  // highlight-next-line\\n  \'@flecks/build.extensions\': () => [\'.jsx\'],\\n};\\n```\\n\\nWe\'re using `@babel/preset-react` now, so let\'s move into `@illustration/react` and add it to our\\ndependencies:\\n\\n<Install headless pkg=\\"@babel/preset-react\\" />\\n\\nStart your application again:\\n\\n<Run headless cmd=\\"start\\" />\\n\\nEverything comes up right! Only thing is, we don\'t actually have a web server yet!\\n\\n## Web integration\\n\\nflecks provides `@flecks/web` which implements a web server and runtime upon which we may build\\nweb applications. A React application is a specialization of a web application, so let\'s lean on\\n`@flecks/web` so we don\'t have to completely reinvent the wheel!\\n\\n### Dependencies\\n\\nMove into `@illustration/react` and add `@flecks/web` as well as `react` and `react-dom`:\\n\\n<Install headless pkg=\\"@flecks/web react react-dom\\" />\\n\\nAdd `@flecks/web` to the dependencies in `@illustration/react/build/flecks.bootstrap.js`:\\n\\n```js title=\\"packages/react/build/flecks.bootstrap.js\\"\\n// highlight-next-line\\nexports.dependencies = [\'@flecks/web\'];\\n```\\n\\n### Client implementation\\n\\nBefore we proceed we\'ll need to actually do something in our new web client. Let\'s add some code to\\n`@illustration/react/src/index.js`:\\n\\n```js title=\\"packages/react/src/index.js\\"\\n// highlight-start\\nimport React from \'react\';\\nimport {createRoot} from \'react-dom/client\';\\n// highlight-end\\n\\nexport const hooks = {\\n  // highlight-next-line\\n  \'@flecks/web/client.up\': async (flecks) => {\\n    // appMountId defaults to \'root\', by the way.\\n    // highlight-start\\n    const {appMountId} = flecks.get(\'@flecks/web\');\\n    const container = window.document.getElementById(appMountId);\\n    // highlight-end\\n    // Render the root we create with react-dom\\n    // highlight-next-line\\n    createRoot(container).render(\\n      // What to render though..?\\n      // highlight-next-line\\n    );\\n    // highlight-next-line\\n    console.log(\'rendered\');\\n  // highlight-next-line\\n  },\\n};\\n```\\n\\n:::info[`export const` all of a sudden]\\n\\nSince we\'re dealing with the **runtime** phase now, we get access to the nice stuff we\'re used to\\nlike `export const hooks` instead of `exports.hooks`.\\n\\n**Rule of thumb**: if you are in **`build`** you\'re probably in the **bootstrap** phase. Otherwise,\\nyou are in the **runtime** phase.\\n\\n:::\\n\\nNow, restart your application:\\n\\n<Run headless cmd=\\"start\\" />\\n\\nYou\'ll see that we\'re now getting the `rendered` message in the console.\\n\\n### What are we doing here exactly?\\n\\nWhat are we going to render, though? This is where **hooks** come into play!\\n\\nOur `@illustration/react` fleck needs to be able to gather and render components on behalf of\\nother flecks so they don\'t have to do all of this root rendering busywork.\\n\\nWe\'ll implement a hook: `@illustration/react.roots` that will allow other flecks to implement their\\nReact root components. We\'ll then collect and render them all.\\n\\nEdit `@illustration/react/src/index.js`:\\n\\n```js title=\\"packages/react/src/index.js\\"\\nimport React from \'react\';\\nimport {createRoot} from \'react-dom/client\';\\n\\nexport const hooks = {\\n  \'@flecks/web/client.up\': async (flecks) => {\\n    const {appMountId} = flecks.get(\'@flecks/web\');\\n    const container = window.document.getElementById(appMountId);\\n    // highlight-start\\n    const results = flecks.invoke(\'@illustration/react.roots\');\\n    // highlight-end\\n    // By default `invoke` returns an object: {[fleckPath]: result, ...}\\n    // So, we\'ll map it into a flat list of components and use the fleck path as the key prop:\\n    // highlight-start\\n    const Components = Object.entries(results)\\n      .map(([fleckPath, Component]) => React.createElement(Component, {key: fleckPath}));\\n    // highlight-end\\n    // Finally we\'ll render all our components as children of the `React.StrictMode` component:\\n    // highlight-start\\n    createRoot(container).render(React.createElement(React.StrictMode, {}, Components));\\n    console.log(\'rendered roots: %O\', results);\\n    // highlight-end\\n  },\\n};\\n```\\n\\nRefreshing the page shows `rendered roots: Object {  }` in the console. Getting closer!\\n\\nLet\'s go back over to `@illustration/component/src/index.js` and implement **our** hook:\\n\\n```js title=\\"packages/component/src/index.js\\"\\nimport Component from \'./component\';\\n\\n// highlight-start\\nexport const hooks = {\\n  \'@illustration/react.roots\': () => Component,\\n};\\n// highlight-end\\n```\\n\\nRefresh one more time and you will see:\\n\\n```\\nrendered roots:  Object { \\"@illustration/component\\": Component() }\\n```\\n\\nAwesome!\\n\\n### Passing React\\n\\nIf you remember, our original component just `return false`\'d up there, and we only\\nadded `react` to `@illustration/react`. So how do we use it from `@illustration/component`?\\nWell, `@flecks/react` just re-exports it so you don\'t have to worry about this exact thing. Let\'s\\nfollow suit in `@illustration/react`:\\n\\n```js title=\\"packages/react/src/index.js\\"\\nimport React from \'react\';\\nimport {createRoot} from \'react-dom/client\';\\n\\n// highlight-next-line\\nexport {React};\\n\\nexport const hooks = {\\n  \'@flecks/web/client.up\': async (flecks) => {\\n    const {appMountId} = flecks.get(\'@flecks/web\');\\n    const container = window.document.getElementById(appMountId);\\n    const results = flecks.invoke(\'@illustration/react.roots\');\\n    // By default `invoke` returns a map: {[fleckPath]: result}\\n    // So, we\'ll map it into a flat list of components and use the fleck path as the key:\\n    const Components = Object.entries(results)\\n      .map(([fleckPath, Component]) => React.createElement(Component, {key: fleckPath}));\\n    // Finally we\'ll render all our components as children of the `React.StrictMode` component:\\n    createRoot(container).render(React.createElement(React.StrictMode, {}, Components));\\n    console.log(\'rendered roots: %O\', results);\\n  },\\n};\\n```\\n\\nBack over in `@illustration/component/src/component.jsx`, we\'ll use it:\\n\\n```js title=\\"packages/component/src/component.jsx\\"\\n// highlight-next-line\\nimport {React} from \'@illustration/react\';\\n\\nfunction Component() {\\n  // highlight-next-line\\n  return <p>Hello world</p>;\\n}\\nexport default Component;\\n```\\n\\nNow refresh the page and you will see exactly what you expect!\\n\\n## For real this time\\n\\nOther aspects like HMR will be left as an exercise for the reader. Or... you could just use\\n`@flecks/react`! You really should do that and save yourself the trouble. Back in our application\'s\\n`build/flecks.yml` let\'s remove our half-baked React implementation:\\n\\n```yml\\n\'@flecks/build\': {}\\n\'@flecks/core\':\\n  id: illustration\\n\'@flecks/server\': {}\\n\'@illustration/component:./packages/component\': {}\\n```\\n\\nMove into `@illustration/component` and **add `@flecks/react` using the flecks CLI**:\\n\\n<Execute headless cmd=\\"flecks add @flecks/react\\" />\\n\\nThis is a twofer! It **adds the package to `dependencies` in `package.json`** and it also **adds\\na fleck dependency in `flecks.bootstrap.js`**:\\n\\n```json title=\\"packages/component/package.json\\"\\n{\\n  \\"name\\": \\"@illustration/component\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"scripts\\": {\\n    \\"build\\": \\"flecks build\\",\\n    \\"clean\\": \\"flecks clean\\",\\n    \\"lint\\": \\"flecks lint\\",\\n    \\"postversion\\": \\"npm run build\\",\\n    \\"test\\": \\"flecks test\\"\\n  },\\n  \\"files\\": [\\n    \\"index.js\\"\\n  ],\\n  \\"dependencies\\": {\\n    \\"@flecks/core\\": \\"^3.0.0\\",\\n    // highlight-next-line\\n    \\"@flecks/react\\": \\"^3.2.1\\"\\n  },\\n  \\"devDependencies\\": {\\n    \\"@flecks/build\\": \\"^3.0.0\\",\\n    \\"@flecks/fleck\\": \\"^3.0.0\\"\\n  }\\n}\\n```\\n\\n```js title=\\"packages/component/build/flecks.bootstrap.js\\"\\n// highlight-next-line\\nexports.dependencies = [\'@flecks/react\'];\\n\\nexports.hooks = {};\\n```\\n\\n:::tip[Achievement unlocked: dependence]\\n\\n`@illustration/component` has specified all of its dependencies!\\n\\nIt might seem like a bit of busywork to explicitly specify your dependencies because flecks makes\\nit so easy to get along without needing to.\\n\\nHowever by doing so you unlock the potential of **sharing your code with others** which gets at the\\nheart of the flecks way: sharing solutions to repeated problems. Remember: **Future you is just\\nas likely to be the beneficiary!**\\n\\n:::\\n\\nSwap the `React` import in `@illustration/component/src/component.jsx`:\\n\\n```js title=\\"packages/component/src/component.jsx\\"\\n// highlight-next-line\\nimport {React} from \'@flecks/react\';\\n\\nfunction Component() {\\n  return <p>Hello world</p>;\\n}\\nexport default Component;\\n```\\n\\nSwap the hook implementation in `@illustration/component/src/index.js`:\\n\\n```js title=\\"packages/component/src/index.js\\"\\nimport Component from \'./component\';\\n\\nexport const hooks = {\\n  // highlight-next-line\\n  \'@flecks/react.roots\': () => Component,\\n};\\n```\\n\\n:::info[Copy that]\\n\\nIt\'s what we spent all of this time doing, but better!\\n\\nThe entire reason flecks exists is to minimize duplicated effort.\\n\\n:::\\n\\n### Enjoy\\n\\n<Run headless cmd=\\"start\\" />\\n\\nNow all that\'s left is to **have fun**!"},{"id":"introducing-flecks","metadata":{"permalink":"/flecks/blog/introducing-flecks","source":"@site/blog/2024-01-30/introducing-flecks.mdx","title":"flecks: NOT a fullstack framework","description":"Introducing flecks: an exceptionally-extensible application production system.","date":"2024-01-30T00:00:00.000Z","formattedDate":"January 30, 2024","tags":[{"label":"announcement","permalink":"/flecks/blog/tags/announcement"},{"label":"introducing","permalink":"/flecks/blog/tags/introducing"},{"label":"flecks","permalink":"/flecks/blog/tags/flecks"},{"label":"release","permalink":"/flecks/blog/tags/release"}],"readingTime":8.125,"hasTruncateMarker":true,"authors":[{"name":"cha0s","title":"Creator of flecks","url":"https://github.com/cha0s","image_url":"https://github.com/cha0s.png","imageURL":"https://github.com/cha0s.png"}],"frontMatter":{"title":"flecks: NOT a fullstack framework","description":"Introducing flecks: an exceptionally-extensible application production system.","slug":"introducing-flecks","authors":[{"name":"cha0s","title":"Creator of flecks","url":"https://github.com/cha0s","image_url":"https://github.com/cha0s.png","imageURL":"https://github.com/cha0s.png"}],"tags":["announcement","introducing","flecks","release"],"hide_table_of_contents":false,"image":"https://cha0s.github.io/flecks/flecks.png"},"unlisted":false,"prevItem":{"title":"Reimplementing `@flecks/react` by hand","permalink":"/flecks/blog/reimplementing-flecks-react"}},"content":"import Link from \'@docusaurus/Link\';\\n\\nexport function Tiny({children}) {\\n  return <span style={{fontSize: \'0.75em\'}}>{children}</span>;\\n}\\n\\nIntroducing flecks: an **exceptionally-extensible application production system**.\\n\\n{/* truncate */}\\n\\n## First off, :pray:\\n\\nI appreciate you checking out the project! I truly hope that you will find working with flecks\\nto be a joy. Feedback is welcome over on the\\n[Github discussions page](https://github.com/cha0s/flecks/discussions) or the\\n[Discord](https://discord.gg/SH66yQBwNf)!\\n\\n:::warning[What\'s the letter before \\"alpha\\"?]\\n\\nThis is a new release and worked on by only one person: [me](https://github.com/cha0s)! Please\\nkeep this in mind!\\n\\n:::\\n\\n## Is it ~~webscale~~ fullstack?\\n\\n<figure>\\n  ![A screenshot from the 2010 \\"MongoDB is webscale\\" cartoon](./webscale.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>*yes, I remember*</figcaption>\\n</figure>\\n\\nI admit, I baited with the title there just a little bit. I love fullstack! flecks is more\\nthan capable of building fullstack applications. If you just want to jump to more of that sort\\nof thing, you might be interested in the <Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/react\\">React</Link>\\npage in the documentation.\\n\\n### For real, though\\n\\nA fullstack JS application is basically appception: what you actually have is a server\\napplication written in JS that serves a client application written in JS. Using\\nthe same language obscures (arguably, *by design*) the fact that these are actually two distinct\\napplications.\\n\\n![A screenshot of Doctor Olivia Octopus saying \\"There\'s two, actually\\"](./two-actually.jpg)\\n\\n:::danger[`\'use controversy\';`]\\n\\nSome modern framework APIs are becoming increasingly esoteric in their attempt to paper over\\nthis reality\\n([*\\\\*ahem\\\\**](https://github.com/cha0s/flecks/blob/master/packages/react/src/client.js#L24)... and\\ndon\'t get me started on [**RSC**](https://www.mayank.co/blog/react-server-components/)...).\\n\\n:::\\n\\n### Don\'t get it twisted\\n\\nTo put it in basic terms: A web server is a core aspect of a fullstack application, but **a\\nweb server is not a core aspect of an application**. The same could be said about asset\\noptimization, routing, and many other core fullstack JS concepts.\\n\\nflecks is concerned with **writing applications**; fullstack applications are merely a subset of\\nthat.\\n\\n## Do one thing and do it well\\n\\nThe core primitive is the **fleck** which is... just a JS module. There exists a server\\nfleck, a web fleck, a React fleck, and so on.\\n\\nHere\'s a simple fleck that says hello when the application is starting:\\n\\n```js\\nexport const hooks = {\\n  \'@flecks/core.starting\': () => {\\n    console.log(\'hey you\');\\n  },\\n};\\n```\\n\\nThat\'s it. It\'s a module that exports some hook implementations. If you\'re curious what kind of\\nhooks we\'re talking about, check out\\n<Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/flecks/hooks\\">the hooks reference page</Link>.\\n\\nYou add a reference to your fleck to a file called\\n<Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/creating-a-fleck\\">`flecks.yml`</Link>\\nand you\'re rolling. Use the\\n[built-in tooling](https://cha0s.github.io/flecks/docs/creating-a-fleck) and you won\'t even have\\nto do that by hand. Again, **a flecks application is just flecks** having their hook\\nimplementations invoked.\\n\\nWhat are multiple flecks called? **flecks**!\\n\\n:::tip[Flickin\' fleckers]\\n\\nIt is not a coincidence that the name of the framework uses the same word as the plural form of\\nits constituting elements: the implication is that **flecks is just flecks**, it\'s not really doing\\nanything special on its own. Sure, it *does something*, but the something that it does is provide\\ntools with which to orchestrate your flecks together into an application.\\n\\n:::\\n\\n### Small core\\n\\nCreating an application with `@flecks/create-app` and then doing\\ne.g. `yarn install --production` will result in a full working application with a size of\\n**less than 7 MB**. Granted, it\'s only a server that will start, have nothing to do, and halt in\\nabout 100 ms, but it illustrates that flecks builds what you tell it to, **it is not a kitchen\\nsink system**.\\n\\n<figure>\\n  ![A screenshot of Fry from Futurama captioned \\"Not sure if you\'re overly specific or not specific enough\\"](./specific-enough.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>*When you\'re writing an article and curious about how the Big Kid on the Block performs in terms of raw default production application size, but can\'t even figure out how to measure it because you have already downloaded more than 7MB of ads for their \\"hosting solution\\" into your brain in the process*</figcaption>\\n</figure>\\n\\n### So where\'s asset optimization, data fetching, filetree routing, RSC...?\\n\\nWell, I do admit that I don\'t stand before you today with a solution for every problem around\\nfullstack development.\\n\\nflecks is made with **cooperation and collaboration as a primary concern**. A fleck is *just\\na package* exactly for that reason: it should be frictionless to publish a package (or a suite)\\nto the world and then add them to a project just like you would with any other package! **It should\\nbe as frictionless** for a developer to say \\"I don\'t agree with how this fleck is\\nimplemented\\" and write their own, interacting seamlessly with everything else they actually want.\\n\\n**I believe we can design modular solutions to these problems!** In order to do this, it\'s probably\\nbetter to be standing on top of less, not more.\\n\\n### <ins>Better *no* abstraction than the *wrong* abstraction</ins>\\n\\nI know this will come off as inflammatory but some of the more recent JS framework \\"paradigms\\" feel\\nlike someone <Tiny><Tiny>drunk-</Tiny></Tiny>coded at midnight and *had an epiphany* about the \\"killer new\\nthing\\" which means they are now going to spend the next 5 hours torturing their code only to wake\\nup the next morning absolutely exhausted with a rickety codebase and a deep sense of regret as they\\nrevert all the changes and pretend that it never happened.\\n\\n<figure>\\n  ![A picture of a person with their head down pouring coffee all over the place captioned \\"I\'m never drinking again\\"](./drinking.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>***obviously** this has never happened in **my** projects. <Tiny><Tiny>Also, I ran your credit card the whole time.</Tiny></Tiny>*</figcaption>\\n</figure>\\n\\n### The flecks way\\n\\nThe few core architectural opinions that are held are presented as suggestions, not requirements.\\n\\n:::info[**\u201cI hold it to be the inalienable right of anybody to go to hell in his own way.\u201d**]\\n\\n\u2015 Robert Frost\\n\\n:::\\n\\nA few motivating philosophies which I **do not** consider to be suggestions regarding this\\nproject:\\n\\n- You **shouldn\'t be unpleasantly surprised** by what happens\\n- Your application has what **you** want in it, not what **flecks** wants in it\\n- Developer **comfort and confidence are essential**, not just a nice-to-have\\n- You **shouldn\'t have to have a full budget** for production deployment\\n- Core architectural **opinions require transparency and justification**\\n\\n## Why though?\\n\\nYou might be thinking something like:\\n\\n<figure>\\n  ![A screenshot of Michael from The Office shouting \\"NO GOD PLEASE NO\\"](./pls-no.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>***Why?!*** *A new JavaScript framework is the last thing we need.*</figcaption>\\n</figure>\\n\\nPerhaps you will write a thesis explaining in great detail why there is no\\nobjective reason for flecks to exist. **I\'m fine with that**,\\n<Tiny>because I love it and there\'s nothing you can do about it.</Tiny>\\n\\nSeriously though, a couple reasons why I made flecks and use it to develop applications are:\\n\\n### Separation of concerns\\n\\nJS has matured a lot over the years, and modules are all but a first-class concept. This has been\\na huge win for Properly Structured\u2122 applications.\\n\\nHowever, I believe the real reason many fullstack frameworks exist today is to\\n*centralize concerns*. No one wants to set up a whole database, a routing system, a webserver,\\netc, <Tiny>etc, <Tiny>etc.</Tiny></Tiny> every time. So, the default approach has been to reach out\\nfor a framework to tie it all together. To some extent this is an inevitable evolution.\\n\\n<figure>\\n  ![Screenshot of Patrick Star with the caption \\"Push them somewhere else\\"](./over-there.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>*You\'ve never even **seen** a real <Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/redux\\">duck</Link>*</figcaption>\\n</figure>\\n\\n\\nWith flecks, the first principle is to push these concerns out into modular units which do one\\nthing and do it immaculately.\\n[This is not a new concept](https://en.wikipedia.org/wiki/Unix_philosophy)! These units can be\\ncomposed into an application that does as much or as little as you like, <Tiny>without requiring\\nyour application structure to follow some corporate diktat <Tiny>requiring you to enter a mailing\\naddress to submit a pull request. <Tiny>(don\'t ask...)</Tiny></Tiny></Tiny>\\n\\n### Joy\\n\\n<div style={{float: \'right\', padding: \'0 1.5rem\'}}>![A screenshot of Marie Kondo stating \\"This one sparks joy.\\"](./kondo.jpg)</div>\\n\\nI have found this structure to work very well and to *feel pleasant*. It\'s great to get up and\\nrunning super quickly without having to repeat a monolithic structure over and over. It\'s almost\\nreminiscent of those small plastic building blocks my parents used to step on. Super fun!\\n\\nI find that I **don\'t have to think about what flecks is doing** most of the time, which is exactly\\nwhat I want.\\n\\nflecks is at its best when you can forget that it exists and everything Just Works\u2122.\\n\\n### I miss old React\\n\\nOne of the reasons I started using React over a decade ago was because it didn\'t try to dictate\\nevery aspect of how my application was built. This new-fangled server renderin\' ain\'t new for me\\neither.\\n[Not me casually dropping a link showing that I was messing with **SSRing Angular 1 back in 2013**](https://github.com/cha0s/shrub/commit/7573da0011cb518af460c8ef305c226144ab9603#diff-478e94fcfb7f124ddcb4782ba905316bdeac63aefc6167be56cf22829677c3bdR19).\\n\\nMaybe it\'s irresponsible, maybe it\'s freewheeling (and yes, flecks (and everything) should have\\nmore tests) but I miss that old spirit and flecks is in some small way an homage to a Better\\nTime\u2122.\\n\\n### Because I can\\n\\nNo, seriously! Over the years interacting with various parts of the JS ecosystem I have experienced\\na few fairly hostile encounters with closed-minded people who lacked the imagination to see beyond\\nthe established wisdom of the week.\\n\\nSo I guess anyone who told me that it won\'t work, doesn\'t make sense, or other copium-based\\nresponses: Here it is! Eat your hearts out and\\n<span className=\\"getmemedon\\">**haterz get meme\'d on**</span>. :nail_care:\\n\\n## Thanks again\\n\\nI do appreciate you reading all that! I apologize if my tone came off as overly-antagonistic (as\\nopposed to <em>the-correct-amount-of-</em>antagonistic). I actually think people are *afraid* to say some\\nof the things I\'ve said here out loud! Come send me love (or threats or whatever) at the\\n[Github discussions page](https://github.com/cha0s/flecks/discussions) or the\\n[Discord](https://discord.gg/SH66yQBwNf)!\\n\\nMost importantly: **Have fun**! :heart:"}]}')}}]);