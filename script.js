const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
const title=document.getElementById('mainTitle');
const heartBtn=document.getElementById('heartMode');
const wordBtn=document.getElementById('wordMode');
const photoInput=document.getElementById('photoInput');
const photoCard=document.getElementById('photoCard');
const chosenPhoto=document.getElementById('chosenPhoto');
const removePhoto=document.getElementById('removePhoto');
const musicToggle=document.getElementById('musicToggle');
const musicStatus=document.getElementById('musicStatus');
const musicWidget=document.querySelector('.music-widget');

let W=0,H=0,dpr=1,particles=[],targets=[],mode='heart',audioCtx=null,masterGain=null,musicTimer=null,musicOn=false;
const palette=['#ff315f','#ff6687','#ff9bb0','#61f7d2','#d8fff5','#ffffff'];
const rand=(a,b)=>Math.random()*(b-a)+a;

function resize(){
  dpr=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
  canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);makeTargets();
}
function heartXY(t,s){return{x:16*Math.pow(Math.sin(t),3)*s,y:-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*s};}
function textTargets(text){
  const c=document.createElement('canvas'),cc=c.getContext('2d');
  c.width=Math.min(1000,W);c.height=Math.min(300,H);
  const size=Math.min(c.width/(text.length*.64),c.height*.52,130);
  cc.fillStyle='#fff';cc.textAlign='center';cc.textBaseline='middle';
  cc.font=`700 ${size}px Arial`;cc.fillText(text,c.width/2,c.height/2);
  const data=cc.getImageData(0,0,c.width,c.height).data,pts=[];
  for(let y=0;y<c.height;y+=4)for(let x=0;x<c.width;x+=4){if(data[(y*c.width+x)*4+3]>100)pts.push({x:x-c.width/2,y:y-c.height/2});}
  return pts;
}
function makeTargets(){
  targets=[];
  if(mode==='heart'){
    const count=Math.min(1000,Math.max(430,Math.floor(W*H/1200))),s=Math.min(W,H)*.0145;
    for(let i=0;i<count;i++){
      const t=Math.random()*Math.PI*2,r=Math.sqrt(Math.random());
      const p=heartXY(t,s*r*rand(.88,1.05));
      targets.push({x:W/2+p.x,y:H*.46+p.y});
    }
    for(let i=0;i<Math.floor(count*.28);i++){
      const t=Math.random()*Math.PI*2,p=heartXY(t,s*rand(.9,1.05));
      targets.push({x:W/2+p.x,y:H*.46+p.y});
    }
  }else{
    const pts=textTargets('I LOVE YOU'),scale=Math.min(1,(W*.8)/(Math.max(1,...pts.map(p=>Math.abs(p.x)))*2));
    targets=pts.map(p=>({x:W/2+p.x*scale,y:H*.47+p.y*scale}));
  }
  while(particles.length<targets.length)particles.push({x:rand(0,W),y:rand(0,H),vx:rand(-.4,.4),vy:rand(-.4,.4),r:rand(.65,1.8),alpha:rand(.45,.95),color:palette[Math.floor(Math.random()*palette.length)],phase:rand(0,6)});
  if(particles.length>targets.length)particles.length=targets.length;
}
function frame(t){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<particles.length;i++){
    const p=particles[i],tar=targets[i];if(!tar)continue;
    p.vx+=(tar.x-p.x)*.018;p.vy+=(tar.y-p.y)*.018;p.vx*=.91;p.vy*=.91;
    p.x+=p.vx+Math.sin(t*.0008+p.phase)*.12;p.y+=p.vy+Math.cos(t*.0007+p.phase)*.12;
    ctx.globalAlpha=p.alpha*(.72+.28*Math.sin(t*.0018+p.phase));ctx.fillStyle=p.color;
    ctx.shadowBlur=4;ctx.shadowColor=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.shadowBlur=0;ctx.globalAlpha=1;requestAnimationFrame(frame);
}
function burst(x,y){
  const ring=document.createElement('span');ring.className='bloom';ring.style.left=x+'px';ring.style.top=y+'px';
  document.querySelector('.scene').appendChild(ring);setTimeout(()=>ring.remove(),900);
  for(let i=0;i<particles.length;i+=7){const p=particles[i];p.vx+=rand(-5,5);p.vy+=rand(-5,5);}
  title.classList.add('pulse');setTimeout(()=>title.classList.remove('pulse'),450);
}
heartBtn.addEventListener('click',()=>{mode='heart';makeTargets();burst(W/2,H/2);heartBtn.textContent='♡ Heart sent!';setTimeout(()=>heartBtn.textContent='♡ Send a heart',1300);});
wordBtn.addEventListener('click',()=>{mode=mode==='words'?'heart':'words';makeTargets();wordBtn.textContent=mode==='words'?'♡ Back to heart':'✦ Form the words';});
document.getElementById('scene').addEventListener('pointerdown',e=>{
  if(e.target.closest('button,label'))return;
  burst(e.clientX,e.clientY);
});
photoInput.addEventListener('change',()=>{
  const file=photoInput.files?.[0];if(!file||!file.type.startsWith('image/'))return;
  const reader=new FileReader();reader.onload=()=>{chosenPhoto.src=reader.result;photoCard.hidden=false;};reader.readAsDataURL(file);
});
removePhoto.addEventListener('click',()=>{photoCard.hidden=true;chosenPhoto.src='';photoInput.value='';});

// Original synthesized ambient music (no external audio file needed).
function note(freq,start,duration,type='sine',gain=.035){
  if(!audioCtx||!masterGain)return;
  const osc=audioCtx.createOscillator(),g=audioCtx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,start);
  g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(gain,start+.12);
  g.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(g);g.connect(masterGain);osc.start(start);osc.stop(start+duration+.05);
}
function scheduleMusic(){
  if(!audioCtx||!musicOn)return;
  const now=audioCtx.currentTime;
  // Gentle, original four-chord ambient progression.
  const chords=[[261.63,329.63,392.00],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
  const chord=chords[Math.floor((now*0.5)%chords.length)];
  chord.forEach((f,i)=>note(f,now+i*.16,2.8,'sine',.018));
  note([523.25,493.88,392,440][Math.floor(now/3)%4],now+.25,1.5,'sine',.012);
  musicTimer=setTimeout(scheduleMusic,2600);
}
async function toggleMusic(){
  if(!musicOn){
    try{
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext){musicStatus.textContent='Audio not supported';return;}
      audioCtx=audioCtx||new AudioContext();await audioCtx.resume();
      masterGain=masterGain||audioCtx.createGain();masterGain.gain.value=.55;masterGain.connect(audioCtx.destination);
      musicOn=true;musicWidget.classList.add('playing');musicStatus.textContent='Music on · ambient melody';musicToggle.setAttribute('aria-label','Matikan musik');scheduleMusic();
    }catch(e){musicStatus.textContent='Could not start audio';}
  }else{
    musicOn=false;clearTimeout(musicTimer);musicWidget.classList.remove('playing');musicStatus.textContent='Music off · tap to play';musicToggle.setAttribute('aria-label','Putar musik');
    if(masterGain&&audioCtx)masterGain.gain.setTargetAtTime(.0001,audioCtx.currentTime,.08);
    setTimeout(()=>{if(!musicOn&&masterGain)masterGain.gain.value=.55;},350);
  }
}
musicToggle.addEventListener('click',toggleMusic);
window.addEventListener('resize',resize);
resize();requestAnimationFrame(frame);
