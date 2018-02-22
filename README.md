# nio UI Scaffold
The easiest way to create a nio-powered UI is to start with our [UI scaffold](https://github.com/niolabs/ui-scaffold). It gets you up and running in minutes.

---

## What’s in the box

- From niolabs
    - [niolabs ui-kit](https://uikit.niolabs.com/) for components and styles
    - [niolabs pubkeeper](https://niolabs.com/product/pubkeeper) for publishing and subscribing to topics

- Third party software (click to review each library's licensing)
    - [ReactJS](https://reactjs.org/) site scaffold
    - [react-router](https://reacttraining.com/react-router/) for navigation
    - [webpack 3](https://webpack.js.org/) module bundling and development webserver
    - [auth0](https://auth0.com/) for securing the site (optional, default false)

If you’re at all familiar with React, this simple example covers most of what you need to know to get started.

---

## Hello world (what time is it?)

Follow these steps to create a simple UI that can publish to, subscribe to, and display the output of your nio services.

1. In your terminal, clone the UI scaffold, enter the directory, and install dependencies.
    ```
    git clone https://github.com/niolabs/ui-scaffold.git my-project
    cd my-project
    npm i -s
    ```

1. In the root of the project, rename `config.js.example` to `config.js`.

1. Start the project.
    ```
    npm start
    ```

1. Visit the project at https://0.0.0.0:3000.
    - The development web server uses a self-signed certificate, and you may see a warning about the site being insecure. In your local development environment, it is safe to click "Advanced" > "proceed to site anyway."

1. You'll be prompted to log into your **nio** account to choose which Pubkeeper Server your project should use
    - If you see a message saying the application can't find any systems, follow the instructions [here](/system-designer/designer-tasks.html) to create one.

You’ll see a simple UI with a clock that updates every second.

### What’s actually happening?

  - The UI connects to your cloud Pubkeeper server.
  - When the main page renders, it sets a local variable of the current time and sets an interval to update that time every second.
  - The Pubkeeper brewer publishes the time to the topic “ui_scaffold.example_brew”.
  - The Pubkeeper patron subscribes to “ui_scaffold.example_brew” topic, receives the data, and delivers it to the handler `writeDataToOutput`, which sets the local state variable `time` equal to the inbound time.
  - The React `Clock` component from the nio UI Kit then renders itself based on the inbound time.

Sure, you could have just had the timer set the local state variable, but then you wouldn’t have become such an expert at using Pubkeeper.

---

## Going public
The UI Scaffold is set up to make local development fast and easy out of the box. This includes selecting your Pubkeeper Server for you by having you log in.

#### Static Pubkeeper Server

Of course, your **nio** app publishes only to your Pubkeeper server, so you'll want to configure a **Static Pubkeeper Server**:

1. Get your Pubkeeper **hostname** and **token** from your nio-managed cloud-instance:
    1. Open the nio **System Designer** in a browser: https://designer.n.io/.
    1. Select your system in the left-hand navigation.
    1. Click the **edit** button in the contextual toolbar to open its configuration.

1. Open `config.js`
    1. Set `staticPubkeeper` to **true**.
    1. Set `PK_HOST` to your **hostname** value.
    1. Set `PK_JWT` to your **token** value.
    1. Set `WS_HOST` to your **hostname** value, but swap the word 'pubkeeper' for 'websocket'.
        1. e.g.- if your **hostname** is `aaaaa.pubkeeper.nio.works`, use `aaaaa.websocket.nio.works`.

#### Authentication (optional)

By default, the auth0 configuration provided in `config.js` is used to log users into **nio** and fetch their Pubkeeper server details. **This will only work if you're running the site locally, at https://0.0.0.0:3000**.

Once you configure the site to use a **Static Pubkeeper Server**, users won't need to log in.

If you would like to require that users log in to access your app, you can leverage the auth0 authentication engine for that very purpose:

 1. Go to https://auth0.com and **Sign Up**.
 1. Once you complete the signup process, you'll be taken to your dashboard.
 1. Choose Clients > Settings
    1. In `config.js`, replace **webAuth** Domain and Client ID with your own, and set Audience to **false**.
    1. In Auth0, set the Client Type to **Single Page Application**
    1. In Auth0, enter `https://0.0.0.0:3000?authorize=true` into **Allowed Callback URLs**
    1. In Auth0, enter `https://0.0.0.0:3000` into **Allowed Logout URLs**.
        - (You'll want to add your public URL to these boxes before you go live, of course.)

----------------

## What’s next?
The output of any service that shares the same Pubkeeper host and token that you configured above can be consumed by your UI. All you need to do is update the patron’s topic (or add new patrons!), register a handler, and render the data.

The nio UI Kit at [https://uikit.niolabs.com](https://uikit.niolabs.com) is full of components for layout, charts, etc. that can be pulled into any React project that accommodates scss (we use webpack).

Of course, if React isn’t your thing, the Pubkeeper browser client can be used on any site that supports JavaScript:
 ```
 npm i -s @pubkeeper/browser-client
 ```

---

### Apache 2.0 License

Copyright 2017-2018 n.io innovation, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
