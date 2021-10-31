# noJS framework
Create [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) w/ Template syntax similar with modern Frontend framework

## Data Binding
### JS
```js
import {  
  noJS
} from 'noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="username" type="text" />
<div>Hello {username}</div>`

class DataBindingComponent extends HTMLElement { 

  constructor() {
    super();
    const nojs = new noJS(this, template);

    // create a reactive variable
    this.reactive = nojs.makeReactive(
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
  noJS
} from 'noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<button @click="alertMe({firstname})">Click Sample event</button>`

class SampleEventComponent extends HTMLElement { 

  firstname = 'Johny'; // non reactive variable

  constructor() {
    super();
    const nojs = new noJS(this, template);    
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
cd /home/{username}/nojsframework/
npm start
```


### Help

Need help? Open an issue in: [ISSUES](https://github.com/josnin/nojsframework/issues)


### Contributing
Want to improve and add feature? Fork the repo, add your changes and send a pull request.

