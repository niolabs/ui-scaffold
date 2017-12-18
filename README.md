# niolabs<sup>&reg;</sup> UI Scaffold

This scaffold is the easiest way to quickly connect a UI to your pubkeeper-powered nio system. It is provided as a starting point to get you up and running quickly.

The niolabs UI Scaffold is made available under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0) , the boilerplate of which is listed at the bottom of this ReadMe.

---

### what's in the box

- niolabs

    - [niolabs ui-kit](https://uikit.niolabs.com/) for components and styles
    - [niolabs pubkeeper](https://niolabs.com/product/pubkeeper) for publishing and subscribing to topics

- third party software (click to review each library's licensing)
    - [ReactJS](https://reactjs.org/) site scaffold
    - [react-router](https://reacttraining.com/react-router/) for navigation
    - [webpack 3](https://webpack.js.org/) module bundling and development webserver
    - [auth0](https://auth0.com/) for securing the site (optional, default true)

---

### configuration

- in config.js, add your pubkeeper and websocket credentials
  - Open the <strong>System Designer</strong> in a browser: <a href="https://designer.n.io/" target="_blank">https://designer.n.io/</a>
  - Select your system in the left hand nav.
    - To create your first system, <a href="https://docs.n.io/getting_started/in_the_cloud.html" target="_blank">follow the instructions here</a>
  - Click <strong>Edit <i className="fa fa-edit" /></strong> button in the system toolbar to open its configuration.
  - Copy the value for <strong>hostname</strong> into PK_HOST, the value for <strong>token</strong> into PK_JWT.
  - Copy the value for <strong>hostname</strong> into WS_HOST, but swap the word 'pubkeeper' for 'websocket'.
- add your auth0 account and url if authentication is desired
  - optionally, you can set APP_REQUIRES_LOGIN to false

---

### getting started

- `npm install --save`
- `npm start`
- visit the site at https://0.0.0.0:3000

---

### Apache 2.0 License

Copyright 2017 n.io innovation, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


