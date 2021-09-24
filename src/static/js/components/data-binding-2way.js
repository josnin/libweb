const template = document.createElement('template');
template.innerHTML = `
<div>
<input data-bind="username" type="text" />
</div> 
<div data-bind="username">{username} This is ates???</div>
<div data-bind="username">{username} This is ates???</div>
<div data-bind="username">{username} This is ates??? {username}</div>
<div data-bind="username">{username} This is ates??? {lastname}</div>
<button data-bind="username">Click me?</button>
`


class DataBinding2Way extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));


      // add even listener to simulate 
      let el1 = this.shadowRoot.querySelectorAll("[data-bind]");
      el1.forEach((el) => {
        let propToBind = el.getAttribute("data-bind");
        if (el.type === "text") {
          el.addEventListener("input", (e) => {
            this.properties[propToBind] = e.target.value;  
          });
        } else {
         el.addEventListener("click", (e) => {
            this.properties[propToBind] = 'default2'
          });
        }
      });
      // add even listener to simulate 

    }

    replaceVariableOnLoad() {
      if (this.properties) {
        let el1 = this.shadowRoot.querySelectorAll("[data-bind]");
        el1.forEach((el) => {
          console.log(this.properties)
          for (let [k, v] of Object.entries(this.properties)) {
            // {username} > johnny<!--{username}-->
            el.innerHTML = el.innerHTML.replaceAll(`{${k}}`, `${v}<!--{${k}}-->`)
          }
        })

      }
    }

    connectedCallback() {
      this.replaceVariableOnLoad()
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
                for (let [k, v] of Object.entries(this.properties)) {
                  // {username} > johny<!--{username}-->
                  el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${k}}-->`, `${value}<!--{${k}}-->`)
                }
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

class DataBinding2Way1 extends DataBinding2Way {
    constructor() {
      super();

      this.properties = this.reactive(
        { 
          username:'whatever????',
          lastname: 'Javascript???',
        },
      );
    }


}

customElements.define('data-binding-2way', DataBinding2Way1);
