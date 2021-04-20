// main js for the new new world website
import * as f from "./functions.js";
// import * as g from "./gmap.js";
// import * as c from "./carousel.js";
// import * as gal from "./gallery.js";
import * as an from "./animations.js";


// function to be run after the whole page is loaded 
window.onload = (()=>{

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

    // on click of vietnam translation 
    transBtns.forEach(btn => {
        btn.addEventListener('click', ()=>{
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
            toggleClass: "nav-reveal",
            // scrub: true,
            start: "250 150",
            // end: "+=600 +=300",
            // once: true, 
            markers: true,
        }
    }

    const animation = new an.Animation(baseSet);
    animation.animInit(els, sel); 
  
});


