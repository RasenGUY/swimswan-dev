// import modules
import * as f from "./functions.js";

// ----------------- animations -----------------
export function Animation (baseSet) {
    
    this.baseSet = baseSet, // main settings
    // animation function
    this.createAnim = (obj) => {
        // creates gsap tween settings and initializes instances of these tweens //
        
        // set scrollTrigger trigger
        if (obj.scrollTrigger == null ){ // create empty object for scrollTrigger settings if not provided
            obj.scrollTrigger = {};
        };

        obj.scrollTrigger.trigger = obj.sel; 
        (()=>{
            return new Promise((resolve)=>{

                if (obj.type != "scroll"){
                    
                    let mergedBase = {};
                    if (obj.useBase === false){ // use base settings set in main js
                        
                        mergedBase = Object.assign({}, this.baseSet);

                        if (obj.base !== null){ // update base settings if provided inline

                            mergedBase = Object.assign({}, mergedBase, obj.base);
                            
                            if (obj.hasTrigger === false ){ // use scroll trigger set in main js and update if provided  
                                mergedBase.scrollTrigger = Object.assign({}, mergedBase.scrollTrigger, obj.scrollTrigger);
                                
                            } else { // replace scrollTrigger with the one set inline                    
                                
                                // replace scrollTrigger settings
                                mergedBase.scrollTrigger = obj.scrollTrigger;                                
                            }

                            
                        } else { // use baseSettings from main js
                            
                            if (obj.hasTrigger === false){ // use scrollTrigger settings from baseSettings
                                
                                mergedBase.scrollTrigger = Object.assign({}, mergedBase.scrollTrigger, obj.scrollTrigger); // update scrolltrigger if present

                            } else { // replace scrollTrigger of base from main, don't update base

                                mergedBase.scrollTrigger = obj.scrollTrigger; // replace scrollTrigger settings
                            }
                        }

                    } else { // only use baseSettings set inline 

                        mergedBase = Object.assign({}, obj.base);
                        mergedBase.scrollTrigger = Object.assign({}, this.baseSet.scrollTrigger); 

                        if (obj.hasTrigger === false){ // update scrollTrigger settings use inlineSet
                            
                            mergedBase.scrollTrigger = Object.assign({}, mergedBase.scrollTrigger, obj.scrollTrigger); // updates scrollTrigger settings   

                        } else { // replace scrollTrigger set use inline set 
                            
                            mergedBase.scrollTrigger = obj.scrollTrigger; // replace scrollTrigger settings                
                        }
                    }
                    resolve(mergedBase);
                }
            })
        })().then(settings => {

            // initiate animations
            if (obj.type === "to"){ 
                gsap.to(obj.sel, Object.assign(settings, obj.set));
            }
            if (obj.type === "from"){
                gsap.from(obj.sel, Object.assign(settings, obj.set));
            }
            if (obj.type === "fromTo"){                        
                gsap.fromTo(obj.sel, obj.set.from, Object.assign(settings, obj.set.to));
            }
        })
        if (obj.type === "scroll"){ // create ScrollTo tween
            // scrollTo tween requires its own base settings set inline scrollTo settings don't have to be included but will be used when set inline

            const navBtn = document.querySelector(obj.sel);

            if (navBtn.dataset.href !== undefined){ // automatically add scrollTo target
                
                if (obj.set == null){ // create an object for scrollTo settings if it does'nt exist yet
                    obj.set= {};
                }

                // set scroll target
                obj.set.y = navBtn.dataset.href;
            }

            if (obj.start !== null){ //set start position if exists
                 
                // listen to click event 
                navBtn.addEventListener('click', ()=> {
                    gsap.to(obj.start, Object.assign({scrollTo: obj.set}, obj.base));
                })
                
            } else {
                
                // listen to click event 
                navBtn.addEventListener("click", ()=>{
                    gsap.to(window, Object.assign({scrollTo: obj.set}, obj.base));
                })
            }
        }
    };

    this.stringConvert = (input) => { // converts strings into numbers, floats and bools
        
        // check for bools
        if (input === "true"){
            return Boolean(input);

        } else if (input === "false"){
            return !Boolean(input);
        } 
        // check for numbers or floats
        else if (!isNaN(+input)){
            return +input;

        // return string if no boolean number or float
        } else {
            return input; 
        }
        
    }    
    this.animInit = (els, sel) => { // initiates animations on website, selects targets create animation settings and tween instances
        
        var animN = 0; 
        // get elements class names in list and split animation settings and type from the list into arrays of settings and animation type
        els.forEach((el) => {
            
            // transform class selector into settings obj for animation
            (()=>{
                return new Promise((resolve) => {

                    let animObj = {
                        useBase: false, // if true then only use inline base settings for tween
                        hasTrigger: false, // if true then use Scroll trigger settings inline
                        start: null,
                        base: null,
                        scrollTrigger: null,
                        set: {},
                    }; 
                    
                    // create animation selector for gsap
                    el.className += " anim-" + String(animN);
                    animObj.sel = ".anim-" + String(animN); 
                    animN++;

                    for (let classN of el.classList.entries()){
                        
                        if (classN[1].includes("type:")){ // find type of gsap

                            animObj.type = classN[1].split(":")[1];
                        } 
                        if (classN[1].includes("scrollStart:")){ // find scrollStart for scroll type animations

                            animObj.start = split(":")[1];

                        }
                        if (classN[1].includes("hasTrigger:")){ // if true manually set scrollTrigger settings -> default is false
                            
                            animObj.hasTrigger = this.stringConvert(classN[1].split(":")[1]);

                        }
                        if (classN[1].includes("useBase:")){ // if true add set base settings -> default is false
                            
                            animObj.useBase = this.stringConvert(classN[1].split(":")[1]);

                        }
                        if (classN[1].includes("set|")){ // create settings object for animation
                            
                            // create set then add to object 
                            for (let val of classN[1].replace("set|", "").replaceAll("_", " ").split("|")){
                                animObj.set[val.split(':')[0]] = this.stringConvert(val.split(':')[1]);  
                            };
                                        
                        } 
                        if (classN[1].includes("setFrom|")){ // create "From" settings for animation
                            
                            animObj.set.from = {};

                            // create set then add to object 
                            for (let val of classN[1].replace("setFrom|", "").replaceAll("_", " ").split("|")){
                                animObj.set.from[val.split(':')[0]] = this.stringConvert(val.split(':')[1]);  
                            };
                            
                        } 
                        if (classN[1].includes("setTo|")){ // create "To" settings for animation
                            
                            animObj.set.to = {};

                            // create set then add to object 
                            for (let val of classN[1].replace("setTo|", "").replaceAll("_", " ").split("|")){
                                animObj.set.to[val.split(':')[0]] = this.stringConvert(val.split(':')[1]);  
                            };
                        } 
                        if (classN[1].includes("base|")){ // create base settings for animation
                            
                            animObj.base = {};

                            // create set then add to object 
                            for (let val  of classN[1].replace("base|", "").replaceAll("_", " ").split("|")){
                                animObj.base[val.split(':')[0]] = this.stringConvert(val.split(':')[1]);  
                            };
                        } 
                        if (classN[1].includes("scrollTrigger|")){ // create scrollTrigger settings for animation 
                            
                            // create settings for animation 
                            animObj.scrollTrigger = {};

                            // create set then add to object 
                            for (let val of classN[1].replace("scrollTrigger|", "").replaceAll("_", " ").split("|")){
                                animObj.scrollTrigger[val.split(':')[0]] = this.stringConvert(val.split(':')[1]);  
                            };
                        } 
                        
                        else {
                            continue;
                        }    
                    }
                    resolve(animObj)
                })
            })().then(animObj => this.createAnim(animObj)) // create animation

        })

    }
}

export function animate(obj){

    // animation flow -> svg path 
    // needed 
    const path = f.grab(obj.path.sel) // path (use this as the value for the motionPath setting) 
    const [arrowLeft, arrowRight] = obj.arrows.sel.map( arrow => f.grab(arrow) ) // arrows  
    const bubble = f.grab(obj.bubble.sel) // water bubble
    const cards = obj.cards.sel.map(sel => Object.assign({}, {
        el: f.grab(sel),
        position: f.grab(sel).dataset.cardPosition
    })
    )
    const icons = obj.icons.sel.map( // icons 
        sel => Object.assign({}, {
            el: f.grab(sel), // fetch dom el
            animSet: {
                to: {
                    scale: f.grab(sel).dataset.position === "middleRight" ? 1.5 : 1
                },
                base: obj.animset.base,
                motionPath: {
                    path: path,
                    align: path,
                    transformOrigin: "50% 50%",
                    start: setMotionPosition(f.grab(sel)).start, // set start position
                    end: setMotionPosition(f.grab(sel)).end,
                    alignOrigin: [0.5, 0.5] // set start position
                }
            },
            motionPos: {
                rev: {
                    start: null,
                    end: null,
                },
                next: {
                    start: null,
                    end: null
                },
                current: {
                    start: setMotionPosition(f.grab(sel)).start,
                    end: setMotionPosition(f.grab(sel)).end
                }
            },
            position: f.grab(sel).dataset.position
        })
    )
    const weirdBubbles = obj.weirdBubbles.sel.map(
        sel => Object.assign({}, {
            el: f.grab(sel), // fetch dom el
            position: f.grab(sel).dataset.arranged, // fetch position
            gsap: {
                base: obj.animset.weirdB.base,
                scrollT: obj.animset.weirdB.scrollT,
                setTo: {
                    mob: obj.animset.weirdB.setTo.mob
                }
            } 
        })
    )
    f.log(weirdBubbles);
    
    // functions 
    function setMotionPosition(obj){ // create positions for icons 

        if (obj.dataset.position === "top"){
            return {start: 0.375, end: 0.5}; 
        }
        else if (obj.dataset.position === "middleRight"){
            return {start: 0, end: 0.125}; 
        }
        else if (obj.dataset.position === "bottom"){
            return {start: 0.125, end: 0.25};
        }
        else if (obj.dataset.position === "hidden") {
            return {start: .25, end: 0.375};
        }
    };

    function calcPosNext(current, incr){ // calculates the next position to animate to
        return {start: current.end != 0.5 ? current.end : 0, end: current.end != 0.5 ? current.end + incr : (0 + incr)};
    };
    
    function calcPosRev(current, incr){ // calculates the reverse postion to animate to
        return {start: current.end != 0 ? current.end : 0.5, end: current.end != 0 ? current.end - incr : (0.5 - incr) };        
    };

    function calcPos(obj, incr){        
        obj.motionPos.next = calcPosNext(obj.motionPos.current, incr); 
        obj.motionPos.rev = calcPosRev(obj.motionPos.current, incr); 

    }; // calculates and sets new motionpositions of animation icon 

    function setCurrent(obj, next){
        obj.motionPos.current = Object.assign({}, obj.motionPos.current, next); // sets the new current position
    };

    function filterItem(array, pos){ // returns icons with a given data position
        return array.filter(icon => icon.position === pos)[0];
    }; 

    function updatePos(obj, reverse=false, cards=false){ // updates the positions of icons
        if (!reverse){ // cycling right
            if (obj.position === "top"){
                obj.position = "middleRight";
            } else if (obj.position === "middleRight"){
                obj.position = "bottom";
            } else if (obj.position === "bottom"){
                if (cards){
                    obj.position = "top";
                } else {
                    obj.position = "hidden";
                }
            } else if (obj.position === "hidden"){
                obj.position = "top";
            }
        } else { // cycling left 
            if (obj.position === "top"){
                if (cards){
                    obj.position = "bottom"
                } else {
                    obj.position = "hidden";
                }
            } else if (obj.position === "middleRight"){
                obj.position = "top";
            } else if (obj.position === "bottom"){
                obj.position = "middleRight";
            } else if (obj.position === "hidden"){
                obj.position = "bottom";
            }
        } 
    } 

    function addAnimTo(obj, animation){ // update the to animation for gsap
        obj.animSet.to = Object.assign({}, obj.animSet.to, animation);
    }

    function toggleShow(card){
        card.el.classList.toggle("show");
    }

    function scrub(bubble, setTo, trigger){ // initiates animations
        bubble.gsap.scrollT.trigger = trigger;
        obj.animWB(bubble.el, bubble.gsap.base, setTo, bubble.gsap.scrollT);
    };
    
    // add click events to buttons 
    f.event(arrowRight, "click", () => {
        
        // add settings to icon animations
        addAnimTo(filterItem(icons, "top"), {scale: 1.5}); // add scale to settings to top 
        addAnimTo(filterItem(icons, "middleRight"), {scale: 1}); // add scale to settings to middleRight

        // change source of hidden element to bottom 
        filterItem(icons, "hidden").el.href.baseVal = filterItem(icons, "bottom").el.href.baseVal;

        // animate bubble
        gsap.fromTo(bubble, {scale: "1"}, {scale: "-=0.1", ease:Bounce.easeOut, yoyoEase:Power2.easeOut, repeat: 1, duration: 1});

        // animate icons 
        icons.map(icon => obj.animTo(icon.el, icon.animSet.to, icon.animSet.base, Object.assign({}, icon.animSet.motionPath, icon.motionPos.next))); // animate next
        icons.map(icon => setCurrent(icon, icon.motionPos.next)); // then set the new current position to next

        // animate cards
        toggleShow(filterItem(cards, "middleRight")); // remove show from middleRight
        toggleShow(filterItem(cards, "top")); // add show to top
        
        // update positions
        icons.map(icon => calcPos(icon, 0.125)); // calc new next and reverse positions
        icons.map(icon => updatePos(icon)); // update positions to new positions
        cards.map(card => updatePos(card, false, true)); // update to new positions


    }); // click left
    
    f.event(arrowLeft, "click", () => {

        // add settings to icon animations
        addAnimTo(filterItem(icons, "bottom"), {scale: 1.5}); // add scale to settings to top 
        addAnimTo(filterItem(icons, "middleRight"), {scale: 1}); // add scale to settings to middleRight

        // change source of hidden element to top
        filterItem(icons, "hidden").el.href.baseVal = filterItem(icons, "top").el.href.baseVal;

        // animate bubble
        gsap.fromTo(bubble, {scale: "1"}, {scale: "-=0.1", ease:Bounce.easeOut, yoyoEase:Power2.easeOut, repeat: 1, duration: 1});

        // animate icons
        icons.map(icon => obj.animTo(icon.el, icon.animSet.to, icon.animSet.base, Object.assign({}, icon.animSet.motionPath, icon.motionPos.rev))); // animate reverse
        icons.map(icon => setCurrent(icon, icon.motionPos.rev)); // set the new current position to the reverse position

        // animate cards
        toggleShow(filterItem(cards, "middleRight")); // remove show from middleRight
        toggleShow(filterItem(cards, "bottom")); // add show to top

        // update positions
        icons.map(icon => calcPos(icon, 0.125)); // calc new next and reverse positions
        icons.map(icon => updatePos(icon, true)); // update positions to new positions
        cards.map(card => updatePos(card, true, true)); // update to new positions

    }); // click right
    
    // initialize animation 
    icons.map(icon => obj.animTo(icon.el, icon.animSet.to, icon.animSet.base, icon.animSet.motionPath)); // initial animation
    icons.map(icon => calcPos(icon, 0.125)); // initial pos and motionPath update
    toggleShow(filterItem(cards, "middleRight")); // show card

    // animate weird bubble
    

}



    