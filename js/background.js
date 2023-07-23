const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;
let {innerHeight,innerWidth} = window 
let bubbleArray = []
let bgBubbles = []
function Bubble(x,y,dX,size,brand = ""){
    this.x = x;
    this.y = y;
    this.dX = dX;
    this.size= size,
    this.color = "#fff"
    this.brand = brand
    this.other = this.size
    this.size = 0
}

let unicodes = {
    "user" : ["\uf007","\uf4fb","\uf504","\uf508"],
    "brands" : ["\uf1cb","\uf09b","\uf099","\uf08c"],
    "skills" : ["\uf457","\uf3b8","\uf13b","\uf13c" ],
    "home" : ["\uf015","\ue3af", "\ue00d","\ue1b0"],
    "blog": ["\uf781","\uf143", "\uf09e","\uf781"]
}

Bubble.prototype.draw = function(text=true) {
    ctx.beginPath()
    ctx.font='16px FontAwesome';
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false)
    ctx.fillStyle = this.color;
    ctx.globalAlpha = "0.85"
    ctx.fill()
    if(this.size > 15 && text){
        ctx.fillStyle = "#EADFDF"
        ctx.fillText(this.brand, this.x,this.y+6);
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
    }
}

Bubble.prototype.update = function(def=true,text=true){
    if(this.x + this.size > canvas.width || this.x - this.size < 0){
        this.dX = -this.dX
    }
    this.x += this.dX
    if(def){
        this.y -= 0.5
    }
    if(this.size != Math.round(this.other)){
        this.size += 1
    }
    if(this.y < -30){
        this.y = window.innerHeight
    }
    this.draw(text)
}
function init(bg=true){
    createBubble()
    if(bg){
        createBg()
    }
}
function createBubble(){
    let {innerWidth,innerHeight} = window 
    bubbleArray = []
    for(let i=0; i<50; i++){
        let s = Math.random()*20;
        let x = Math.random() * (innerWidth-s*2)
        let y = Math.random() * (innerHeight-s*2)
        
        let directionX = (Math.random() * .4) - .2
        bubbleArray.push(new Bubble(x,y,directionX,s,getUnicode())) 
    }
}
function createBg(){
    for(let j=0; j<100; j++){
        let s = Math.random()*20;
        let x = Math.random() * (innerWidth-s*2)
        let y = innerHeight
        let directionX = (Math.random() * .4) - .2
        bgBubbles.push(new Bubble(x,y,directionX,s)) 
    }
}
function getUnicode(type = "home"){
    let number = Math.floor(Math.random()*4)
    return unicodes[type][number]
}
function animate(){
    let {innerWidth,innerHeight} = window 
    requestAnimationFrame(animate)
    ctx.clearRect(0,0,innerWidth,innerHeight)
    for(let i=0; i<bubbleArray.length; i++){
        bubbleArray[i].update()
    }
    for(let i=0; i<bgBubbles.length; i++){
        bgBubbles[i].update(false,false)
    }
}
init()
animate()
home.addEventListener("click", () => {
    bubbleArray.forEach(e => {
        e.brand = getUnicode("home")
        e.size = 0
    })
})

about.addEventListener("click", () => {
    bubbleArray.forEach(e => {
        e.brand = getUnicode("user")
        e.size = 0
    })
})

contact.addEventListener("click", () => {
    bubbleArray.forEach(e => {
        e.brand = getUnicode("brands")
        e.size = 0
    })
})
skills.addEventListener("click", () => {
    bubbleArray.forEach(e => {
        e.brand = getUnicode("skills")
        e.size = 0
    })
})
blog.addEventListener("click", () => {
    bubbleArray.forEach(e => {
        e.brand = getUnicode("blog")
        e.size = 0
    })
})
window.addEventListener("resize", () => {
    let {innerWidth,innerHeight} = window 
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init(false)
})