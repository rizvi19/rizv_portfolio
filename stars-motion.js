(()=>{
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c=document.getElementById('starCanvas');
  if(!c) return;
  const x=c.getContext('2d',{alpha:true});
  let d=Math.min(devicePixelRatio||1,2),seed=1947,stars=[],scrollDepth=0;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  function build(){
    d=Math.min(devicePixelRatio||1,2);
    c.width=Math.round(innerWidth*d);c.height=Math.round(innerHeight*d);
    c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';
    x.setTransform(d,0,0,d,0,0);seed=1947;
    const m=24,w=Math.max(1,innerWidth-m*2),h=Math.max(1,innerHeight-m*2);
    const n=Math.max(120,Math.min(360,Math.round(innerWidth*innerHeight/5200)));
    stars=[];
    for(let i=0;i<n;i++){
      let sx=m+rnd()*w,sy=m+rnd()*h;
      if(rnd()<.30){const band=innerHeight*(.72-.34*(sx/Math.max(innerWidth,1)));sy=Math.max(m,Math.min(innerHeight-m,band+(rnd()-.5)*innerHeight*.28));}
      const mag=rnd(),r=mag>.985?1.55:mag>.93?1.05:mag>.64?.72:.45;
      const a=mag>.985?.88:mag>.93?.68:.27+rnd()*.30;
      stars.push({x:sx,y:sy,r,a,warm:rnd()>.84,px:rnd()*Math.PI*2,py:rnd()*Math.PI*2,tw:rnd()*Math.PI*2,dx:1.2+rnd()*3.1,dy:.9+rnd()*2.6,sx:.00013+rnd()*.00018,sy:.00010+rnd()*.00016,ts:.00022+rnd()*.00032,depth:.25+rnd()*.75});
    }
  }
  function draw(t=0){
    x.clearRect(0,0,innerWidth,innerHeight);
    const ms=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const sp=Math.min(1,Math.max(0,scrollY/ms));
    scrollDepth+=((sp*8)-scrollDepth)*.055;
    for(const s of stars){
      const xx=Math.max(8,Math.min(innerWidth-8,s.x+Math.sin(t*s.sx+s.px)*s.dx));
      const yy=Math.max(8,Math.min(innerHeight-8,s.y+Math.cos(t*s.sy+s.py)*s.dy-scrollDepth*s.depth));
      const pulse=1+Math.sin(t*s.ts+s.tw)*(s.r>1?.075:.035);
      const a=Math.max(.16,Math.min(.92,s.a*pulse));
      x.beginPath();x.fillStyle=s.warm?`rgba(244,223,181,${a})`:`rgba(220,228,242,${a})`;x.arc(xx,yy,s.r,0,Math.PI*2);x.fill();
      if(s.r>1.2){x.strokeStyle=`rgba(240,224,192,${a*.20})`;x.lineWidth=.6;x.beginPath();x.moveTo(xx-3.2,yy);x.lineTo(xx+3.2,yy);x.moveTo(xx,yy-3.2);x.lineTo(xx,yy+3.2);x.stroke();}
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize',build);build();requestAnimationFrame(draw);
})();
