/*
  Params:
    x : the variable
    a : controls the amplitude
    b : controls the step
    c : controls the 'frequency'
*/
var gaussText={
    Options : null,

    Element : null,
    
    Settings : {
      
      Fx : {
        text : {
            start : 0,
            initial : null,
            timeOut : null
        }
      }
    },
    
    Functions : {
      /*
        Params:
          x : the variable
          a : controls the amplitude
          b : controls the step
          c : controls the 'frequency'
      */
      gauss : function(x, options){
          var a=1.5;  
          var b=8;
          var c=0.4;
          if (options){
              if ('a' in options) a=options.a;
              if ('b' in options) b=options.b;
              if ('c' in options) c=options.c;
          }
          return a*Math.exp(-(Math.pow(x-b,2)/2*Math.pow(c,2)))
      }
    }
}


/*
  Params:
    options : 
    {
      x : the variable
      a : controls the amplitude
      b : controls the step
      c : controls the 'frequency'
    }
*/
$.fn.gaussText=function(options){
    var gt_s_fx=gaussText.Settings.Fx;
    if (!gt_s_fx.text.initial) {
        gt_s_fx.text.initial=$('#woohoo').html();
    }

    /* First reinitialization of the text before application */
    $('#woohoo').html(gt_s_fx.text.initial);

    var start=0;
    var stop=$(this).html().length;
    var u='em';
    var u_s=1;
    var g_options=null
    if (options){
        if ('text' in options){
          if ('start' in options.text) start=options.text.start;
          if ('stop' in options.text)  stop=options.text.stop;
          if ('unit' in options.text)  u=options.text.unit;
          if ('unit_start' in options.text) u_s=options.text.unit_start;
        }
        if ('gauss' in options) g_options=options.gauss;
    }

    var text=$(this).html().substring(start,stop);
    var gaussed_text='';
    for(var j=0; j<stop-start-1;j++){
      var g=gaussText.Functions.gauss(j, g_options);
      gaussed_text+='<font style="font-size:[unit_value][unit];">[char]</font>'
        .replace('[unit_value]' , (u_s+g).toString())
        .replace('[unit]'       , (u).toString())
        .replace('[char]'       , text.substring(j,j+1))
      ;
    }
    $(this).html($(this).html().replace(text, gaussed_text));
};

$.fn.gaussTextFx=function(options){
    gaussText.Options=options;
    gaussText.Element = $(this);

    /* Settings & configuration */
    var gt_s_fx=gaussText.Settings.Fx;
    if (gt_s_fx.text.start==0) {
        /* Text start variable for movement effect*/
        gt_s_fx.text.start=gt_s_fx.text.initial.length;
        if (options && 'text' in options  && 'stop' in options.text){
            gt_s_fx.text.start=options.text.stop;
        }
    }
    
    if (!options) options={};
    if (!'text' in options) options.text={ 'start' : gt_s_fx.text.start };
    if (!'start' in options.text) options.text['start'] = gt_s_fx.text.start;
    else {
        options.text.start=gt_s_fx.text.start;
    }

    /* Actual effect application */
    $(this).gaussText(options);
    
    /* Text start decrement for movement effect */
    gt_s_fx.text.start--;

    var speed=100;
    if (options && 'fx' in options && 'speed' in options.fx) {
        speed=options.fx.speed;
    }
    gaussText.Settings.Fx.text.timeOut=setTimeout('gaussText.Element.gaussTextFx(gaussText.Options)', speed);
};

