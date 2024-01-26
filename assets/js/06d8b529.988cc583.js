"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[9091],{2127:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>h});var t=s(5893),r=s(1151),a=s(3200),l=s(385);const o={title:"Database",description:"Define models and connect to a database."},i="Database",c={id:"database",title:"Database",description:"Define models and connect to a database.",source:"@site/docs/database.mdx",sourceDirName:".",slug:"/database",permalink:"/flecks/docs/database",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Database",description:"Define models and connect to a database."},sidebar:"flecksSidebar",previous:{title:"Documentation",permalink:"/flecks/docs/documentation"},next:{title:"Docker",permalink:"/flecks/docs/docker"}},d={},h=[{value:"Install and configure",id:"install-and-configure",level:2},{value:"Your models",id:"your-models",level:2},{value:"Providing models with <code>Flecks.provide()</code>",id:"providing-models-with-flecksprovide",level:2},{value:"Working with models",id:"working-with-models",level:2},{value:"Persistence",id:"persistence",level:2},{value:"Containerization",id:"containerization",level:2},{value:"Production",id:"production",level:2}];function u(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components},{Details:s}=n;return s||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"database",children:"Database"}),"\n",(0,t.jsxs)(n.p,{children:["flecks provides database connection through ",(0,t.jsx)(n.a,{href:"https://sequelize.org/",children:"Sequelize"})," and database\nserver instances through either flat SQLite databases or ",(0,t.jsx)(n.a,{href:"https://www.docker.com/",children:"Docker"}),"-ized\ndatabase servers."]}),"\n",(0,t.jsx)(n.h2,{id:"install-and-configure",children:"Install and configure"}),"\n",(0,t.jsx)(n.p,{children:"We'll start from scratch as an example. Create a new flecks application:"}),"\n",(0,t.jsx)(a.Z,{pkg:"db_test",type:"app"}),"\n",(0,t.jsxs)(n.p,{children:["Now in your new application directory, add ",(0,t.jsx)(n.code,{children:"@flecks/db"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npx flecks add @flecks/db\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Finally, ",(0,t.jsx)(n.code,{children:"npm start"})," your application and you will see lines like the following in the logs:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"  @flecks/db/server/connection config: { dialect: 'sqlite', storage: ':memory:' } +0ms\n  @flecks/db/server/connection synchronizing... +107ms\n  @flecks/db/server/connection synchronized +2ms\n"})}),"\n",(0,t.jsx)(n.p,{children:"By default, flecks will connect to an in-memory SQLite database to get you started instantly."}),"\n",(0,t.jsx)(n.h2,{id:"your-models",children:"Your models"}),"\n",(0,t.jsx)(n.p,{children:"Astute observers may have noticed a line preceding the ones earlier:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"  @flecks/core/flecks gathered '@flecks/db/server.models': [] +0ms\n"})}),"\n",(0,t.jsx)(n.p,{children:"Let's create a fleck that makes a model so we can get a feel for how it works."}),"\n",(0,t.jsx)(n.p,{children:"First, create a fleck in your application:"}),"\n",(0,t.jsx)(a.Z,{pkg:"content",type:"fleck"}),"\n",(0,t.jsxs)(n.p,{children:["Now, let's hop into ",(0,t.jsx)(n.code,{children:"packages/content/src/index.js"})," and add a hook implementation:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/index.js"',children:"export const hooks = {\n  '@flecks/db/server.models': (flecks) => {\n    const {Model, Types} = flecks.fleck('@flecks/db/server');\n    class Content extends Model {\n      static get attributes() {\n        return {\n          text: {\n            type: Types.TEXT,\n            allowNull: false,\n          },\n        };\n      }\n    };\n    return {\n      Content,\n    };\n  },\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Now, ",(0,t.jsx)(n.code,{children:"npm start"})," your application and you will see that line looks different:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"  @flecks/core/flecks gathered '@flecks/db/server.models': [ 'Content' ] +0ms\n"})}),"\n",(0,t.jsx)(n.p,{children:"Our model is recognized!"}),"\n",(0,t.jsx)(n.p,{children:"Let's add one more model and create an association between them:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/index.js"',children:"export const hooks = {\n  '@flecks/db/server.models': (flecks) => {\n    const {Model, Types} = flecks.fleck('@flecks/db/server');\n\n    class Content extends Model {\n\n      static get attributes() {\n        return {\n          text: {\n            type: Types.TEXT,\n            allowNull: false,\n          },\n        };\n      }\n\n      static associate({Tag}) {\n        this.hasMany(Tag);\n      }\n\n    };\n\n    class Tag extends Model {\n\n      static get attributes() {\n        return {\n          value: {\n            type: Types.STRING,\n            allowNull: false,\n          },\n        };\n      }\n\n      static associate({Content}) {\n        this.belongsTo(Content);\n      }\n\n    };\n    return {\n      Content,\n      Tag,\n    };\n  },\n}\n"})}),"\n",(0,t.jsx)(n.admonition,{title:"Ess-Cue-Ell-ize",type:"tip",children:(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"@flecks/db"})," uses ",(0,t.jsx)(n.a,{href:"https://sequelize.org/",children:"Sequelize"})," under the hood. You can dive into\n",(0,t.jsx)(n.a,{href:"https://sequelize.org/docs/v6/getting-started/",children:"their documentation"})," to learn even more."]})}),"\n",(0,t.jsxs)(n.p,{children:["If you were to ",(0,t.jsx)(n.code,{children:"npm start"}),", you would see the line:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"  @flecks/core/flecks gathered '@flecks/db/server.models': [ 'Content', 'Tag' ] +0ms\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"providing-models-with-flecksprovide",children:["Providing models with ",(0,t.jsx)(n.code,{children:"Flecks.provide()"})]}),"\n",(0,t.jsxs)(n.p,{children:["When building Real","\u2122\ufe0f"," applications we are usually going to need a bunch of models. If we add all\nof them into that one single file, things are going to start getting unwieldy. Let's create a\n",(0,t.jsx)(n.code,{children:"src/models"})," directory in our ",(0,t.jsx)(n.code,{children:"packages/content"})," fleck and add a ",(0,t.jsx)(n.code,{children:"content.js"})," and ",(0,t.jsx)(n.code,{children:"tag.js"})," source\nfiles with the following code:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/models/content.js"',children:"export default (flecks) => {\n  const {Model, Types} = flecks.fleck('@flecks/db/server');\n  return class Content extends Model {\n\n    static get attributes() {\n      return {\n        text: {\n          type: Types.TEXT,\n          allowNull: false,\n        },\n      };\n    }\n\n    static associate({Tag}) {\n      this.hasMany(Tag);\n    }\n\n  };\n};\n"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/models/tag.js"',children:"export default (flecks) => {\n  const {Model, Types} = flecks.fleck('@flecks/db/server');\n  return class Tag extends Model {\n\n    static get attributes() {\n      return {\n        key: {\n          type: Types.STRING,\n          allowNull: false,\n        },\n        value: {\n          type: Types.STRING,\n          allowNull: false,\n        },\n      };\n    }\n\n    static associate({Content}) {\n      this.hasMany(Content);\n    }\n\n  };\n\n};\n"})}),"\n",(0,t.jsx)(n.p,{children:"Notice that this looks very similar to how we defined the models above, but this time we're only\nreturning the classes."}),"\n",(0,t.jsxs)(n.p,{children:["Now, hop over to ",(0,t.jsx)(n.code,{children:"packages/content/src/index.js"})," and let's rewrite the hook implementation:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/index.js"',children:"import {Flecks} from '@flecks/core/server';\n\nexport const hooks = {\n  '@flecks/db/server.models': Flecks.provide(require.context('./models')),\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["We're passing the path to our models directory to ",(0,t.jsx)(n.code,{children:"require.context"})," which is then passed to\n",(0,t.jsx)(n.code,{children:"Flecks.provide"}),". This is completely equivalent to our original code, but now we can add more\nmodels by adding individual files in ",(0,t.jsx)(n.code,{children:"packages/content/src/models"})," and keep things tidy."]}),"\n",(0,t.jsx)(n.admonition,{title:"Continue gathering knowledge",type:"info",children:(0,t.jsxs)(n.p,{children:["For a more detailed treatment of gathering and providing in flecks, see\n",(0,t.jsx)(n.a,{href:"#todo",children:"the gathering guide"}),"."]})}),"\n",(0,t.jsx)(n.h2,{id:"working-with-models",children:"Working with models"}),"\n",(0,t.jsxs)(n.p,{children:["Let's do something with them. Edit ",(0,t.jsx)(n.code,{children:"packages/content/src/index.js"})," again like\nso:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/index.js"',children:"import {Flecks} from '@flecks/core/server';\n\nexport const hooks = {\n  // highlight-start\n  '@flecks/server.up': async (flecks) => {\n    const {Content, Tag} = flecks.db.Models;\n    console.log(\n      'There were',\n      await Content.count(), 'pieces of content',\n      'and',\n      await Tag.count(), 'tags.',\n    );\n  },\n  // highlight-end\n  '@flecks/db/server.models': Flecks.provide(require.context('./models')),\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["We have to configure ",(0,t.jsx)(n.code,{children:"build/flecks.yml"})," so that the database comes up before we try to use it:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",children:"'@db_test/content:./packages/content/src': {}\n'@flecks/build': {}\n'@flecks/core':\n  id: db_test\n'@flecks/db': {}\n// highlight-start\n'@flecks/server':\n  up:\n    - '@flecks/db'\n    - '@db_test/content'\n// highlight-end\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Now, another ",(0,t.jsx)(n.code,{children:"npm start"})," will greet us with this line in the output:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 0 pieces of content and 0 tags.\n"})}),"\n",(0,t.jsx)(n.p,{children:"Not very interesting. Let's add some, but only if there aren't any yet:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/content/src/index.js"',children:"export const hooks = {\n  '@flecks/server.up': async (flecks) => {\n    const {Tag} = flecks.db.Models;\n    console.log(\n      'There were',\n      await Content.count(), 'pieces of content',\n      'and',\n      await Tag.count(), 'tags.',\n    );\n    // highlight-start\n    if (0 === await Content.count()) {\n      await Content.create(\n        {text: 'lorem ipsum', Tags: [{value: 'cool'}, {value: 'trending'}]},\n        {include: [Tag]}\n      );\n      await Content.create(\n        {text: 'blah blah', Tags: [{value: 'awesome'}]},\n        {include: [Tag]}\n      );\n    }\n    console.log(\n      'There are',\n      await Content.count(), 'pieces of content',\n      'and',\n      await Tag.count(), 'tags.',\n    );\n    // highlight-end\n  },\n  '@flecks/db/server.models': Flecks.provide(require.context('./models')),\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Another ",(0,t.jsx)(n.code,{children:"npm start"})," and we see:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 0 pieces of content and 0 tags.\nThere are 2 pieces of content and 3 tags.\n"})}),"\n",(0,t.jsx)(n.p,{children:"Great!"}),"\n",(0,t.jsx)(n.h2,{id:"persistence",children:"Persistence"}),"\n",(0,t.jsx)(n.p,{children:"You'll notice that if you run it again, it will always say"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 0 pieces of content and 0 tags.\nThere are 2 pieces of content and 3 tags.\n"})}),"\n",(0,t.jsx)(n.p,{children:"What's up with that? Remember in the beginning:"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsx)(n.p,{children:"By default, flecks will connect to an in-memory SQLite database to get you started instantly."}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["This means that the database will only persist as long as the life of your application. When you\nrestart it, you'll get a fresh new database every time. It was ",(0,t.jsx)(n.strong,{children:"quick to get started"})," developing,\nbut this isn't very helpful for any real purpose. Let's make a change to our ",(0,t.jsx)(n.code,{children:"build/flecks.yml"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",metastring:'title="build/flecks.yml"',children:"'@db_test/content:./packages/content/src': {}\n'@flecks/build': {}\n'@flecks/core':\n  id: db_test\n'@flecks/db': {}\n// highlight-start\n'@flecks/db/server':\n  database: './persistent.sql'\n// highlight-end\n'@flecks/server': {}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Now ",(0,t.jsx)(n.code,{children:"npm start"})," again. You'll see our old familiar message:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 0 pieces of content and 0 tags.\nThere are 2 pieces of content and 3 tags.\n"})}),"\n",(0,t.jsxs)(n.p,{children:["This time though, our application wrote the SQLite database to disk at ",(0,t.jsx)(n.code,{children:"./persistent.sql"}),". If we\ngive it one more go, we'll finally see what we expect:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 2 pieces of content and 3 tags.\nThere are 2 pieces of content and 3 tags.\n"})}),"\n",(0,t.jsx)(n.p,{children:"A persistent database!"}),"\n",(0,t.jsx)(n.h2,{id:"containerization",children:"Containerization"}),"\n",(0,t.jsxs)(n.p,{children:["Sure, our database is persistent... kinda. That ",(0,t.jsx)(n.code,{children:"persistent.sql"})," file is a bit of a kludge and\nisn't much of a long-term (or production) solution. Let's remove it:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"rm persistent.sql\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Our small-core philosophy means that you don't pay for spinning up a database by default. However,\nit's trivial to accomplish a ",(0,t.jsx)(n.em,{children:'"real"'})," database connection if you have Docker installed on your\nmachine."]}),"\n",(0,t.jsxs)(s,{children:[(0,t.jsx)("summary",{children:"How do I know if I have Docker running on my machine?"}),(0,t.jsx)(n.p,{children:"A decent way to test if your machine is ready to continue with this guide is to run the following\ncommand:"}),(0,t.jsx)(n.p,{children:(0,t.jsx)(n.code,{children:"docker run -e POSTGRES_PASSWORD=password postgres"})}),(0,t.jsx)(n.p,{children:"if the command appears to spin up a database, you're in good shape!"}),(0,t.jsxs)(n.p,{children:["If not, follow the ",(0,t.jsx)(n.a,{href:"https://docs.docker.com/engine/install/",children:"Docker installation documentation"}),"\nbefore proceeding."]})]}),"\n",(0,t.jsx)(n.p,{children:"Let's add another fleck to our project:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npx flecks add -d @flecks/docker\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Configure ",(0,t.jsx)(n.code,{children:"build/flecks.yml"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",metastring:'title="build/flecks.yml"',children:"'@db_test/content:./packages/content/src': {}\n'@flecks/build': {}\n'@flecks/core':\n  id: db_test\n'@flecks/db': {}\n// highlight-start\n'@flecks/db/server':\n  database: db\n  dialect: postgres\n  password: THIS_PASSWORD_IS_UNSAFE\n  username: postgres\n// highlight-end\n'@flecks/docker': {}\n// highlight-start\n'@flecks/server':\n  up:\n    - '@flecks/docker'\n    - '@flecks/db'\n    - '@db_test/content'\n// highlight-end\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Notice that we configured ",(0,t.jsx)(n.code,{children:"@flecks/server.up"})," to make sure to enforce a specific order in which\nour server flecks come up: first ",(0,t.jsx)(n.code,{children:"@flecks/docker"})," to spin up the database, then\n",(0,t.jsx)(n.code,{children:"@flecks/db"})," to connect to the database, and finally our ",(0,t.jsx)(n.code,{children:"@db_test/content"})," fleck to interact with\nthe database. This is important!"]}),"\n",(0,t.jsxs)(n.p,{children:["Now ",(0,t.jsx)(n.code,{children:"npm start"})," will reveal the following message in the logs:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"  @flecks/server/entry Error: Please install pg package manually\n"})}),"\n",(0,t.jsx)(n.p,{children:"Pretty straightforward how to proceed:"}),"\n",(0,t.jsx)(l.Z,{pkg:"pg"}),"\n",(0,t.jsxs)(n.p,{children:["Remember, ",(0,t.jsx)(n.strong,{children:"small core"}),"! ","\ud83d\ude04"," Now ",(0,t.jsx)(n.code,{children:"npm start"})," again and you will see some new lines in the\nlogs:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"  @flecks/docker/container creating datadir '/tmp/flecks/flecks/docker/sequelize' +0ms\n  @flecks/docker/container launching: docker run --name flecks_sequelize -d --rm -p 5432:5432 -e POSTGRES_USER=... -e POSTGRES_DB=... -e POSTGRES_PASSWORD=... -v /tmp/flecks/flecks/docker/sequelize:/var/lib/postgresql/data postgres +0ms\n  @flecks/docker/container 'sequelize' started +372ms\n  @flecks/db/server/connection config: { database: 'db', dialect: 'postgres', host: undefined, password: '*** REDACTED ***', port: undefined, username: 'postgres' } +0ms\n  @flecks/db/server/connection synchronizing... +2s\n  @flecks/db/server/connection synchronized +3ms\n"})}),"\n",(0,t.jsx)(n.p,{children:"and of course, we see:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 0 tags.\nThere are 2 tags.\n"})}),"\n",(0,t.jsxs)(n.p,{children:["because we just created a new postgres database from scratch just then! Kill the application and\nrun ",(0,t.jsx)(n.code,{children:"npm start"})," one more time and then you will see what you expect:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"There were 2 tags.\nThere are 2 tags.\n"})}),"\n",(0,t.jsx)(n.p,{children:"Awesome, we have a connection to a real postgres database!"}),"\n",(0,t.jsxs)(s,{children:[(0,t.jsx)("summary",{children:"Where is the docker container?"}),(0,t.jsx)(n.p,{children:"You may notice that the first time you start your application there is a delay while Docker spins\nup your new database server. This is normal. You may have also noticed that subsequent runs speed\nup to near-instantaneous. This is also normal!"}),(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"@flecks/docker"})," runs your container in a manner that outlives your application. If you kill your\napplication and then run:"]}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"docker ps\n"})}),(0,t.jsx)(n.p,{children:"You will see a line for your postgres database looking something like:"}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:'CONTAINER ID   IMAGE     COMMAND                 CREATED        STATUS        PORTS                                      NAMES\n<SOME_ID>      postgres  "docker-entrypoint.s\u2026"  5 minutes ago  Up 5 minutes  0.0.0.0:5432->5432/tcp, :::5432->5432/tcp  db_test_sequelize\n'})}),(0,t.jsxs)(n.p,{children:["You'll see under the ",(0,t.jsx)(n.code,{children:"NAMES"})," column heading, there is an entry called ",(0,t.jsx)(n.code,{children:"db_test_sequelize"}),". That's\nour database! You can always"]}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"docker kill db_test_sequelize\n"})}),(0,t.jsx)(n.p,{children:"to free up any resources being used. flecks keeps the containers running so that you get a nice\nfast application start."}),(0,t.jsx)(n.admonition,{title:"What's in a name?",type:"note",children:(0,t.jsxs)(n.p,{children:["The container name is based off of ",(0,t.jsx)(n.code,{children:"@flecks/core.id"})," which by default is ",(0,t.jsx)(n.code,{children:"flecks"}),". If you change\nyour application's ID, the container name will be different!"]})})]}),"\n",(0,t.jsx)(n.h2,{id:"production",children:"Production"}),"\n",(0,t.jsx)(n.p,{children:"Sure, spinning up a database like magic is spiffy for development, but you probably want to be a\nlittle less freewheeling on your production server."}),"\n",(0,t.jsx)(n.p,{children:"Build the application we've built so far:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"npm run build\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Then, take a look in the ",(0,t.jsx)(n.code,{children:"dist/server"})," directory. You'll see a file there called\n",(0,t.jsx)(n.code,{children:"docker-compose.yml"}),". ",(0,t.jsx)(n.code,{children:"@flecks/docker"})," automatically emits this file when you build your\napplication for production to make container orchestration easier. Let's take a look:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",metastring:'title="dist/server/docker-compose.yml"',children:"version: '3'\nservices:\n  flecks_app:\n    build:\n      context: ..\n      dockerfile: dist/server/Dockerfile\n    environment:\n      FLECKS_ENV__flecks_docker_server__enabled: 'false'\n      // highlight-next-line\n      FLECKS_ENV__flecks_db_server__host: sequelize\n    volumes:\n      - ../node_modules:/var/www/node_modules\n  // highlight-start\n  sequelize:\n    image: postgres\n    environment:\n      POSTGRES_USER: postgres\n      POSTGRES_DB: db\n      POSTGRES_PASSWORD: THIS_PASSWORD_IS_UNSAFE\n  // highlight-end\n"})}),"\n",(0,t.jsx)(n.p,{children:"Notice our database container is included and already prepopulated with the configuration we\nspecified!"}),"\n",(0,t.jsxs)(n.p,{children:["You can run (after you ",(0,t.jsx)(n.a,{href:"https://docs.docker.com/compose/install/",children:"install Docker Compose"})," if\nnecessary):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"docker-compose -f dist/server/docker-compose.yml up\n"})}),"\n",(0,t.jsx)(n.p,{children:"This demonstrates that your application is now being orchestrated by Docker Compose and is\nchugging right along!"})]})}function p(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(u,{...e})}):u(e)}},3200:(e,n,s)=>{s.d(n,{Z:()=>o});var t=s(9286),r=s(4866),a=s(5162),l=s(5893);function o(e){let{pkg:n,type:s}=e;return(0,l.jsxs)(r.Z,{children:[(0,l.jsx)(a.Z,{value:"npm",label:"npm",children:(0,l.jsxs)(t.Z,{language:"bash",children:["npx @flecks/create-",s," ",n]})}),(0,l.jsx)(a.Z,{value:"yarn",label:"Yarn",children:(0,l.jsxs)(t.Z,{language:"bash",children:["yarn create @flecks/",s," ",n]})}),(0,l.jsx)(a.Z,{value:"bun",label:"Bun",children:(0,l.jsxs)(t.Z,{language:"bash",children:["bun create @flecks/",s," ",n]})})]})}},385:(e,n,s)=>{s.d(n,{Z:()=>o});var t=s(9286),r=s(4866),a=s(5162),l=s(5893);function o(e){let{pkg:n}=e;return(0,l.jsxs)(r.Z,{children:[(0,l.jsx)(a.Z,{value:"npm",label:"npm",children:(0,l.jsxs)(t.Z,{language:"bash",children:["npm install ",n]})}),(0,l.jsx)(a.Z,{value:"yarn",label:"Yarn",children:(0,l.jsxs)(t.Z,{language:"bash",children:["yarn add ",n]})}),(0,l.jsx)(a.Z,{value:"bun",label:"Bun",children:(0,l.jsxs)(t.Z,{language:"bash",children:["bun install ",n]})})]})}},5162:(e,n,s)=>{s.d(n,{Z:()=>l});s(7294);var t=s(512);const r={tabItem:"tabItem_Ymn6"};var a=s(5893);function l(e){let{children:n,hidden:s,className:l}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,t.Z)(r.tabItem,l),hidden:s,children:n})}},4866:(e,n,s)=>{s.d(n,{Z:()=>v});var t=s(7294),r=s(512),a=s(2466),l=s(6550),o=s(469),i=s(1980),c=s(7392),d=s(12);function h(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:n,children:s}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return h(e).map((e=>{let{props:{value:n,label:s,attributes:t,default:r}}=e;return{value:n,label:s,attributes:t,default:r}}))}(s);return function(e){const n=(0,c.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,s])}function p(e){let{value:n,tabValues:s}=e;return s.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:s}=e;const r=(0,l.k6)(),a=function(e){let{queryString:n=!1,groupId:s}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!s)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return s??null}({queryString:n,groupId:s});return[(0,i._X)(a),(0,t.useCallback)((e=>{if(!a)return;const n=new URLSearchParams(r.location.search);n.set(a,e),r.replace({...r.location,search:n.toString()})}),[a,r])]}function g(e){const{defaultValue:n,queryString:s=!1,groupId:r}=e,a=u(e),[l,i]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:s}=e;if(0===s.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:s}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${s.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=s.find((e=>e.default))??s[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:a}))),[c,h]=f({queryString:s,groupId:r}),[g,m]=function(e){let{groupId:n}=e;const s=function(e){return e?`docusaurus.tab.${e}`:null}(n),[r,a]=(0,d.Nk)(s);return[r,(0,t.useCallback)((e=>{s&&a.set(e)}),[s,a])]}({groupId:r}),x=(()=>{const e=c??g;return p({value:e,tabValues:a})?e:null})();(0,o.Z)((()=>{x&&i(x)}),[x]);return{selectedValue:l,selectValue:(0,t.useCallback)((e=>{if(!p({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);i(e),h(e),m(e)}),[h,m,a]),tabValues:a}}var m=s(2389);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=s(5893);function j(e){let{className:n,block:s,selectedValue:t,selectValue:l,tabValues:o}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,a.o5)(),d=e=>{const n=e.currentTarget,s=i.indexOf(n),r=o[s].value;r!==t&&(c(n),l(r))},h=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const s=i.indexOf(e.currentTarget)+1;n=i[s]??i[0];break}case"ArrowLeft":{const s=i.indexOf(e.currentTarget)-1;n=i[s]??i[i.length-1];break}}n?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":s},n),children:o.map((e=>{let{value:n,label:s,attributes:a}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>i.push(e),onKeyDown:h,onClick:d,...a,className:(0,r.Z)("tabs__item",x.tabItem,a?.className,{"tabs__item--active":t===n}),children:s??n},n)}))})}function b(e){let{lazy:n,children:s,selectedValue:r}=e;const a=(Array.isArray(s)?s:[s]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===r));return e?(0,t.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function y(e){const n=g(e);return(0,k.jsxs)("div",{className:(0,r.Z)("tabs-container",x.tabList),children:[(0,k.jsx)(j,{...e,...n}),(0,k.jsx)(b,{...e,...n})]})}function v(e){const n=(0,m.Z)();return(0,k.jsx)(y,{...e,children:h(e.children)},String(n))}}}]);