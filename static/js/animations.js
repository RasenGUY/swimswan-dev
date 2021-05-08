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
            isHidden: (f.grab(sel).dataset.position) === "hidden" ? true : false, // isHidden
            animSet: {
                to: {
                    scale: 1.15
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
            } 
        }))
    
    // functions 
    function setMotionPosition(obj){ // create positions for icons 
        f.log(obj.dataset.position)

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
    }

    function calcPosNext(current, incr){
        return {start: current.end != 0.5 ? current.end : 0, end: current.end != 0.5 ? current.end + incr : (0 + incr) };
    }
    
    function calcPosRev(current, incr){
        return {start: current.end != 0.5 ? 0.5 + current.end : 0.5, end: current.end != 0.5 ? 0.5 + current.end + incr : current.end + incr};        
    }
    // let poss = [{start: 0.375, end: 0.5}, {start: 0, end: 0.125}, {start: 0.125, end: 0.25}, {start: 0.25, end: 0.375}]
    // f.log(poss.map(pos => calcPosRev(pos, 0.125))); 

    function setPos(icon, incr){
        // if (rev){
        //     let current = {start: icon.motionPos.current.end != 0.5 ? icon.motionPos.current.end - 0.5 : icon.motionPos.current, end: icons.motionPos.end - 0.5 };
        // } else {
        // }

        let current = {start: icon.motionPos.current.start, end: icon.motionPos.current.end};
        icon.motionPos.next = calcPosNext(current, incr); // calculate next 
        icon.motionPos.rev =  calcPosRev(current, incr); // calculate reverse 
    }; 

    function updateCurrentPos(pos, icon) { // sets the current motionPosition icon 
        icon.motionPos.current.start = pos.start;
        icon.motionPos.current.start = pos.end;
    };

    function updateMotionPath(icon, start, end){
        icon.animSet.motionPath.start = start;
        icon.animSet.motionPath.end = end;
    };

    
        // copy icons into their own variables
    const [turtle, dolphin, orca, hidden] = icons;
    
    // add click events to buttons 
    f.event(arrowRight, "click", () => {
        
        icons.map(icon => updateMotionPath(icon, icon.motionPos.next.start, icon.motionPos.next.end)); // set new motion
        icons.map(icon => obj.animTo(icon.el, icon.animSet.to, icon.animSet.base, icon.animSet.motionPath)); // --> move icons right
        icons.map(icon => updateCurrentPos(icon.motionPos.next, icon)); // update current motion position
        icons.map(icon => setPos(icon, 0.125)); // --> set new pos  

        f.log(icons.filter(icon => icon.animSet.motionPath)[0].animSet.motionPath)
        f.log(icons.filter(icon => icon.motionPos)[0].motionPos)
        
        
    }); // click left
    
    f.event(arrowLeft, "click", () => {
        
        icons.map(icon => updateMotionPath(icon, icon.motionPos.rev.start, icon.motionPos.rev.end)); // set new motion
        icons.map(icon => obj.animTo(icon.el, icon.animSet.to, icon.animSet.base, icon.animSet.motionPath)); // --> move icons left
        icons.map(icon => setPos(icon, 0.125)); // --> set new pos  
        
    }); // click right
    
    // initial animation
    icons.map(icon => obj.animTo(icon.el, icon.animSet.to, icon.animSet.base, icon.animSet.motionPath));
    // initial pos and motionPath update
    icons.map(icon => updateCurrentPos(icon.motionPos.next, icon)); // update current position
    icons.map(icon => setPos(icon, 0.125)); // set positions
    
    
}
// update properties
    // if top
        // top -> middleRight
        // start -> top.start + 0.125
        // end -> top.end + 0.125
            // if start or end is 0.5 then start back from 0

    // if middleRight 
        // middleRight -> bottom 
        // start -> middleRight.start += 0.125
        // start -> middleRight.end += 0.125

    // if bottom 
        // bottom -> hidden
        // imgSrc -> none
        // start -> bottom.start += 0.125
        // end -> bottom.end += 0.125
        // hiddenimgSrc -> bottomImgSrc

    // if bottom 
        // hidden -> top
        // start -> bottom.start += 0.125
        // end -> bottom.end += 0.125




    