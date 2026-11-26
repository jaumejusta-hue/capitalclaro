(function(){
var cv=document.getElementById('hero3d');if(!cv||!window.THREE)return;
var T=THREE,R;try{R=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){cv.style.display='none';return}
R.outputEncoding=T.sRGBEncoding;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var scene=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,100);
scene.add(new T.AmbientLight(0xffffff,.6));
var dl=new T.DirectionalLight(0xffffff,.95);dl.position.set(4,6,5);scene.add(dl);
var pl=new T.PointLight(0xffc977,1.2,30);pl.position.set(-5,2,4);scene.add(pl);
var g=new T.Group();scene.add(g);
var base=new T.Mesh(new T.CylinderGeometry(3.7,3.9,.25,64),new T.MeshStandardMaterial({color:0x1E3A5F,metalness:.4,roughness:.45}));base.position.y=-1.4;g.add(base);
var bars=[],coins=[],bm=new T.MeshStandardMaterial({color:0x7FA6DB,metalness:.35,roughness:.3});
[.8,1.3,1.9,2.6,3.4].forEach(function(h,i){var m=new T.Mesh(new T.BoxGeometry(.62,1,.62),bm);m.userData.h=h;m.position.set(-2.5+i*.8,0,.2);bars.push(m);g.add(m)});
var gold=new T.MeshStandardMaterial({color:0xD9A441,metalness:.85,roughness:.3});
for(var i=0;i<6;i++){var c=new T.Mesh(new T.CylinderGeometry(.62,.62,.12,48),gold);c.position.set(2.3,-1.2+i*.13,.4);c.rotation.y=i*.4;coins.push(c);g.add(c)}
var cs=document.createElement('canvas');cs.width=cs.height=256;var x=cs.getContext('2d');
x.fillStyle='#D9A441';x.fillRect(0,0,256,256);x.strokeStyle='#8A6A2F';x.lineWidth=14;x.beginPath();x.arc(128,128,112,0,7);x.stroke();
x.fillStyle='#8A6A2F';x.font='bold 150px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('€',128,138);
var tex=new T.CanvasTexture(cs);tex.encoding=T.sRGBEncoding;
var face=new T.MeshStandardMaterial({map:tex,metalness:.6,roughness:.35});
var coin=new T.Mesh(new T.CylinderGeometry(1.15,1.15,.22,64),[gold,face,face]);coin.rotation.x=Math.PI/2;
var pivot=new T.Object3D();pivot.add(coin);g.add(pivot);
var pin=document.getElementById('story'),word=document.querySelector('.hero-word'),glass=document.querySelector('.glass'),note=document.querySelector('.hero-note'),chn=document.getElementById('chn'),caps=[].slice.call(document.querySelectorAll('.cap'));
var RG=[[.08,.16,.3,.38],[.36,.44,.58,.66],[.64,.72,.84,.92]];
function seg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)))}
function ease(t){return t*t*(3-2*t)}
var mx=0,my=0,tx=0,ty=0,vis=true,bz=11.5,lp=-1,P=reduce?1:0;
function size(){var w=cv.clientWidth||1,h=cv.clientHeight||1;R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();var a=w/h;bz=a<1?20:a<1.5?15:11.5;g.position.y=a<1?-.8:-.2}
function progress(){if(reduce||!pin)return 1;var r=pin.getBoundingClientRect(),t=pin.offsetHeight-innerHeight;return t>0?Math.max(0,Math.min(1,-r.top/t)):1}
function ui(p){
 if(word){word.style.opacity=1-.55*seg(p,.1,.75);word.style.transform='translateY(-'+(58+p*9)+'%)'}
 caps.forEach(function(el,i){var r=RG[i],a=seg(p,r[0],r[1]),o=seg(p,r[2],r[3]);el.style.opacity=a*(1-o);el.style.transform='translateY('+((1-a)*26-o*26)+'px)'});
 if(glass){var o=Math.max(1-seg(p,.05,.13),seg(p,.9,.98));glass.style.opacity=o;glass.style.pointerEvents=o>.5?'auto':'none'}
 if(note)note.style.opacity=1-seg(p,0,.06);
 if(chn)chn.textContent=p<.36?'01':p<.64?'02':'03'}
function frame(t){t=t/1000;var p=progress();tx+=(mx-tx)*.05;ty+=(my-ty)*.05;
 bars.forEach(function(m,i){var s=.3+.7*ease(seg(p,i*.05,.55+i*.05)),h=m.userData.h*s;m.scale.y=h;m.position.y=-1.275+h/2});
 coins.forEach(function(c,i){c.visible=reduce||p>.2+i*.08});
 pivot.position.set(.9,1.4+ease(p)*.8,1.2);pivot.rotation.y=t*.9+p*6;
 g.rotation.y=Math.sin(t*.4)*.3+tx*.5+p*.7;g.rotation.x=ty*.1;
 cam.position.set(0,1.3,bz*(1.12-.16*ease(p)));cam.lookAt(0,.5,0);
 if(p!==lp){ui(p);lp=p}
 R.render(scene,cam)}
function loop(t){if(vis&&!document.hidden)frame(t);requestAnimationFrame(loop)}
size();addEventListener('resize',function(){size();frame(0)});
var hero=cv.parentNode;hero.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
if('IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting}).observe(pin||hero);
frame(0);if(reduce){ui(1)}else requestAnimationFrame(loop);
})();
