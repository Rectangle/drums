
/**
 * test
 * 
 * 
 * Tools for making custom drum kits.
 * Each function, when run, returns an object
 * 
 * NoiseMaker(color, decay, base_amp)
 * 
 * 
 * 
 * 
 */

stop

import { NoiseMaker } from './index';
import { Drumhead } from './index';
import { Bassdrum } from './index';
import { Snaredrum } from './index';
import { Tomdrum } from './index';

var bassdrum = Bassdrum(80, 30, 2, 1);

var hihat = NoiseMaker(0, 30, 0.1);

var snare = Snaredrum(220, 20, 0.2, 0.8);

var tom1 = Tomdrum(82.5, 10, 2);
var tom2 = Tomdrum(110, 10, 2);
var tom3 = Tomdrum(165, 10, 2);

var snare2 = Snaredrum(440, 50, 0.05, 0.0);
var snare3 = Snaredrum(440, 50, 0.05, 0.1);


var drums = {
  play : function(){
    
    var bassdrumplay = bassdrum.play();
    var snareplay = snare.play();
    var hihatplay = hihat.play();
    
    var tom1play = tom1.play();
    var tom2play = tom2.play();
    var tom3play = tom3.play();
    
    var snare2play = snare2.play();
    var snare3play = snare3.play();
    
    return [
      bassdrumplay * 0.5 + hihatplay * 0.6 + snareplay * 0.4 + snare2play*0.5 + tom1play*0.8 + tom2play*0.5 + tom3play*0.2, 
      bassdrumplay * 0.5 + hihatplay * 0.4 + snareplay * 0.6 + snare3play*0.5 + tom1play*0.2 + tom2play*0.5 + tom3play*0.8];
  }
};


var bpm = 240;



function at(t1,t2){return (t1 >= t2 && t1 <= t2+1/sampleRate);}

function each(b, beat, per_beat){
  return at(b%per_beat*60/bpm, beat%per_beat*60/bpm);
}

var beats = 0.0;

var tally = 0;

var fill_switch = 0;


export function dsp(t) {
  
  beats += 1/sampleRate/60*bpm;
  
  
  /*
  var w = 0;
  
  for (var i in harmonics){
    var h = harmonics[i];
    w += Math.pow(-1,i) * Math.sin(2*Math.PI*freq*(t%m)*h)/Math.pow(h,2) * Math.exp(-(t%m)*8);
  }
  */
  
  
  if (each(beats,0,1)) hihat.hit(1);
  if (each(beats,0.5,1)) hihat.hit(0.2);
  
  if (each(beats,0,0.5)) snare2.hit(1);
  if (each(beats,0,0.5)) snare3.hit(1);
  
  
  
  if (beats%16 < 12){
  
    if (each(beats,0,4)) bassdrum.hit(1);
    if (each(beats,1,4)) bassdrum.hit(1);
    
    
    if (each(beats,2,4)) snare.hit(1);
    
    if (each(beats,6.5,8)) bassdrum.hit(1);
    
    
    
    if (each(beats,7.5,8)) snare.hit(0.6);
    
    
    if (each(beats,1.5,4) && Math.random() > 0.3) bassdrum.hit(0.6);
    
    if (each(beats,0.75,4) && Math.random() > 0.8) hihat.hit(0.5);
    
  }
  
  
  
  
  if (each(beats,0,16)) fill_switch = (fill_switch+1)%8;//Math.floor(Math.random()*8);
  
  
  switch (fill_switch){
    
    case 0:
      
      if (each(beats,12,16)) bassdrum.hit(1);
      if (each(beats,12+1,16)) bassdrum.hit(1);
      
      if (each(beats,12+1.5,16)) snare.hit(0.5);
      if (each(beats,12+2,16)) snare.hit(1);
      if (each(beats,12+3,16)) snare.hit(0.8);
      if (each(beats,12+3.5,16)) snare.hit(0.4);
      break;
      
    case 1:
      
      if (each(beats,12+0,16)) tom3.hit(1);
      if (each(beats,12+0+1/2,16)) tom3.hit(0.6);
      
      if (each(beats,12+1,16)) tom3.hit(1);
      if (each(beats,12+1+1/3,16)) tom3.hit(0.6);
      if (each(beats,12+1+2/3,16)) tom3.hit(0.5);
      
      if (each(beats,12+2,16)) tom2.hit(1);
      if (each(beats,12+2+1/3,16)) tom2.hit(0.6);
      if (each(beats,12+2+2/3,16)) tom2.hit(0.5);
      
      if (each(beats,12+3,16)) tom1.hit(1);
      if (each(beats,12+3+1/3,16)) tom1.hit(0.6);
      if (each(beats,12+3+2/3,16)) tom1.hit(0.5);
      
      break;
      
    case 2:
      
      if (each(beats,12,16)) bassdrum.hit(1);
      if (each(beats,12+0.5,16)) snare.hit(0.5);
      if (each(beats,12+1,16)) bassdrum.hit(1);
      
      if (each(beats,12+1.5,16)) snare.hit(0.8);
      
      if (each(beats,12+2,16)) snare.hit(1);
      
      
      if (each(beats,12+3,16)) bassdrum.hit(1);
      
      if (each(beats,12+3,16)) snare.hit(0.8);
      
      if (each(beats,12+3.5,16)) snare.hit(0.3);
      
      break;
      
    case 3:
      
      if (each(beats,12+0.5,16)) snare.hit(1);
      
      if (each(beats,12+1,16)) tom2.hit(0.8);
      if (each(beats,12+1.5,16)) tom2.hit(1);
      
      if (each(beats,12+1,16)) snare.hit(1);
      
      if (each(beats,12+2,16)) bassdrum.hit(1);
      if (each(beats,12+2.5,16)) snare.hit(1);
      if (each(beats,12+3,16)) snare.hit(0.6);
      if (each(beats,12+3.5,16)) snare.hit(0.5);
      
      
      break;
      
    case 4:
      if (each(beats,12+0,16)) bassdrum.hit(0.7);
      if (each(beats,12+1,16)) bassdrum.hit(0.8);
      if (each(beats,12+2,16)) bassdrum.hit(1);
      
      if (each(beats,12+0.5,16)) snare.hit(0.2);
      if (each(beats,12+0.75,16)) snare.hit(0.1);
      if (each(beats,12+1,16)) snare.hit(0.3);
      if (each(beats,12+1.25,16)) snare.hit(0.2);
      if (each(beats,12+1.5,16)) snare.hit(0.5);
      if (each(beats,12+1.75,16)) snare.hit(0.2);
      if (each(beats,12+2,16)) snare.hit(0.6);
      if (each(beats,12+2.25,16)) snare.hit(0.6);
      if (each(beats,12+2.5,16)) snare.hit(0.8);
      if (each(beats,12+2.75,16)) snare.hit(1);
      
      if (each(beats,12+3,16)) snare.hit(1);
      if (each(beats,12+3.5,16)) snare.hit(1);
      
      break;
      
    case 5:
      
      if (each(beats,12,16)) bassdrum.hit(1);
      if (each(beats,12+1,16)) bassdrum.hit(1);
      
      if (each(beats,12+2,16)) snare.hit(1);
      
      
      if (each(beats,12+3,16)) bassdrum.hit(1);
      if (each(beats,12+3,16)) snare.hit(0.6);
      if (each(beats,12+3+1/3,16)) snare.hit(0.7);
      if (each(beats,12+3+2/3,16)) snare.hit(0.8);
      
      break;
      
      
      
    case 6:
      
      if (each(beats,12+0,16)) bassdrum.hit(1);
      
      if (each(beats,12+0,16)) snare.hit(0.6);
      if (each(beats,12+0+1/3,16)) snare.hit(0.7);
      if (each(beats,12+0+2/3,16)) snare.hit(0.8);
      if (each(beats,12+1,16)) snare.hit(0.6);
      if (each(beats,12+1+1/3,16)) snare.hit(0.7);
      if (each(beats,12+1+2/3,16)) snare.hit(0.8);
      if (each(beats,12+2,16)) snare.hit(0.3);
      if (each(beats,12+2+1/3,16)) snare.hit(0.4);
      if (each(beats,12+2+2/3,16)) snare.hit(0.5);
      if (each(beats,12+3,16)) snare.hit(0.6);
      if (each(beats,12+3+1/3,16)) snare.hit(0.7);
      if (each(beats,12+3+2/3,16)) snare.hit(0.8);
      
      break;
    
    case 7:
      
      if (each(beats,12+0,16)) bassdrum.hit(0.7);
      if (each(beats,12+1,16)) bassdrum.hit(0.8);
      if (each(beats,12+2,16)) bassdrum.hit(1);
      
      if (each(beats,12+0.5,16)) snare.hit(0.2);
      if (each(beats,12+0.75,16)) snare.hit(0.1);
      if (each(beats,12+1,16)) snare.hit(0.3);
      if (each(beats,12+1.25,16)) snare.hit(0.2);
      if (each(beats,12+1.5,16)) snare.hit(0.5);
      if (each(beats,12+1.75,16)) snare.hit(0.2);
      if (each(beats,12+2,16)) tom2.hit(0.6);
      if (each(beats,12+2.25,16)) tom2.hit(0.6);
      if (each(beats,12+2.5,16)) tom2.hit(0.8);
      if (each(beats,12+2.75,16)) tom2.hit(1);
      
      if (each(beats,12+3,16)) tom1.hit(1);
      if (each(beats,12+3.25,16)) tom1.hit(1);
      if (each(beats,12+3.5,16)) tom1.hit(1);
      if (each(beats,12+3.75,16)) tom1.hit(1);
    
  }
  
  
  //hihat.set_decay(30 - 20 * ((beats/32)%1)*((beats/32)%1));
  


  tally++;

  var output = compress(drums.play());
  
  return output;
  
  
}

function compress(w){
  return [Math.atan(w[0]*(Math.PI/2))/(Math.PI/2), Math.atan(w[1]*(Math.PI/2))/(Math.PI/2)];
}