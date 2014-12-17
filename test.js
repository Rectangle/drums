
/**
 * test
 * 
 * 
 * Tools for making custom drum kits.
 * Each function, when run, returns an object with at least two functions:
 * hit(vel), and play().
 * 
 * hit(vel) signals the drum to be hit, with relative velocity vel
 * play() runs the drum though one sample, returning its current value
 * 
 * NoiseMaker(color, decay, base_amp)
 *    Generates noise when hit.
 *    color signifies how "brown" the noise is, with 0 bring white noise and higher values bass-heavy brown noise
 *    decay signifies how rapidly the noise decays, with higher being faster
 *    base_amp is an easy way to multiply the amplitude for the entire NoiseMaker
 * 
 *    NoiseMaker is useful for hihats, clicks and rattles
 *    White noise gives a simple hihat, with longer decay a more open hihat, and a very short decay a click
 *    Brown noise sounds like hitting a rattling sheet of metal
 * 
 * Drumhead(freq, harmonics, harmonic_power, decay, freq_decay, base_amp)
 *    Plays a sine wave, with specified overtones that decays in amplitude and frequency
 *    freq signifies the base frequency
 *    harmonics is an array of the hamonics used
 *    harmonic_power signifies that amplutide of the nth harmonic is 1/n^harmonic_power
 *    decay signifies how rapidly the amplitudes decay, with higher being faster
 *    freq_decay signifies how rapidly the frequnecies decay, with higher being faster
 *    base_amp is an easy way to multiply the amplitude for the entire NoiseMaker
 * 
 * Bassdrum(freq, decay, freq_decay, click_amp, base_amp)
 *    Sets up a drumhead to sound like a bass drum.
 *    A combination of a Drumhead with a Noisemaker.
 *    The harmonics are taken from: 
 *    http://www.soundonsound.com/sos/feb02/articles/synthsecrets0202.asp
 *    It's important that the harmonics are non-integers, as drums are characteristically inharmonic.
 *    For a tighter membrane, lower the freq_decay. A freq decay of 0 sounds like a timpani.
 *    click_amp is amplitude of the click.
 *    For suggested examples, see below.
 * 
 * Snaredrum(freq, decay, noise_amp, drumhead_amp)
 *    Sets up a drumhead to sound like a snare drum.
 *    A combination of a Drumhead (with drumhead_amp) with a brown Noisemaker (with noise_amp).
 *    The harmonics are taken from:
 *    http://www.soundonsound.com/sos/Mar02/articles/synthsecrets0302.asp
 *    For an open snare, set noise_amp to 0.
 *    Setting drumhead_amp to low values gives a harsh, flat sounding snare.
 *    Recommended ratio is to set drumhead_amp = 4*noise_amp (as below)
 * 
 * Tomdrum(freq, decay, freq_decay, base_amp)
 *    Like the Bassdrum method -- the main difference is the use of snare drum harmonics
 * 
 */


import { NoiseMaker } from './index';
import { Drumhead } from './index';
import { Bassdrum } from './index';
import { Snaredrum } from './index';
import { Tomdrum } from './index';

import Reverb from 'opendsp/freeverb';

var bassdrum = Bassdrum(82.5, 20, 2, 0.1, 1.5);

var hihat = NoiseMaker(0, 30, 0.1);

var snare = Snaredrum(220, 20, 0.2, 0.8);

var tom1 = Tomdrum(110,   10, 0.2, 1.5);
var tom2 = Tomdrum(137.5, 10, 0.2, 1.5);
var tom3 = Tomdrum(165,   10, 0.2, 1.5);

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

var wet;
var rev = Reverb();
rev.room(0.9).damp(0.9);


var bpm = 150;

// choose a sample beat to play
// 0: basic rock beat
// 2: Song 2 (Blur)

var beat_selection = 2;







function at(t1,t2){return (t1 >= t2 && t1 <= t2+1/sampleRate);}

function each(b, beat, per_beat){
  return at(b%per_beat*60/bpm, beat%per_beat*60/bpm);
}

var beats = 0.0;


var fill_switch = 0;


export function dsp(t) {
  
  beats += 1/sampleRate/60*bpm;
  
  switch(beat_selection){
    case 0:
      if (each(beats,0,4)) bassdrum.hit(1);
      if (each(beats,5,8)) bassdrum.hit(1);
      if (each(beats,2,4)) snare.hit(1);
      if (each(beats,0,1)) hihat.hit(1);
      
      break;
      
    case 2:
      if (each(beats,0,4)) bassdrum.hit(1);
      if (each(beats,2,8)) bassdrum.hit(1);
      if (each(beats,2.5,4)) bassdrum.hit(1);
      if (each(beats,4.5,8)) bassdrum.hit(1);
      if (each(beats,5.5,8)) bassdrum.hit(1);
      
      if (each(beats,1,2)) snare.hit(1);
      if (each(beats,7.5,8)) snare.hit(1);
      
      if (each(beats,3.5,8)) tom2.hit(1);
      
      if (each(beats,0,1)) hihat.hit(1);
      if (each(beats,0.5,1)) hihat.hit(0.5);
      
      
      if (each(beats,0,8)) hihat.set_decay(30);
      if (each(beats,7.5,8)) hihat.set_decay(5);
      
      break;
  }

  var output = compress(drums.play());
  
  wet = rev.run(output);
  
  if (each(beats,0,4)) console.log(wet);

  return output;
  
  
  
  /*
  
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
  

  */
  
}

function compress(w){
  return [Math.atan(w[0]*(Math.PI/2))/(Math.PI/2), Math.atan(w[1]*(Math.PI/2))/(Math.PI/2)];
}