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

export function animate(obj) {

    // map all necessary settings of icons
    const icons = obj.icons.sel 
    .map(
        sel => f.getObj(sel) // select elements
    ) 
    .map( // create new object
        icon => addSet( //add id 
            addSet( // add data-postion
                addSet( // add angle
                    addSet ( // add img src to asettings
                        f.createObj({el: icon}), // create object and give it the key element
                        {src: getDataSrc(icon, obj.abs)}
                    ),
                    {angle: 0}
                ),
                {position: icon.dataset.position}
            ),
            {id: icon.id}
        )
    );
    f.log(icons)
    const [arrowLeft, arrowRight] = obj.arrows.sel.map(sel => f.getObj(sel)); // select all the arrows and create obj with state
       
    // animation obj functions
    function getDataSrc(obj, relative = false, ...abs){ // returns an absolute url or a relative url from given obj  
        if (relative){
            return obj.data.split("/")[obj.data.split("/").length -1]; // return relative path
        } else {    
            return abs + obj.data.split("/")[obj.data.split("/").length -1]; // return absolute path
        }
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
    function changeObjSrc(obj, src){ // change src of obj to a given source 
        obj.data = src; 
    }
    const opacityTo = factor => factor;

    // add settings to to be animated objects 
    ;

    // add select and add settings to orbit and bubble
    const orbit = addSet(f.createObj({el: f.getObj(obj.orbit.sel)}), {angle: 0}); 
    const bubble = addSet(f.createObj({el: f.getObj(obj.bubble.sel)}), {angle: 0}); 

    // rotate objects based on deg
    function rotateForward(obj, angle) { // rotate to front based on given or calculated angle
        obj.style.transform  = "rotate(" + angle + "deg)";
    };
    // change datasource of icon
    function changeObjDataPos(obj, to){
        obj.dataset.position = to; 
    }

        
    // updates poisitons of icons
    function updateElsPos(Els, forward = true){
        Els.forEach(icon => {
            if (!forward){ // change data position of icons forward
                if (icon.position === "hidden"){ 
                    f.updateProps(icon, "position", "bottom"); 
                    changeObjDataPos(icon.el, "bottom");

                } else if (icon.position === "bottom"){ 
                    f.updateProps(icon, "position", "middleRight"); 
                    changeObjDataPos(icon.el, "middleRight");

                } else if (icon.position === "middleRight"){ 
                    f.updateProps(icon, "position", "top"); 
                    changeObjDataPos(icon.el, "top");

                } else if (icon.position === "top"){ 
                    f.updateProps(icon, "position", "hidden"); 
                    changeObjDataPos(icon.el, "hidden");
                }

            } else { // change data positon of icons backwards
                if (icon.position === "hidden"){ 
                    f.updateProps(icon, "position", "top"); 
                    changeObjDataPos(icon.el, "top");

                } else if (icon.position === "top"){
                    f.updateProps(icon, "position", "middleRight"); 
                    changeObjDataPos(icon.el, "middleRight");

                } else if (icon.position === "middleRight"){
                    f.updateProps(icon, "position", "bottom"); 
                    changeObjDataPos(icon.el, "bottom");

                } else if (icon.position === "bottom"){
                    f.updateProps(icon, "position", "hidden"); 
                    changeObjDataPos(icon.el, "hidden");
                }
            }
            f.log(`icon-src: ${icon.src}`,  `icon-position: ${icon.position}`)

        });
    } 


    // apply transform rotate on an element
    function rotateObjForward(obj, angle) { // rotate forward by given angle called with backward rotation
        rotateForward(obj.el, angleAdd(obj.angle, angle)); // rotate obj forward
    };
    function rotateObjBackward(obj, angle) { // rotate backward by given angle 
        rotateForward(obj.el, angleRemove(obj.angle, angle)); // rotate obj backward
    };
    
    // rotateicons
    function iconsRotate(n, forward = true){

        // base case 
        if (n > icons.length - 1){
            // stop at base case 
            return; 
        }
        if (forward){
            rotateObjBackward(icons[n], 90);
            f.updateProps(icons[n], "angle", angleRemove(icons[n].angle, 90)); // update icon current angle
            // f.log(icons[n].el.id, icons[n].el.style.transform, icons[n].position);
            return iconsRotate(n+1);
        } else {
            rotateObjForward(icons[n], 90);
            f.updateProps(icons[n], "angle", angleAdd(icons[n].angle, 90)); // update icon current angle
            // f.log(icons[n].el.id, icons[n].el.style.transform, icons[n].position);
            return iconsRotate(n+1, false);
        }
    }
    // 
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
        updateElsPos(icons); 
        // change data src of hidden to bottom
        // changeObjSrc(icons.filter(icon => icon.position === "hidden")[0].el, obj.abs + icons.filter(icon => icon.position === "bottom")[0].el.data);
        // f.log(icons.map(icon => [icon.el.dataset.position, icon.position]));

        // scale items and change img srcs of icons
        
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
        updateElsPos(icons, false);
        // change data src of hidden to top
        // changeObjSrc(icons.filter(icon => icon.position === "hidden")[0].el, obj.abs + icons.filter(icon => icon.position === "top")[0].src);
        // f.log(icons.map(icon => [icon.el.dataset.position , icon.position]));
        // scale items and change img srcs of icons (reverse)
        
    });

}
