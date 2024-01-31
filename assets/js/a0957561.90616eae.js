"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[5048],{8536:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"introducing-flecks","metadata":{"permalink":"/flecks/blog/introducing-flecks","source":"@site/blog/2024-01-30-introducing-flecks.mdx","title":"flecks: NOT a fullstack framework","description":"Introducing flecks: an exceptionally-extensible application production system.","date":"2024-01-30T00:00:00.000Z","formattedDate":"January 30, 2024","tags":[{"label":"announcement","permalink":"/flecks/blog/tags/announcement"},{"label":"introducing","permalink":"/flecks/blog/tags/introducing"},{"label":"flecks","permalink":"/flecks/blog/tags/flecks"},{"label":"release","permalink":"/flecks/blog/tags/release"}],"readingTime":7.465,"hasTruncateMarker":true,"authors":[{"name":"cha0s","title":"Creator of flecks","url":"https://github.com/cha0s","image_url":"https://github.com/cha0s.png","imageURL":"https://github.com/cha0s.png"}],"frontMatter":{"title":"flecks: NOT a fullstack framework","description":"Introducing flecks: an exceptionally-extensible application production system.","slug":"introducing-flecks","authors":[{"name":"cha0s","title":"Creator of flecks","url":"https://github.com/cha0s","image_url":"https://github.com/cha0s.png","imageURL":"https://github.com/cha0s.png"}],"tags":["announcement","introducing","flecks","release"],"hide_table_of_contents":false},"unlisted":false},"content":"import Link from \'@docusaurus/Link\';\\n\\nexport function Tiny({children}) {\\n  return <span style={{fontSize: \'0.75em\'}}>{children}</span>;\\n}\\n\\nIntroducing flecks: an **exceptionally-extensible application production system**.\\n\\n{/* truncate */}\\n\\n## First off, thanks for your time :pray:\\n\\nI appreciate you checking out the project! I truly hope that you will find working with flecks\\nto be a joy. Feedback is welcome over on the\\n[Github discussions page](https://github.com/cha0s/flecks/discussions)!\\n\\n:::warning[What\'s the letter before \\"alpha\\"?]\\n\\nThis is a new release and worked on by only one person: [me](https://github.com/cha0s)! Please\\nkeep this in mind!\\n\\n:::\\n\\n## Is it ~~webscale~~ fullstack?\\n\\n<figure>\\n  ![A screenshot from the 2010 \\"MongoDB is webscale\\" cartoon](./webscale.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>*yes, I remember*</figcaption>\\n</figure>\\n\\nI admit, I clickbaited with the title there just a little bit. I love fullstack! flecks is more\\nthan capable of building fullstack applications. If you just want to jump to more of that sort\\nof thing, you might be interested in the <Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/react\\">React</Link>\\npage in the documentation.\\n\\n### For real, though\\n\\nA fullstack JS application is basically appception: what you actually have is a server\\napplication written in JS that serves a client application written in JS. Using\\nthe same language obscures (arguably, *by design*) the fact that these are actually two distinct\\napplications.\\n\\n![A screenshot of Doctor Olivia Octopus saying \\"There\'s two, actually\\"](./two-actually.jpg)\\n\\n:::danger[Hot take]\\n\\nSome modern framework APIs are becoming increasingly obscure in their attempt to paper over\\nthis reality\\n([*\\\\*ahem\\\\**](https://github.com/cha0s/flecks/blob/master/packages/react/src/client.js#L24)... and\\ndon\'t get me started on [**RSC**](https://www.mayank.co/blog/react-server-components/)...).\\n\\n:::\\n\\n### Don\'t get it twisted\\n\\nTo put it in basic terms: A web server is a core aspect of a fullstack application, but **a\\nweb server is not a core aspect of an application**. The same could be said about asset\\noptimization, routing, and many other core fullstack JS concepts.\\n\\nflecks is concerned with **writing applications**; fullstack applications are merely a subset of\\nthat.\\n\\n## Do one thing and do it well\\n\\nThe core primitive is the **fleck** which is... just a JS module. There exists a server\\nfleck, a web fleck, a React fleck, and so on.\\n\\nHere\'s a simple fleck that says hello when the application is starting:\\n\\n```js\\nexport const hooks = {\\n  \'@flecks/core.starting\': () => {\\n    console.log(\'hey you\');\\n  },\\n};\\n```\\n\\nThat\'s it. It\'s a module that exports some hook implementations. If you\'re curious what kind of\\nhooks we\'re talking about, check out\\n<Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/flecks/hooks\\">the hooks reference page</Link>.\\n\\nYou add a reference to your fleck to a file called\\n<Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/creating-a-fleck\\">`flecks.yml`</Link> and you\'re rolling. Again,\\n**a flecks application is just flecks** having their hook implementations invoked.\\n\\nWhat are multiple flecks called? **flecks**!\\n\\n:::tip[Flickin\' fleckers]\\n\\nIt is not a coincidence that the name of the framework uses the same word as the plural form of\\nits constituting elements: the implication is that **flecks is just flecks**, it\'s not really doing\\nanything special on its own. Sure, it *does something*, but the something that it does is provide\\ntools with which to orchestrate your flecks together into an application.\\n\\n:::\\n\\n### Small core\\n\\nCreating an application with `@flecks/create-app` and then doing\\ne.g. `yarn install --production` will result in a full working application with a size of\\n**less than 7 MB**. Granted, it\'s only a server that will start, have nothing to do, and halt in\\nabout 100 ms, but it illustrates that flecks builds what you tell it to, **it is not a kitchen\\nsink system**.\\n\\n<figure>\\n  ![A screenshot of Fry from Futurama captioned \\"Not sure if you\'re overly specific or not specific enough\\"](./specific-enough.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>*When you\'re writing an article and curious about how the Big Kid on the Block performs in terms of raw default production application size, but can\'t even figure out how to measure it because you have already downloaded more than 7MB of ads for their \\"hosting solution\\" into your brain in the process*</figcaption>\\n</figure>\\n\\n### So where\'s asset optimization, data fetching, filetree routing, RSC...?\\n\\nWell, I do admit that I don\'t stand before you today with a solution for every problem around\\nfullstack development.\\n\\nflecks is made with **cooperation and collaboration as a primary concern**. A fleck is *just\\na package* exactly for that reason: it should be frictionless to publish a package (or a suite)\\nto the world and then add them to a project just like you would with any other package! **It should\\nbe as frictionless** for a developer to say \\"I don\'t agree with how this fleck is\\nimplemented\\" and write their own, interacting seamlessly with everything else they actually want.\\n\\n**I believe we can design modular solutions to these problems!** In order to do this, it\'s probably\\nbetter to be standing on top of less, not more.\\n\\n### <ins>Better *no* abstraction than the *wrong* abstraction</ins>\\n\\nI know this will come off as inflammatory but I *honestly feel* like some of the more recent\\nJS framework \\"paradigms\\" feel like someone coding at midnight and having an epiphany about the\\n\\"killer new paradigm\\" which they are now going to spend the next 5 hours implementing in all\\ntheir code only to wake up the next morning absolutely exhausted with a broken codebase and a\\ndeep sense of regret as they revert all the changes and pretend that it never happened.\\n\\n<figure>\\n  ![A picture of a person with their head down pouring coffee all over the place captioned \\"I\'m never drinking again\\"](./drinking.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>***obviously** this has never happened to **my** projects. <Tiny><Tiny>Also, you ran your credit card the whole time.</Tiny></Tiny>*</figcaption>\\n</figure>\\n\\n### The flecks way\\n\\nThe few core architectural opinions that are held are presented as suggestions, not requirements.\\n\\n:::info[**\u201cI hold it to be the inalienable right of anybody to go to hell in his own way.\u201d**]\\n\\n\u2015 Robert Frost\\n\\n:::\\n\\nA few motivating philosophies which I **do not** consider to be suggestions regarding this\\nproject:\\n\\n- You shouldn\'t be unpleasantly surprised by what happens\\n- Your application has what **you** want in it, not what **flecks** wants in it\\n- Developer comfort and confidence are essential, not just a nice-to-have\\n- You shouldn\'t have to have a full budget for production deployment\\n- Core architectural opinions require transparency and justification\\n\\n## Why though?\\n\\nYou might be thinking something like:\\n\\n<figure>\\n  ![A screenshot of Michael from The Office shouting \\"NO GOD PLEASE NO\\"](./pls-no.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>***Why?!*** *A new JavaScript framework is the last thing we need.*</figcaption>\\n</figure>\\n\\nPerhaps you will write a thesis explaining in great detail why there is no\\nobjective reason for flecks to exist. **I\'m fine with that**,\\n<Tiny>because I love it and there\'s nothing you can do about it.</Tiny>\\n\\nSeriously though, a couple reasons why I made flecks and use it to develop applications are:\\n\\n### Separation of concerns\\n\\nJS has matured a lot over the years, and modules are all but a first-class concept. This has been\\na huge win for Properly Structured:tm: applications.\\n\\nHowever, I believe the real reason many fullstack frameworks exist today is to\\n*centralize concerns*. No one wants to set up a whole database, a routing system, a webserver,\\netc, <Tiny>etc, <Tiny>etc.</Tiny></Tiny> every time. So, the default approach has been to reach out\\nfor a framework to tie it all together. To some extent this is an inevitable evolution.\\n\\n<figure>\\n  ![Screenshot of Patrick Star with the caption \\"Push them somewhere else\\"](./over-there.jpg)\\n  <figcaption style={{fontSize: \'0.8rem\'}}>*You\'ve never even **seen** a real <Link target=\\"_blank\\" to=\\"https://cha0s.github.io/flecks/docs/redux\\">duck</Link>*</figcaption>\\n</figure>\\n\\n\\nWith flecks, the first principle is to push these concerns out into modular units which do one\\nthing and do it immaculately.\\n[This is not a new concept](https://en.wikipedia.org/wiki/Unix_philosophy)! These units can be\\ncomposed into an application that does as much or as little as you like, <Tiny>without requiring\\nyour application structure to follow some corporate diktat <Tiny>requiring you to enter a mailing\\naddress to submit a pull request. <Tiny>(don\'t ask...)</Tiny></Tiny></Tiny>\\n\\n### Joy\\n\\n<div style={{float: \'right\', padding: \'0 1.5rem\'}}>![A screenshot of Marie Kondo stating \\"This one sparks joy.\\"](./kondo.jpg)</div>\\n\\nI have found this structure to work very well and to *feel pleasant*. It\'s great to get up and\\nrunning super quickly without having to repeat a monolithic structure over and over. It\'s almost\\nreminiscent of those small plastic building blocks my parents used to step on. Super fun!\\n\\nI find that I **don\'t have to think about what flecks is doing** most of the time, which is exactly\\nwhat I want.\\n\\nflecks is at its best when you can forget that it exists and everything Just Works:tm:.\\n\\n### Because I can\\n\\nNo, seriously! Over the years interacting with various parts of the JS ecosystem I have experienced\\nall manner of closed-minded hostile encounters with people who regrettably lacked the imagination\\nto understand something which may have ran counter to the established wisdom of the week.\\n\\nSo I guess anyone who told me that it won\'t work, doesn\'t make sense, or other copium-based\\nresponses: Here it is! Eat your hearts out and haterz get meme\'d on. :nail_care:\\n\\n## Thanks again\\n\\nI do appreciate you reading all that! Come send me love (or threats or whatever) at the\\n[Github discussions page](https://github.com/cha0s/flecks/discussions)! :relieved:"}]}')}}]);