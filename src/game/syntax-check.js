
(()=>{
const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d'),shell=$('shell');
ctx.imageSmoothingEnabled=false;
const ui={level:$('level'),activity:$('activity'),goal:$('goal'),members:$('members'),streak:$('streak'),catHud:$('catHud'),modeHud:$('modeHud'),mrrChip:$('mrrChip'),winChip:$('winChip'),mrr:$('mrr'),winMrr:$('winMrr'),notice:$('notice'),decisionText:$('decisionText'),startOverlay:$('startOverlay'),pauseOverlay:$('pauseOverlay'),settingsOverlay:$('settingsOverlay'),category:$('category'),difficulty:$('difficulty'),settingsCategory:$('settingsCategory'),settingsDifficulty:$('settingsDifficulty'),categoryInfo:$('categoryInfo'),playerName:$('playerName'),swipeHint:$('swipeHint')};
const cats={
hobbies:{name:'Hobbies',f:.78,m:1,icons:['🎸','🎹','⚽','🎨','📷'],desc:'Lower competition.'},
music:{name:'Music',f:.88,m:1.1,icons:['🎸','🎹','🥁','🎤','🎧'],desc:'Creative, moderate competition.'},
money:{name:'Money',f:1.35,m:2.2,icons:['💵','📈','💼','🪙','🏦'],desc:'Very competitive.'},
spirituality:{name:'Spirituality',f:.92,m:1.2,icons:['🧘','✨','🌙','🕯️','🌿'],desc:'Balanced growth.'},
tech:{name:'Tech',f:1.28,m:2,icons:['💻','🤖','⌨️','🧠','📱'],desc:'Fast and highly competitive.'},
health:{name:'Health',f:1.08,m:1.45,icons:['🥗','🏋️','🧘','❤️','🏃'],desc:'Strong demand.'},
careers:{name:'Careers',f:1.05,m:1.4,icons:['💼','📄','🎯','🧑‍💻','🏢'],desc:'Steady competition.'},
sports:{name:'Sports',f:.95,m:1.25,icons:['⚽','🏀','🎾','🏈','🏆'],desc:'Active members.'},
love:{name:'Love',f:.9,m:1.15,icons:['❤️','💬','🌹','💍','🤝'],desc:'Lower speed, spam still matters.'},
selfImprovement:{name:'Self Improvement',f:1.15,m:1.65,icons:['📚','🎯','🧠','⏰','🚀'],desc:'Popular and demanding.'}
};
const diffs={easy:{speed:.85,h:.75,g:.85,base:2000},normal:{speed:1,h:1,g:1,base:3000},hard:{speed:1.18,h:1.25,g:1.2,base:5000}};
const W=1280,H=720,roadTop=105,roadBottom=765,road={tl:358,tr:922,bl:45,br:1235};
let s;
function populate(){for(const[k,c]of Object.entries(cats)){for(const el of[ui.category,ui.settingsCategory]){const o=document.createElement('option');o.value=k;o.textContent=c.name;el.appendChild(o)}}}
function bounds(y){const t=Math.max(0,Math.min(1,(y-roadTop)/(roadBottom-roadTop)));return{l:road.tl+(road.bl-road.tl)*t,r:road.tr+(road.br-road.tr)*t}}
function laneX(l,y){const b=bounds(y);return b.l+(b.r-b.l)*((l+.5)/3)}
function cat(){return cats[s.category]} function diff(){return diffs[s.difficulty]}
function goal(l){let b=l===1?200:l===2?500:500+((l-2)*(l-1)/2)*400;return Math.round(b*cat().f*diff().g/10)*10}
function winGoal(){return Math.round(diff().base*cat().m/100)*100}
function key(){return`skool:${s.category}:${s.difficulty}:${s.name}`}
function save(){const old=JSON.parse(localStorage.getItem(key())||'{}');localStorage.setItem(key(),JSON.stringify({activity:Math.max(old.activity||0,s.activity),members:Math.max(old.members||1,s.members),mrr:Math.max(old.mrr||0,s.mrr),level:Math.max(old.level||1,s.level)}))}
function reset(){s={running:false,paused:false,name:ui.playerName.value.trim()||'Player',category:ui.category.value,difficulty:ui.difficulty.value,player:{lane:1,x:laneX(1,H-140),tx:laneX(1,H-140),y:H-140},objects:[],particles:[],followers:[],members:1,activity:0,level:1,streak:0,shield:0,mrr:0,monetized:false,offered:false,won:false,speed:4.2*cats[ui.category.value].f*diffs[ui.difficulty.value].speed,spawn:0,time:0,offset:0,decision:null,decisionCooldown:360,notice:0,boost:false,boostFrames:0,boostSpawn:0,boostLane:1,boostLaneTimer:0,empty:0};syncFollowers();hud()}
function hud(){ui.level.textContent=s.level;ui.activity.textContent=Math.floor(s.activity);ui.goal.textContent=goal(s.level);ui.members.textContent=s.members;ui.streak.textContent=s.streak;ui.catHud.textContent=cat().name.toUpperCase();ui.modeHud.textContent=s.monetized?'MONETIZED':'FREE';ui.mrr.textContent=Math.floor(s.mrr);ui.winMrr.textContent=winGoal();ui.mrrChip.classList.toggle('hidden',!s.monetized);ui.winChip.classList.toggle('hidden',!s.monetized)}
function notice(t){ui.notice.textContent=t;ui.notice.classList.remove('hidden');s.notice=110}
function syncFollowers(){while(s.followers.length<s.members-1)s.followers.push({icon:Math.floor(Math.random()*cat().icons.length),phase:Math.random()*30});s.followers.length=Math.max(0,s.members-1)}
function move(d){if(!s.running||s.paused)return;s.player.lane=Math.max(0,Math.min(2,s.player.lane+d));s.player.tx=laneX(s.player.lane,s.player.y)}
function addMembers(n){const before=s.members;s.members=Math.max(1,s.members+n);const actual=s.members-before;s.activity=Math.max(0,s.activity+actual*10);if(s.monetized)s.mrr=Math.max(0,s.mrr+actual*30);syncFollowers();notice((actual>0?'+':'')+actual+' members');save()}
function start(){reset();s.running=true;ui.startOverlay.classList.add('hidden');ui.pauseOverlay.classList.add('hidden');ui.settingsOverlay.classList.add('hidden');ui.swipeHint.style.display='block';ui.swipeHint.style.opacity='1';setTimeout(()=>ui.swipeHint.style.opacity='.7',2500)}
function pause(force=false){if(!s.running)return;s.paused=force?false:!s.paused;ui.pauseOverlay.classList.toggle('hidden',!s.paused)}
function addMRR(n){s.mrr=Math.max(0,s.mrr+n);if(s.mrr>=winGoal()&&!s.won){s.won=true;notice('🏆 You won the Skool Games!');s.paused=true;setTimeout(()=>{ui.pauseOverlay.querySelector('h1').textContent='YOU WON!';ui.pauseOverlay.classList.remove('hidden')},400)}}
function spawn(){
if(s.decision)return;
if(s.boost){const count=1+Math.floor(Math.random()*5),sp=45+Math.random()*25;for(let i=0;i<count;i++){const y=roadTop+8-i*sp;s.objects.push({type:'member',lane:s.boostLane,y,x:laneX(s.boostLane,y),icon:Math.floor(Math.random()*cat().icons.length)})}return}
const lane=Math.floor(Math.random()*3),r=Math.random(),h=cat().f*diff().h*(s.monetized?1.28:1);
const member=Math.max(.08,(s.monetized?.16:.27)-(h-1)*.1),post=member+.16,flame=post+.11,boost=flame+.007;
let c=boost,type=r<member?'member':r<post?'post':r<flame?'flame':r<boost?'boost':s.monetized&&r<(c+=.055)?'trial':s.monetized&&r<(c+=.06)?'dollar':r<(c+=Math.min(.25,.15*h))?'spam':'churn';
s.objects.push({type,lane,y:roadTop+8,x:laneX(lane,roadTop+8),icon:Math.floor(Math.random()*cat().icons.length)})
}
function collect(o){
if(o.hit)return;o.hit=true;
if(o.type==='member'){s.members++;s.activity+=10;if(s.monetized)addMRR(30);syncFollowers()}
else if(o.type==='post')s.activity+=20;
else if(o.type==='flame'){s.activity+=3;s.streak++;s.shield=Math.min(3,s.shield+1)}
else if(o.type==='boost'){s.boost=true;s.boostFrames=600;s.boostSpawn=0;s.boostLane=Math.floor(Math.random()*3);s.boostLaneTimer=80;s.objects=s.objects.filter(x=>x===o||x.type==='member');notice('🚀 Growth Boost!')}
else if(o.type==='trial'){s.members+=10;s.activity+=100;addMRR(300);syncFollowers();notice('7-day free trial!')}
else if(o.type==='dollar'){addMRR(100);notice('+$100 MRR')}
else if(o.type==='spam'){if(Math.random()<.45){s.members++;s.activity+=10;if(s.monetized)addMRR(30);syncFollowers();notice('Good member!')}else{s.activity=Math.floor(s.activity/2);notice('Spam member.')}}
else if(o.type==='churn'){if(s.shield)s.shield--;else{const lost=Math.min(s.monetized?3:2,s.members-1);s.members-=lost;s.activity=Math.max(0,s.activity-lost*10);if(s.monetized)addMRR(-lost*30);syncFollowers()}}
while(s.activity>=goal(s.level)){s.level++;s.speed=(4.2+(s.level-1)*.85)*cat().f*diff().speed;notice('Level '+s.level+'!')}
hud();save()
}
function decision(){
if(s.activity>=500&&!s.offered&&!s.monetized){s.decision={kind:'mon',y:roadTop+20,left:{lane:0,label:'MONETIZE'},right:{lane:2,label:'DON’T'}};ui.decisionText.textContent='MONETIZE YOUR COMMUNITY?'}
else if(Math.random()<.35){s.decision={kind:'about',y:roadTop+20,left:{lane:0,label:'ADJUST ABOUT PAGE'},right:{lane:2,label:'MAKE NO ADJUSTMENTS'}};ui.decisionText.textContent='ABOUT PAGE DECISION'}
else{const pairs=[[{label:'+1',n:1},{label:'-4',n:-4}],[{label:'x2',a:'double'},{label:'-20',n:-20}],[{label:'+10',n:10},{label:'HALF',a:'half'}]];const p=pairs[Math.floor(Math.random()*pairs.length)],swap=Math.random()<.5;s.decision={kind:'quick',y:roadTop+20,left:{lane:0,...(swap?p[1]:p[0])},right:{lane:2,...(swap?p[0]:p[1])}};ui.decisionText.textContent='FAST DECISION'}
ui.decisionText.classList.remove('hidden')
}
function resolve(c){
if(s.decision.kind==='mon'){if(c.label==='MONETIZE'){s.monetized=true;notice('Community monetized!')}else notice('Community stays free');s.offered=true}
else if(s.decision.kind==='about'){const n=Math.random()<.5?(c.label.startsWith('ADJUST')?10:4):(c.label.startsWith('ADJUST')?-10:-4);addMembers(n)}
else if(c.a==='double')addMembers(s.members);else if(c.a==='half')addMembers(-Math.max(1,Math.floor(s.members/2)));else addMembers(c.n);
s.decision=null;ui.decisionText.classList.add('hidden');s.decisionCooldown=320+Math.random()*350;hud()
}
function update(){
if(!s.running||s.paused)return;s.time++;
const speed=(s.monetized?s.speed*1.12:s.speed)*(s.boost?1.65:1);s.offset=(s.offset+speed)%72;s.player.tx=laneX(s.player.lane,s.player.y);s.player.x+=(s.player.tx-s.player.x)*.24;
if(!s.boost&&!s.decision){if(s.activity>=500&&!s.offered&&!s.monetized)decision();else if(--s.decisionCooldown<=0)decision()}
if(s.boost){s.boostFrames--;s.boostSpawn--;s.boostLaneTimer--;if(s.boostLaneTimer<=0){let n=Math.floor(Math.random()*3);if(n===s.boostLane)n=(n+1)%3;s.boostLane=n;s.boostLaneTimer=70+Math.random()*45}if(s.boostSpawn<=0){spawn();s.boostSpawn=48+Math.random()*30}if(s.boostFrames<=0){s.boost=false;notice('Growth Boost ended')}}
else if(--s.spawn<=0){spawn();if(Math.random()<.17)setTimeout(()=>{if(s.running&&!s.paused&&!s.decision&&!s.boost)spawn()},120);s.spawn=Math.max(17,52-s.level*3-(s.monetized?8:0))+18+Math.random()*24}
for(const o of s.objects){o.y+=speed;o.x=laneX(o.lane,o.y);if(!o.hit&&Math.abs(o.y-s.player.y)<42&&Math.abs(o.x-s.player.x)<65)collect(o)}
s.objects=s.objects.filter(o=>o.y<H+90&&!o.hit);
if(s.decision){s.decision.y+=speed*.9;const lx=laneX(0,s.decision.y),rx=laneX(2,s.decision.y);if(Math.abs(s.decision.y-s.player.y)<48){if(Math.abs(s.player.x-lx)<78)resolve(s.decision.left);else if(Math.abs(s.player.x-rx)<78)resolve(s.decision.right)}if(s.decision&&s.decision.y>s.player.y+80){s.decision=null;ui.decisionText.classList.add('hidden');s.spawn=0}}
if(!s.decision&&!s.boost&&s.objects.length===0){if(++s.empty>70){spawn();s.empty=0}}else s.empty=0;
if(s.notice>0&&--s.notice===0)ui.notice.classList.add('hidden');hud()
}
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function roadDraw(){ctx.fillStyle='#cfeaf7';ctx.fillRect(0,0,W,H);ctx.fillStyle='#9fdb96';ctx.fillRect(0,roadTop,W,H-roadTop);ctx.beginPath();ctx.moveTo(road.bl,roadBottom);ctx.lineTo(road.tl,roadTop);ctx.lineTo(road.tr,roadTop);ctx.lineTo(road.br,roadBottom);ctx.closePath();ctx.fillStyle='#3b4655';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=12;ctx.stroke();ctx.strokeStyle='#071426';ctx.lineWidth=4;ctx.stroke();ctx.save();ctx.clip();for(let d=1;d<=2;d++)for(let y=roadTop+18+s.offset;y<H;y+=72){const b1=bounds(y),b2=bounds(y+34),x1=b1.l+(b1.r-b1.l)*d/3,x2=b2.l+(b2.r-b2.l)*d/3;ctx.strokeStyle='#fff';ctx.lineWidth=4+10*(y-roadTop)/(roadBottom-roadTop);ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y+34);ctx.stroke()}ctx.restore()}
function runner(x,y,sc=.8,shirt='#2f61ff',icon=''){const z=Math.sin(s.time*.28);ctx.globalAlpha=.2;px(x-16*sc,y+28*sc,32*sc,7*sc,'#071426');ctx.globalAlpha=1;px(x-10*sc,y+10*sc,8*sc,(17+z*4)*sc,'#071426');px(x+2*sc,y+10*sc,8*sc,(17-z*4)*sc,'#071426');px(x-14*sc,y-10*sc,28*sc,25*sc,shirt);px(x-20*sc,y-5*sc,7*sc,19*sc,'#f0b58f');px(x+13*sc,y-5*sc,7*sc,19*sc,'#f0b58f');px(x-11*sc,y-27*sc,22*sc,19*sc,'#f0b58f');px(x-13*sc,y-31*sc,26*sc,11*sc,'#3b241a');if(icon){ctx.font=Math.max(12,18*sc)+'px sans-serif';ctx.textAlign='center';ctx.fillText(icon,x,y+7*sc)}}
function followers(){const vis=Math.min(28,s.followers.length);for(let i=0;i<vis;i++){const row=Math.floor(i/5),col=i%5,count=Math.min(5,vis-row*5),y=s.player.y+54+row*35,off=(col-(count-1)/2)*30,b=bounds(y),x=Math.max(b.l+18,Math.min(b.r-18,s.player.x+off));runner(x,y,.55,['#ff493b','#ffc83d','#43b8f4','#2fd16f','#9b6cff'][i%5],cat().icons[s.followers[i].icon])}}
function object(o){if(o.type==='member'||o.type==='spam'){runner(o.x,o.y,.76,'#43b8f4',cat().icons[o.icon]);if(o.type==='spam'){px(o.x+22,o.y-38,18,28,'#ff493b');px(o.x+28,o.y-31,6,14,'#fff');px(o.x+28,o.y-11,6,6,'#fff')}}else if(o.type==='post'){px(o.x-20,o.y-24,40,48,'#fff');px(o.x-20,o.y-24,40,7,'#2f61ff')}else if(o.type==='flame'){px(o.x-12,o.y-18,24,30,'#ff493b');px(o.x-7,o.y-28,14,22,'#ffc83d')}else if(o.type==='boost'){ctx.font='44px sans-serif';ctx.textAlign='center';ctx.fillText('🚀',o.x,o.y)}else if(o.type==='trial'){px(o.x-42,o.y-26,84,52,'#fff');ctx.fillStyle='#071426';ctx.font='900 12px monospace';ctx.textAlign='center';ctx.fillText('7-DAY FREE',o.x,o.y);ctx.fillText('TRIAL',o.x,o.y+16)}else if(o.type==='dollar'){ctx.beginPath();ctx.arc(o.x,o.y,30,0,Math.PI*2);ctx.fillStyle='#2fd16f';ctx.fill();ctx.strokeStyle='#071426';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 34px monospace';ctx.textAlign='center';ctx.fillText('$',o.x,o.y+11)}else{px(o.x-42,o.y-20,84,40,'#ff493b');ctx.fillStyle='#fff';ctx.font='900 16px monospace';ctx.textAlign='center';ctx.fillText('CHURN',o.x,o.y+6)}}
function decisionDraw(){if(!s.decision)return;for(const c of[s.decision.left,s.decision.right]){const x=laneX(c.lane,s.decision.y),y=s.decision.y;ctx.beginPath();ctx.arc(x,y,44,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#071426';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle=(c.n>0||c.a==='double'||c.label==='MONETIZE')?'#2fd16f':'#ff493b';ctx.textAlign='center';ctx.font=c.label.length>10?'900 8px monospace':'900 18px monospace';if(c.label==='ADJUST ABOUT PAGE'){ctx.fillText('ADJUST',x,y-4);ctx.fillText('ABOUT PAGE',x,y+10)}else if(c.label==='MAKE NO ADJUSTMENTS'){ctx.fillText('MAKE NO',x,y-5);ctx.fillText('ADJUSTMENTS',x,y+10)}else ctx.fillText(c.label,x,y+6)}}
function draw(){roadDraw();s.objects.forEach(object);decisionDraw();followers();runner(s.player.x,s.player.y,1,'#071426','⭐');if(s.shield){ctx.strokeStyle='#ffc83d';ctx.lineWidth=5;ctx.beginPath();ctx.arc(s.player.x,s.player.y,45,0,Math.PI*2);ctx.stroke()}}
function loop(){update();draw();requestAnimationFrame(loop)}
function info(){const c=cats[ui.category.value],d=diffs[ui.difficulty.value],target=Math.round(d.base*c.m/100)*100;ui.categoryInfo.innerHTML=`<strong>${c.name}</strong><br>${c.desc}<br>Win target: $${target} MRR`}
populate();ui.category.value='hobbies';ui.settingsCategory.value='hobbies';info();reset();
ui.category.onchange=info;ui.difficulty.onchange=info;
$('startBtn').onclick=start;$('pauseBtn').onclick=()=>pause();$('resumeBtn').onclick=()=>pause(true);$('leftBtn').onpointerdown=()=>move(-1);$('rightBtn').onpointerdown=()=>move(1);
$('settingsBtn').onclick=()=>{if(s.running&&!s.paused)pause();ui.settingsCategory.value=s.category;ui.settingsDifficulty.value=s.difficulty;ui.settingsOverlay.classList.remove('hidden')};
$('closeSettings').onclick=()=>ui.settingsOverlay.classList.add('hidden');
$('applySettings').onclick=()=>{ui.category.value=ui.settingsCategory.value;ui.difficulty.value=ui.settingsDifficulty.value;info();ui.settingsOverlay.classList.add('hidden');start()};
$('fullscreenBtn').onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await shell.requestFullscreen?.()}catch(e){}};
document.addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key))move(-1);if(['ArrowRight','d','D'].includes(e.key))move(1);if(['p','P','Escape'].includes(e.key))pause()});
let sx=0,sy=0,st=0,sw=false;
shell.addEventListener('touchstart',e=>{if(!s.running||s.paused)return;const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=performance.now();sw=true},{passive:true});
shell.addEventListener('touchend',e=>{if(!sw||!s.running||s.paused)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy,dt=performance.now()-st;sw=false;if(dt<700&&Math.abs(dx)>=32&&Math.abs(dx)>Math.abs(dy)*1.15){move(dx>0?1:-1);ui.swipeHint.style.opacity='0';setTimeout(()=>ui.swipeHint.style.display='none',250);navigator.vibrate?.(12)}},{passive:true});
loop();
})();
