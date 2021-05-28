// all js functions used in the newworld site

// function for toggling pseudo elements on and off
export function togglePseudo(htmlEl, pseudo, cssRule){ //function for animating pseudo-elements 
     
    // retrieve all childnodes 
    var children = document.querySelector("head").childNodes;

    // toggle the style  
    var ruleExists = false;
    var childIndex = null;
    var pseudoEl = htmlEl + pseudo + "{"+ cssRule + "}"

    // remove existing style
    children.forEach((child, index) =>{
        if (child['innerHTML'] == pseudoEl){
            ruleExists = true; 
            childIndex = index;
        } 
    });

    if (ruleExists == true){

        // remove child
        document.querySelector("head").removeChild(children[childIndex]);
        console.log("removed child");

    } 
    else {

        // add child
        let el = document.createElement("style");
        el.innerHTML = pseudoEl;
        console.log(el);
        document.querySelector("head").appendChild(el);
    }; 

    return 0;
};

// function for doing media queries on site 
export function medQueries(minMax, width){  
    // max or min
    if (minMax === ">"){ // if min then create min-width query
        return window.matchMedia(`(min-width: ${width}px)`);
    }
    else if (minMax === "<"){ // if min then create max-width query
        return window.matchMedia(`(max-width: ${width}px)`);
    }
};

// queries for index page
export function callQueries(e, callB){

    // will execute callBack and reverseFunction on matched or unmatched window
    if (e.matches){ // section one 
        callB(); 
    } 
    else {
        return;
    }
    return 0;
};

export function removeChilds(parent){
    console.log("removing children");
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

// mutationObserver -> creates instance of element observer and executes given callBack function -> returns the created instance
export function observeEl(el, config, callBack) {
    
    const observerCallB = (mutationList, observer) => { // check for changes in DOM el
        
        // loop trough mutationlist and call the callBackfunction  
        for (const mutation of mutationList){
            
            // call callback if child has been added or removed
            if (mutation.type === 'childList') {
                callBack();
            }
        }
    }
    
    return {config: config, el: el, inst: new MutationObserver(observerCallB), lb: null}; // create new observer obj instance 
}

// loader function 
export function loaderFunc(ldrObj){
    // function that starts loader or removes loader 
    
    // select loader
    const loader = document.querySelector(ldrObj.sel);

    // deactivate loader if settings is deactivate
    if (ldrObj.deactivate == "deactivate"){
        
        // hide loader and remove settings to parent element
        loader.classList.toggle(ldrObj.deactivate);
        loader.parentElement.classList.remove(ldrObj.parentSettings);
    
    // activate if settings are not deactivate
    } else {
        // select and add settings to inject target 
        const injTarget = document.querySelector(ldrObj.injectTarget)
        injTarget.classList.append(ldrObj.parentSettings);
        loader.classList.toggle(ldrObj.deactivate);
        injTarget.append(loader);
    }
    
    return 0;
}


// general functions functional programming //  
export function grab(sel){ // returns single dom obj
    return document.querySelector(sel); 
} 
export function grabAll(sel){ // returns multiple dom els
    return document.querySelectorAll(sel); 
} 
export function log(arg, ...args){ // logs a message based on a value
    return console.log(arg, ...args);
}
export function createObj(obj){ // create new object element
    return Object.assign({}, obj);
}
export function event(obj, event, func){ // adds event listener to obj
    obj.addEventListener(event, func);
}
export function updateProps(obj, prop, value){
    obj[prop] = value;
};
export function newPromise(...args){
    return new Promise((resolve, reject) => {args}); 
}
export function timeOut(func, timeOut){
    return setTimeout(func, timeOut);
}
