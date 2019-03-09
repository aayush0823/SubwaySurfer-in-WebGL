var track_mul=0;
var jump =0;
var grey=0;
var dead=0;
document.onkeypress = function (e) {
    e = e || window.event;
    if(e.key=='a' && dead==0)
    {
        track_mul-=1;
        if(track_mul<-1)
            track_mul=-1;
    }
    else if(e.key=='d' && dead==0)
    {
        track_mul+=1;
        if(track_mul>1)
            track_mul=1;    
    }
    else if(e.key==' ' && jet_pack==0 && dead==0)
    {
    	if(jump==0)
	        jump=1;    
    }
    else if(e.key=='g')
    {
  		grey=1-grey;
    }
};