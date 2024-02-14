const secs = Array.from(document.querySelectorAll(".sec"))
const url = "https://ender-backend.000webhostapp.com/"
const about = document.getElementById("about")
const contact = document.getElementById("contact")
const skills = document.getElementById("skills") 
const blog = document.getElementById("blog") 
const projects = document.getElementById("projects")
const home = document.getElementById("home")
const modalFold = document.getElementById("modalFold")
const cacheManager = new CacheManager()
const page = window.location.hash.slice(1)
if(page == ""){
    routeManager.navigate("/")
}else if(page == "about"){
    routeManager.navigate("/#about")
}else if(page == "skills"){
    routeManager.navigate("/#skills")
}else if(page == "contact"){
    routeManager.navigate("/#contact")
}else if(page == "blog"){
    routeManager.navigate("/#blog")
}


hoverAnimation(home)
home.addEventListener("click", (e) => {
    e.preventDefault()
    routeManager.navigate("/")
    hoverAnimation(e.currentTarget)
    modalAnimation(e)
})

about.addEventListener("click", async (e) => {
   runAbout(e)
})
projects.addEventListener("click", () => {
    window.location.href = "https://enderyaziciprojects.work"
})
contact.addEventListener("click", async (e) => {
    runContact(e)
})
skills.addEventListener("click", async (e) => {
    runSkills(e)
})
blog.addEventListener("click", async (e) => {
    runBlog(e)
})
document.getElementById("close").addEventListener("click", () => {
    modalFold.classList.add("reverse")
})
modalFold.addEventListener("animationend", () => {
    if(modalFold.classList.contains("reverse")){
        modalFold.classList.remove("reverse")
        setTimeout(() => {
            modalFold.style.display = "none"
        }, 0);
    }
})
function hoverAnimation(e){
    back.style.transform = "skewX(10deg)"
    let {x,width,height} = e.getBoundingClientRect()
    back.style.width = width + "px";
    back.style.height = height + "px"
    let x2 = e.parentElement.getBoundingClientRect()
    back.style.left = (x-x2.x)-5 + "px"
    e.style.color = "white"
    let other = Array.from(document.querySelectorAll(".btnSkew")).filter(a => a != e)
    other.forEach(e => e.style.color = "black")
    back.ontransitionend = () => back.style.transform = "skewX(0deg)"
}
function modalAnimation(e,blog=false){
    let el = secs.find(a => a.getAttribute("section-id") == e.target.id)
    let others = secs.find(a => a.getAttribute("section-id") != e.target.id && !Array.from(a.classList).includes("d-none"))
    let isBlog = others.getAttribute("section-id") == "blog"
    el.classList.remove("d-none")
    let otherHeight = isBlog ? others.getBoundingClientRect() : others.children[0].getBoundingClientRect()
    let elHeight = el.children[0].getBoundingClientRect()
    let anim = others.animate([
        { height: otherHeight.height+"px" },
        { height: '0px' }
      ], {
        duration: 1000,
        fill:"forwards",
        easing:"ease-in"
    })
    anim.onfinish = () => others.classList.add("d-none")
    others.onanimationend = () => alert("hello")
    
    el.animate([
        { height: '0px' },
        { height: blog ? window.innerHeight-100+"px" : elHeight.height +"px" }
      ], {
        duration: 1000,
        fill:"forwards",
        easing:"ease-out"
    });
}

async function get(link){
    try {
        let response = await fetch(url+link,{
            method: 'GET',
        })
        if (response.ok) {
            return await response.json()
        } else if(response.status === 404) {
            return Promise.reject('error 404')
        } else {
            return Promise.reject('some other error: ' + response.status)
        }
    } catch (error) {
        console.log('error is', error)
    }
    
}
async function getFull(link){
    try {
        let response = await fetch(link,{
            method: 'GET',
        })
        if (response.ok) {
            return await response.json()
        } else if(response.status === 404) {
            return Promise.reject('error 404')
        } else {
            return Promise.reject('some other error: ' + response.status)
        }
    } catch (error) {
        console.log('error is', error)
    }
    
}

