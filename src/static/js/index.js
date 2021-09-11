import HomeView from './views/HomeView.js';

console.log('Load static js')

const navTo = url => {
    history.pushState(
      null,
      null,
      url
    );
    router();
}

const router = async () => {

  const routes = [
    { path: "/", view: HomeView },
    { path: "/cart", view: () => console.log('Cart page') },
    { path: "/checkout", view: () => console.log('Checkout page') }
  ];

  const potentialMatches = routes.map(route => {
    return {
        route: route,
        isMatch: location.pathname === route.path
    };
  });

  let match = potentialMatches.find(res => res.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true
    }
  }

  const view = new match.route.view();

  document.querySelector("#app").innerHTML = await view.getHTML();

};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navTo(e.target.href);
    }
  })
  router();
})