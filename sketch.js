let maxiters = 7;

let variation = 200; //max noise. 
                     //after each iter, it's divided by 2 
                     //  (as the triangles get smaller, the variation needs to decrease)
                     //try 0 to see smaller and smaller triangles instead of a mountain


let drawiters = true; //draw out each iteration, instead of one final image?

function setup() {
  createCanvas(800, 600);
  noLoop();
}

function wait(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  })
}

//generate integer between -range and range. 
function gennoise(range) {
  return Math.floor(Math.random() * range) * (Math.round(Math.random()) * 2 - 1)
}

//mid: get a "noisy" midpoint between point a and b
//noise is added to the y coord of the midpoint
//
//We want to generate just one noisy midpoint for any given a and b value,
//So we save the noisy ab midpoint in a Map
let midmap = new Map();
function mid(a, b, maxnoise) {   
  let k = a+'-'+ b; //bleh. can we make a tuple or something?
  if(!midmap.has(k)) {
    let x = (a[0]+b[0])/2;
    let y = min(height, ((a[1]+b[1])/2) + gennoise(maxnoise));
    midmap.set(k, [x,y])
  }
  return midmap.get(k);  
}


let giter = 0; //if drawiters, every time this changes, we clear the screen.

function mountain(a, b, c, iter) {
  if(iter > maxiters) {
    triangle(a[0],a[1], b[0],b[1], c[0],c[1])
    return;
  }
  
  //if drawiters:
  //  draw the current coords
  //  also: we have to clear the screen between iterations
  //    ...dear lord this is terrible. gotta be a better way than keeping a global counter!
  if(drawiters) {
    if(iter > giter){
      giter++;
      clear();
      background(220);
    }
    triangle(a[0],a[1], b[0],b[1], c[0],c[1])
  }
  
  //calculate the max variation at this iter. it is div by 2 after each iter
  let currvar = variation / Math.pow(2,iter);
  
  //get the midpoints, provide the current max variation
  let abm = mid(a,b, currvar);
  let acm = mid(a,c, currvar);
  let bcm = mid(b,c, currvar);

  let nextiter = () => {
    let niter = iter+1;
    mountain(a, abm, acm, niter);
    mountain(abm,b,bcm, niter);
    mountain(abm, acm, bcm, niter);
    mountain(acm, bcm, c, niter);
  };
  
  if(drawiters) {
    wait(1000).then(nextiter);
  } else {
    nextiter();
  }
}

function draw() {
  background(220);
  
  //starting
  let a = [50, height-100]
  let b = [width/2, 0+100]
  let c = [width-50, height-100]
  mountain(a,b,c,0);  
  

}
