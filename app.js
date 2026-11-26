(function(){
var S=function(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
var GTM='GTM-K8L8QFPS',theme=S('cc-theme2')||'light',g=function(i){return document.getElementById(i)},v=function(i){return +g(i).value||0};
var F=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}),F2=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});
function setTheme(){document.documentElement.dataset.theme=theme;var b=g('th');if(b)b.textContent=theme==='dark'?'☀ Claro':'☾ Oscuro'}
function bind(ids,fn){if(!g(ids[0]))return;ids.forEach(function(i){g(i).addEventListener('input',fn)});fn()}
bind(['a','b','r','y'],function(){var P=v('a'),m=v('b'),r=v('r')/1200,n=Math.max(1,v('y'))*12,f=r?P*Math.pow(1+r,n)+m*((Math.pow(1+r,n)-1)/r):P+m*n,p=P+m*n;g('o1').textContent=F.format(f);g('o2').textContent='Aportado: '+F.format(p)+' · Intereses: '+F.format(f-p)});
bind(['s_g','s_y','s_p','s_r'],function(){var G=v('s_g'),n=Math.max(1,v('s_y'))*12,P=v('s_p'),r=v('s_r')/1200,m=r?(G-P*Math.pow(1+r,n))*r/(Math.pow(1+r,n)-1):(G-P)/n;g('s_o').textContent=F2.format(Math.max(0,m))});
bind(['b_i'],function(){var i=v('b_i');g('b_o').innerHTML='Necesidades (50 %): '+F2.format(i*.5)+'<br>Deseos (30 %): '+F2.format(i*.3)+'<br>Ahorro (20 %): '+F2.format(i*.2)});
bind(['h_i','h_d','h_p'],function(){var i=v('h_i'),d=v('h_d'),p=v('h_p');g('h_o').textContent=F.format(Math.max(0,i*.30-d))+' – '+F.format(Math.max(0,i*.35-d));g('h_s').textContent='Ahorro previo orientativo (≈30 % del precio): '+F.format(p*.3)});
bind(['v_a','v_r','v_m'],function(){var x=v('v_a'),r=v('v_r')/100,b=g('v_m').value==='1'?x/(1+r):x,i=b*r;g('v_n').textContent='Base: '+F2.format(b);g('v_o').textContent='Total: '+F2.format(b+i);g('v_s').textContent='IVA: '+F2.format(i)});
function loadGTM(){if(window.__gtm||!GTM)return;window.__gtm=1;window.dataLayer=window.dataLayer||[];dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtm.js?id='+GTM;document.head.appendChild(s)}
function banner(){if(S('cc-ck'))return;var d=document.createElement('div');d.id='ck';d.setAttribute('role','dialog');d.setAttribute('aria-label','Cookies');d.innerHTML='<span>Usamos cookies de analítica solo si las aceptas. <a href="cookies.html" style="text-decoration:underline">Más info</a></span><span><button class="btn" id="ck-n">Rechazar</button> <button class="btn p" style="padding:8px 18px" id="ck-y">Aceptar</button></span>';document.body.appendChild(d);g('ck-y').onclick=function(){S('cc-ck','yes');d.remove();loadGTM()};g('ck-n').onclick=function(){S('cc-ck','no');d.remove()}}
var tb=g('th');if(tb)tb.onclick=function(){theme=theme==='dark'?'light':'dark';S('cc-theme2',theme);setTheme()};

var rd=matchMedia('(prefers-reduced-motion: reduce)').matches,hd=document.querySelector('header'),pr=g('prog'),st=g('story');
function onScroll(){var y=window.pageYOffset;if(hd&&document.body.classList.contains('home'))hd.classList.toggle('solid',y>(st?st.offsetHeight-innerHeight-80:40));if(pr){var h=document.documentElement.scrollHeight-innerHeight;pr.style.width=(h>0?Math.min(100,y/h*100):0)+'%'}}
addEventListener('scroll',onScroll,{passive:true});onScroll();
var rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window&&!rd){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});rv.forEach(function(el){io.observe(el)})}else rv.forEach(function(el){el.classList.add('in')});
function count(el){var n=+el.dataset.n,t0=null;if(rd||!n){el.textContent=n;return}function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/1200);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
var cn=document.querySelectorAll('[data-n]');
if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);io2.unobserve(e.target)}})},{threshold:.5});cn.forEach(function(el){io2.observe(el)})}else cn.forEach(function(el){el.textContent=el.dataset.n});
setTheme();if(S('cc-ck')==='yes')loadGTM();banner();
})();
