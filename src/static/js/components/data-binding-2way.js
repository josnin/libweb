const template = document.createElement('template');
template.innerHTML = `
<div>
<input data-bind="username" type="text" />
</div> 
<div data-bind="username">{username} This is ates???</div>
<div data-bind="username">{username} This is ates???</div>
<div data-bind="username">{username} This is ates??? {username}</div>
<button data-bind="username">Click me?</button>
`


class DataBinding2Way extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.testproxy = this.reactive(
        { username:'whatever?'},
      );

      // add even listener to simulate 
      let el1 = this.shadowRoot.querySelectorAll("[data-bind]");
      el1.forEach((el) => {
        let propToBind = el.getAttribute("data-bind");
        if (el.type === "text") {
          el.addEventListener("input", (e) => {
            this.testproxy[propToBind] = e.target.value;  
          });
        } else {
         el.addEventListener("click", (e) => {
            this.testproxy[propToBind] = 'default2'
          });
        }
      });
      // add even listener to simulate 

      this.replaceVariableOnLoad()

    }

    replaceVariableOnLoad() {
      let el1 = this.shadowRoot.querySelectorAll("[data-bind]");
      el1.forEach((el) => {
        el.innerHTML = el.innerHTML.replaceAll(`{username}`, `${this.testproxy.username}<!--{username}-->`)
      })
    }

    reactive(obj) {
      // react when there is a changes in value
      let el1 = this.shadowRoot.querySelectorAll("[data-bind]");
      const handler = {
        get: (obj, prop) => {
          return obj[prop] ;
        },
        set: (obj, prop, value) => {
          el1.forEach((el) => {
            if (el.getAttribute("data-bind") == prop) {
              if (el.type && (el.type === "text" || el.type === "textarea")) {
                el.value = value;
              } else if (!el.type) {

                // interpolate
                el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{username}-->`, `${value}<!--{username}-->`)
              }
            }
          })
          obj[prop] = value;
          return true; 
        }
      };

      return new Proxy(obj, handler);
    }

}

customElements.define('data-binding-2way', DataBinding2Way);
