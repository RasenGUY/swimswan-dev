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

// trigger both animations at the same time at the click of the button 

// circular animation with button
    // move icons in circular motion
        // do with css animations (no need of tweens)
        // scaled (0) -> <- unscaled (1) <- unscaled (2) 
        // remove opacity ->                             
        // scaleToLow -> 
        // move 90 deg -> move 90deg -> move 90deg 
        // bubble seq
            // scale - unscale

export function animate(obj) {

    const icons = obj.icons.sel.map(sel => f.getObj(sel)).map(obj => f.createObj({el: obj})); // select all of the icons and create object with state
    const [arrowLeft, arrowRight] = obj.arrows.sel.map(sel => f.getObj(sel)); // select all the arrows and create obj with state
       
    // animation obj functions
    function getDataSrc(src, obj){ // get data url for obj 
        return src + obj.data.split("/")[obj.data.split("/").length -1];
    }
    function addSet(obj, set){ // create settings for obj
        return {...obj, ...set};
    }
    
    // transformations
    // calculate angle
    const angleAdd = (initial, angle) => (initial += angle);
    const angleRemove = (initial, angle) => (initial -= angle);

    // effects
    function scaleTo(obj, factor){
        obj.style.transform = "scale(" +  factor + ")";  
    };
    const opacityTo = factor => factor;

    // add settings to to be animated objects 
    const iconsAnim = icons.map(icon => addSet(icon, {src: getDataSrc(obj.imgSrc, icon.el)})).map(icon => addSet(icon, {angle: 0}));

    // add select and add settings to orbit and bubble
    const orbit = addSet(f.createObj({el: f.getObj(obj.orbit.sel)}), {angle: 0}); 
    const bubble = addSet(f.createObj({el: f.getObj(obj.bubble.sel)}), {angle: 0}); 

    // rotate objects based on deg
    function rotateForward(obj, angle) { // rotate to front based on given or calculated angle
        obj.style.transform  = "rotate(" + angle + "deg)";
    };
    
    // apply transform rotate on an element
    function rotateObjForward(obj, angle) { // rotate forward by given angle
        rotateForward(obj.el, angleAdd(obj.angle, angle));
    };

    function rotateObjBackward(obj, angle) { // rotate forward by given angle
        rotateForward(obj.el, angleRemove(obj.angle, angle));
    };
    
    // changeclassNames of elements
    function changeObjClassN(arr, forward = true){
        if (forward){ 
            arr.forEach((icon, i) => { 
                if (i + 1 < iconsAnim.length - 1){ // only target elements inbound
                    icon.el.className = iconsAnim[i+1].el.className;
                } 
                if (i + 1 === iconsAnim.length - 1){ // last element then copy from first element
                    icon.el.className = iconsAnim[0].el.className;
                }

            });
        } else {
            arr.forEach((icon, i) => { 
                if (i + 1 < iconsAnim.length - 1){ // only target elements inbound
                    icon.el.className = iconsAnim[i-1].el.className;
                } 
                if (i + 1 === 0){ // last element then copy from first element
                    icon.el.className = iconsAnim[iconsAnim.length - 1].el.className;
                }
            });
        }
    }

    // reverse animations for dolphins
    function iconsRotate(n, forward = true){

        // base case 
        if (n > iconsAnim.length - 1){
            // stop at base case 
            return; 
        }
        if (forward){
            rotateObjBackward(iconsAnim[n], 90);
            f.updateProps(iconsAnim[n], "angle", angleRemove(iconsAnim[n].angle, 90)); // update icon current angle
            return iconsRotate(n+1);

        } else {

            rotateObjForward(iconsAnim[n], 90);
            f.updateProps(iconsAnim[n], "angle", angleAdd(iconsAnim[n].angle, 90)); // update icon current angle
            return iconsRotate(n+1, false);
        }
    }

    // animate icons size and some other effectts
    function iconsAnimate(n, forward = true) {
        // base case 
        if (n === iconsAnim.length - 1){
            return;
        }

        if (forward){
            // scale icon with class top to 1; 
            if (iconsAnim[n].el.classList.contains("top")){
                scaleTo(iconsAnim[n].el, 1); 
            }
            // scale icon with middleRight to 0.5
            if (iconsAnim[n].el.classList.contains("middleRight")){
                scaleTo(iconsAnim[n].el, 0.5); 
            }
            // change source of hidden to bottom
            if (iconsAnim[n].el.classList.contains("hidden")){
                iconsAnim[n].el.data = iconsAnim[n-1].src;
            }
            return iconsAnimate(n+1); 

        } else {
            // scale icon with class bottom to 1; 
            if (iconsAnim[n].el.classList.contains("bottom")){
                scaleTo(iconsAnim[n].el, 1); 
            }
            // scale icon with middleRight to 0.5
            if (iconsAnim[n].el.classList.contains("middleRight")){
                scaleTo(iconsAnim[n].el, 0.5); 
            }
            // change source of hidden to top
            if (iconsAnim[n].el.classList.contains("hidden")){
                iconsAnim[n].el.data = iconsAnim[n+1].src;
            }
            return iconsAnimate(n+1, false);
        }
    } 

    // animation flow of objects
    f.event(arrowRight, 'click', () => { // add click events to right button
        
        // orbit 
        rotateObjForward(orbit, 90); // rotate orbit forward
        f.updateProps(orbit, "angle", angleAdd(orbit.angle, 90)); // opdate orbit current angle
        
        // bubble 
        rotateObjBackward(bubble, 90) // rotate bubble backwards
        f.updateProps(bubble, "angle", angleRemove(bubble.angle, 90)); // update bubble angle
        
        // reverse rotate icons
        iconsRotate(0); 

        // scale items and change img srcs of icons
        iconsAnimate(0); 
        changeObjClassN(iconsAnim);
        
    });   
    
    f.event(arrowLeft, 'click', () => { // add click even to left button

        // orbit
        rotateObjBackward(orbit, 90); // rotate orbit backwards
        f.updateProps(orbit, "angle", angleRemove(orbit.angle, 90)); // update orbit current angle

        // bubble 
        rotateObjForward(bubble, 90) // rotate bubble forward
        f.updateProps(bubble, "angle", angleAdd(bubble.angle, 90)); // update bubble current

        // reverse rotate icons
        iconsRotate(0, false); 

        // scale items and change img srcs of icons (reverse)
        iconsAnimate(0, false); 
        changeObjClassN(iconsAnim, false);
    });

}
    // what el is needed
        // arrows * 2 ?
            // add extra button done
            // hover effect done 

        // icons
            // animate
            // size -> scale * 1.5
            // angle (to change, reverse)
                // angle -> path walk   
                

        // bubble in the background 
            // angle reverse 
            // to animate
                // opacity 
                // size (scale) ?
                // background puddle (extra)

        // icon-path
            // angle (to change)

    // functions that are needed 
        // function that retrieves elements
        // function that changes the state of an el

    // carouselify the cards
        // visible (0) -> <- invisible (1) <- invisible (2) 
        // remove opacity -> <- add opacity <- unchange
        // some logic to apply state changes                         