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
    const icons = obj.icons.sel.map( // icons 
        sel => Object.assign({}, {
            el: f.grab(sel), // fetch dom el
            id: f.grab(sel).id, // fetch element id
            isHidden: (f.grab(sel).dataset.position) === "hidden" ? true : false, // isHidden
            animSet: {
                to: {
                    scale: 1.15,
                    startAt: {
                        x: f.grab(sel).getClientRects()[0].x,
                        y: f.grab(sel).getClientRects()[0].y
                    }
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
            startPos: {
                old: {
                    x: f.grab(sel).getClientRects()[0].x,
                    y: f.grab(sel).getClientRects()[0].y
                },
                next: {
                    x: null,
                    y: null
                }
            } 
        }))
    
    // functions 
    function setMotionPosition(obj){ // create positions for icons
        f.log(obj.dataset.position)

        if (obj.dataset.position === "top"){
            return {start: 0, end: 0.25}; 
        }
        else if (obj.dataset.position === "middleRight"){
            return {start: 1.25, end: 0.5}; 
        }
        else if (obj.dataset.position === "bottom"){
            return {start: 5, end: 0.75};
        }
        else if (obj.dataset.position === "hidden") {
            return {start: 0.75, end: 1};
        }
    }

    // f.log(path);
    // f.log(arrowLeft, arrowRight);
    // f.log(bubble);
    f.log(icons);  
    
    
    // types of animations to be done 
    // mostly .to animations
        // change opacity
        // change size 
    // updating settings 
        // change set of an object(update start and stop settings)    
    // toAnimate 

    // copy icons into their own variables
    const [turtle, dolphin, orca, hidden] = icons;
    
    // add click events to buttons 
    f.event(arrowRight, "click", () => {
        
        // --> move turtle right
        obj.animeTo(turtle.el, turtle.animSet.to, turtle.animSet.base, turtle.animSet.motionPath);
        

    }); // click left

    f.event(arrowLeft, "click", () => {
        f.log(turtle.animSet.base)
        obj.animUpdate(turtle.el, path, turtle.animSet.base, turtle.animSet.motionPath.end + 0.1);
        
    }); // click right
}

// top coordinate 
// middleRight coordinate
// bottom coordate
// middleLeft coordinate

// set some variable or functionality to detect which element is on the right

// click (triggers the tween for bubble and tween for icons)
// right 
    // change hidden object image src 
    // move right move elements right -> some percentage 25%
    // rotate bubble 360deg to the right
// left 
    // change hidden object image src 
    // move left move elements left -> some percentage 25%
    // rotate bubble 360 degrees to the left

// gsap parameters 
    // motionPath settings
    // path -> the path onto which to rotate the elements
    // autoRotate -> rotates the object in the same direciton as the path 
    // start -> start point of element to be rotated 
        // update icon so that it has a new start point 
    // end -> end point of element to be rotated
        // update icon so that it has a new end point 


    