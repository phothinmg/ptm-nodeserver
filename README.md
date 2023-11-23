## Node Js Dev Server with routes

Simple Node Js native server

![nodeserver](https://raw.githubusercontent.com/altairstudios/nodeserver/master/nodeserver-logo.png)

---

#### Install

```bash
npm i ptm-nodeserver
```

---

#### Usage

```javascript

import devserver from "ptm-nodeserver";

const routes = [
    { route: '/',  path: '.'},// For root path
    { route: '/app',  path: './app'},
    
];
const app = devserver(routes);
const port = 5040;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

```

---