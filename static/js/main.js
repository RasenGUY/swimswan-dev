// main js for the new new world website
import * as f from "./functions.js";
// import * as g from "./gmap.js";
// import * as c from "./carousel.js";
// import * as gal from "./gallery.js";
import * as an from "./animations.js";


// function to be run after the whole page is loaded 
window.onload = ( ()=> {

    // menu-mobile-animation
    const burger = document.querySelector("#burger .burger-wrapper");
    const bottomLinks = document.querySelector("#mobile-bottom .nav-links");
    burger.addEventListener("click", () => {
        // variables to animate 
        const burgerBars = burger.querySelectorAll('.burger-wrapper > div');
        
        // animate burger
        burgerBars.forEach(bar => {
            bar.classList.toggle('animate');
        })
        // animate nav-links
        bottomLinks.classList.toggle('animate');
        
    });
    
    // translations
    const transItems = document.querySelectorAll(".translate");
    const transBtns = document.querySelectorAll('#lang-dropdown ul li');  
    const transEng = document.querySelector('#trans-eng');
    const transViet = document.querySelector('#trans-viet');

    // translations  
    transBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            // replace innerHTML of els with translated Text 
            transItems.forEach(el => {
                let tempTrans = el.innerHTML;
                el.innerHTML = el.dataset.translation;
                el.dataset.translation = tempTrans;                
            })
            transEng.classList.toggle('trans-off');
            transEng.classList.toggle('trans-on');
            transViet.classList.toggle('trans-on');
            transViet.classList.toggle('trans-off');
        })
    })

    // animations
    const sel = ".anim"
    const els = document.querySelectorAll(sel);
    const baseSet = {
        duration: 0.75,
        ease: "circ.inOut",
        clearProps: true, 
        scrollTrigger: {
            // toggleClass: "nav-reveal",
            scrub: true,
            start: "250 150",
            // end: "+=600 +=300",
            // once: true, 
            markers: true,
        }
    }

    const animation = new an.Animation(baseSet);
    animation.animInit(els, sel); 

    // animate animals on main screen
    // const animBtn = document.querySelector("#arrow");
    const orbit = document.querySelector(".orbit");
    const waterBubble = document.querySelector(".orbit #water-bubble");
    const turtleImg = document.querySelector(".icon-path #turtle");
    const dolphinImg = document.querySelector(".icon-path #dolphin");
    const orcaImg = document.querySelector(".icon-path #orca");
    var currentAngle = 0; 
    
    // add onclick event
    // animBtn.addEventListener("click", ()=>{
    //     currentAngle += 90; 

    //     // select parent
    //     orbit.style.transform  = "rotate(" + currentAngle + "deg)"; 
    //     waterBubble.style.transform  = "rotate(-" + currentAngle + "deg)"; 
    //     turtleImg.style.transform  = "rotate(-" + currentAngle + "deg)"; 
    // })
    
    const animObj  = {
        imgSrc: 'static/images/svg/compressed/', 
        icons: {
            sel: ["#icon-turtle", "#icon-dolphin", "#icon-orca", "#icon-hidden"]
        }, 
        arrows: {
            sel: ["#arrows-left", "#arrows-right"]
        },
        orbit: {
            sel: ".orbit"
        }, 
        bubble: {
            sel: ".orbit #water-bubble"
        } 
    }
    an.animate(animObj);
});


