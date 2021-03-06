
/**
 * @module drums
 * @author rectangle
 */

var bass_drum_harmonics = [1.0, 2.36, 1.72, 1.86, 2.72, 3.64]; // , 4.5, 5.46]
var snare_drum_harmonics = [1.0, 1.6, 2.13, 2.66, 2.3, 2.92, 3.5, 4.07]; // 4.24, 4.84
var extra_harmonics = [1.0, 1.3, 1.55, 1.85, 2.1, 2.4];


export function NoiseMaker(color, decay, base_amp){
  
  var w = 0;
  var v = 0;
  
  return{
    hit : function (vel) {v = vel;},
    set_color: function(c){color = c;},
    set_decay: function(d){decay = d;},
    play : function(){
      if (v*base_amp < 0.001) {
        v = 0;
        return 0;
      }
      
      v *= (1 - decay/sampleRate);
      
      w *= color/(color+1);
      w += v * (2 * Math.random() - 1) * base_amp;
      return w;
    }
  };
  
}


export function Drumhead(freq, harmonics, harmonic_power, decay, freq_decay, base_amp){
  
  var w = 0;
  var v = 0;
  var f = 0;
  var t = 0;
  
  return{
    
    set_decay : function (d){
      decay = d;
    },
    
    hit : function (vel) {
      t = 0;
      f = freq;
      v = vel*base_amp;
      
    },
    play : function(){
      
      if (v * f < 0.001){
        v = 0;
        return 0;
      }
      
      for (var i in harmonics){
        w += Math.pow(-1,i) * v * Math.cos(2 * Math.PI * f * harmonics[i] * t) / Math.pow(harmonics[i],harmonic_power) *(2*Math.PI*f)/sampleRate;
      }
      
      w *= (1 - decay/sampleRate);
      v *= (1 - decay/sampleRate);
      if (t < 0.1) f *= (1 - freq_decay/sampleRate);
      
      t += 1/sampleRate;
      
      return w;
    }
  };
}

  
export function Bassdrum(freq, decay, freq_decay, click_amp, base_amp){
  
  var tap_decay = 5*decay;
  
  var drumhead = Drumhead(freq, bass_drum_harmonics, 2, decay, freq_decay, base_amp);
  var drumnoise = NoiseMaker(0, tap_decay, click_amp);
  
  return{
    
    drumhead : drumhead,
    
    drumnoise : drumnoise,
    
    hit : function(v){
      this.drumhead.hit(v);
      this.drumnoise.hit(v);
    },
    
    play : function(){
      return this.drumhead.play() + this.drumnoise.play();
    }
    
  };
  
}


export function Snaredrum(freq, decay, noise_amp, drumhead_amp){
  
  var drumhead = Drumhead(freq, snare_drum_harmonics, 1, decay, 0, drumhead_amp);
  var drumnoise = NoiseMaker(20, decay, noise_amp);
  
  
  return{
    
    drumhead : drumhead,
    drumnoise : drumnoise,
    
    hit : function(v){
      
      v *= (Math.random()*2-1) * 0.2 + 1;
      this.drumhead.hit(v);
      this.drumnoise.hit(v);
    },
    
    play : function(){
      return this.drumhead.play() + this.drumnoise.play();
    }
    
  };
  
}



export function Tomdrum(freq, decay, freq_decay, drumhead_amp){
  
  var drumhead1 = Drumhead(freq, snare_drum_harmonics, 1, decay, freq_decay, drumhead_amp);
  var drumhead2 = Drumhead(freq*2, extra_harmonics, 1, decay, 0, drumhead_amp);
  
  
  return{
    
    drumhead1 : drumhead1,
    drumhead2 : drumhead2,
    
    hit : function(v){
      
      v *= (Math.random()*2-1) * 0.2 + 1;
      this.drumhead1.hit(v);
      this.drumhead2.hit(v);
    },
    
    play : function(){
      return this.drumhead1.play() + this.drumhead2.play();
    }
    
  };
  
}