const secs = Array.from(document.querySelectorAll(".sec"))
hoverAnimation(home)
home.addEventListener("click", (e) => {
    e.preventDefault()
    hoverAnimation(e.currentTarget)
    modalAnimation(e)
})

about.addEventListener("click", (e) => {
    e.preventDefault()
    hoverAnimation(e.currentTarget)
    modalAnimation(e)
})

contact.addEventListener("click", (e) => {
    e.preventDefault()
    hoverAnimation(e.currentTarget)
    modalAnimation(e)
})
skills.addEventListener("click", (e) => {
    e.preventDefault()
    hoverAnimation(e.currentTarget)
    modalAnimation(e)
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
function modalAnimation(e){
    let el = secs.find(a => a.getAttribute("section-id") == e.currentTarget.id)
    let others = secs.find(a => a.getAttribute("section-id") != e.currentTarget.id && !Array.from(a.classList).includes("d-none"))
    el.classList.remove("d-none")
    let otherHeight = others.children[0].getBoundingClientRect()
    let elHeight = el.children[0].getBoundingClientRect()
    let className = getComputedStyle(el.children[0]).margin
    let classNameOther = getComputedStyle(others.children[0]).margin
    console.log(className)
    console.log(classNameOther)
    console.log(el.children[0].getBoundingClientRect())
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
        { height: elHeight.height +"px" }
      ], {
        duration: 1000,
        fill:"forwards",
        easing:"ease-out"
    });
}