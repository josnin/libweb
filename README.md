# libweb is a library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

* Template syntax
* Data binding
* Event handling
* No Virtual DOM


## Data Binding
### JS
```js
import { LWElement } from 'libweb.js';

class BindingComponent extends LWElement { 

  __reactive = { username: 'darling' };
  __template = `<input data-bind="username" type="text" />
              <div>Hello {username}</div>`

}

customElements.define('sample-binding', BindingComponent);

```
### index.html
```html
<sample-binding></sample-binding>
```

## Create Events
```js
import { LWElement } from 'libweb.js';

class EventComponent extends LWElement { 

  firstname = 'Johny'; // non reactive variable
  __template.innerHTML = `<button @click="alertMe({firstname})">Click Sample event</button>`

  alertMe(arg) {
   alert(`Hello ${arg}`);
  }
 
}

customElements.define('sample-event', EventComponent);

```
### index.html
```html
<sample-event></sample-event>
```

## Installation 
```
npm install
```

## How to run development server? 
```
cd ~/Documents/libweb/
npm start
```


### Help

Need help? Open an issue in: [ISSUES](https://github.com/josnin/libweb/issues)


### Contributing
Want to improve and add feature? Fork the repo, add your changes and send a pull request.

