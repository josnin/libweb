# libweb is a library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

* Template syntax similar with modern Frontend framework
* Data binding
* Event handling
* No Virtual DOM


## Data Binding
### JS
```js
import {  
  LibWeb
} from 'libweb';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="username" type="text" />
<div>Hello {username}</div>`

class DataBindingComponent extends HTMLElement { 

  constructor() {
    super();
    const lw = new LibWeb(this, template);

    // create a reactive variable
    this.reactive = lw.makeReactive(
      { 
        username: 'darling',        
      }
    )
  }
 
}

customElements.define('sample-binding', DataBindingComponent);

```
### index.html
```html
<sample-binding></sample-binding>
```

## Create Events
```js
import {  
  LibWeb
} from 'libweb';


const template = document.createElement('template');
template.innerHTML = `
<button @click="alertMe({firstname})">Click Sample event</button>`

class SampleEventComponent extends HTMLElement { 

  firstname = 'Johny'; // non reactive variable

  constructor() {
    super();
    const lw = new LibWeb(this, template);    
  }
  
  alertMe(arg) {
   alert(`Hello ${arg}`);
  }
 
}

customElements.define('sample-event', SampleEventComponent);

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

