let runCache = async (key) => {
    let n = null
    if(cacheManager.has(key)){
        n = cacheManager.get(key)
    }else{
        n = await get(key)
        cacheManager.set(key,n)
    }
    return n
}
async function runAbout(e){
    const event = e
    about.innerHTML = `<div class="lds-dual-ring"></div>`
    event.preventDefault()
    
    let n = await runCache("about")
    document.getElementById("dataAbout").innerHTML = n.short
    about.innerHTML = `About`
    hoverAnimation(event.target)
    modalAnimation(event)
    history.pushState({},'',"/#about")
    // window.routeManager.navigate("/about")
}
async function runContact(e){
    const event = e
    contact.innerHTML = `<div class="lds-dual-ring"></div>`
    event.preventDefault()
   
    let n = await runCache("contact")
    document.getElementById("github").href = n.github
    document.getElementById("twitter").href = n.twitter
    document.getElementById("codepen").href = n.codepen
    document.getElementById("linkedin").href = n.linkedin
    contact.innerHTML = `Contact`
    hoverAnimation(event.target)
    modalAnimation(event)
    history.pushState({},'',"/#contact")
    // window.routeManager.navigate("/contact")
}

async function runSkills(e){
    const event = e
    skills.innerHTML = `<div class="lds-dual-ring"></div>`
    event.preventDefault()

    const n = await runCache("skills")
    document.getElementById("JSbar").style.width = n.js + "%"
    document.getElementById("PHPbar").style.width = n.php + "%"
    document.getElementById("HTMLbar").style.width = n.html + "%"
    document.getElementById("CSSbar").style.width = n.css + "%"
    document.getElementById("SQLbar").style.width = n.sql + "%"
    skills.innerHTML = `Skills`
    hoverAnimation(event.target)
    modalAnimation(event)
    history.pushState({},'',"/#skills")
    // window.routeManager.navigate("/skills")
}

async function runBlog(e){
    document.getElementById("blogSec").innerHTML = ""
    blog.innerHTML = `<div class="lds-dual-ring"></div>`
    e.preventDefault()
    const event = e
    const n = await runCache("")
    for(let i of n){
        let blogDiv = document.createElement("div")
        blogDiv.style.cursor = "pointer"
        let h2 = document.createElement("h2")
        let short = document.createElement("p")
        let date = document.createElement("p")
        h2.innerHTML = i.head
        h2.style.marginBottom = "20px"
        date.innerText =  i.date
        blogDiv.style.textAlign = "left"
        short.innerHTML = i.short
        blogDiv.appendChild(h2)
        blogDiv.appendChild(date)
        blogDiv.appendChild(short)
        blogDiv.style.borderBottom = "1px solid black"
        blogDiv.style.marginBottom = "15px"
        blogDiv.style.paddingBottom = "10px"
        document.getElementById("blogSec").appendChild(blogDiv)
        blogDiv.addEventListener("click", async (e) => {
            document.getElementById("content").innerHTML = ""
            modalFold.style.display = "block"
            let res = await getFull(i.link)
            let con = document.createElement("div")
            let h1 = document.createElement("h1")
            h1.style.marginBottom="20px"
            h1.innerText = res.head
            let p = document.createElement("p")
            p.innerHTML = res.short
            con.appendChild(h1)
            con.appendChild(p)
            document.getElementById("content").appendChild(con)

        })
    }
    blog.innerHTML = `Blog`
    hoverAnimation(event.target)
    modalAnimation(event, true)
    history.pushState({},'',"/#blog")
}