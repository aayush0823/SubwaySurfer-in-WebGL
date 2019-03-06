var track_mul=0;
document.onkeypress = function (e) {
    e = e || window.event;
    if(e.key=='a')
    {
        track_mul-=1;
        if(track_mul<-1)
            track_mul=-1;
    }
    else if(e.key=='d')
    {
        track_mul+=1;
        if(track_mul>1)
            track_mul=1;    
    }
};