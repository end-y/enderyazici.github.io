class RouteManager {
    constructor() {
      this.routes = [];
    }
  
    // Yeni bir route ekler
    addRoute(path, handler) {
      this.routes.push({ path, handler });
    }
  
    // URL'e göre ilgili route'u çalıştırır
    navigate(url) {
      const currentRoute = this.routes.find(route => route.path === url);
      if (currentRoute) {
        currentRoute.handler();
      } else {
        console.error("Route not found!");
      }
    }
  }
  
  // Örnek kullanım
  window.routeManager = new RouteManager();
  
  function homeHandler() {
    setTimeout(() => {
      document.getElementById("home").click()
  }, 0);
  }
  
  function aboutHandler(e) {
    setTimeout(() => {
        document.getElementById("about").click()
    }, 0);

  }
  
  function contactHandler(e) {
    setTimeout(() => {
        document.getElementById("contact").click()
    }, 0);
    
  }
  function blogHandler(e) {
    setTimeout(() => {
        document.getElementById("blog").click()
    }, 0);
    
  }
  
  function notFoundHandler() {
    console.log("404 Not Found");
  }
  function skillsHandler(e){
    setTimeout(() => {
        document.getElementById("skills").click()
    }, 0);

  }
  routeManager.addRoute("/", homeHandler);
  routeManager.addRoute("/#about", aboutHandler);
  routeManager.addRoute("/#contact", contactHandler);
  routeManager.addRoute("/#skills", skillsHandler);
  routeManager.addRoute("/#blog", blogHandler);