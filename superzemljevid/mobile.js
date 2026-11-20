'use strict';
(()=>{
 const media=matchMedia('(max-width:760px), (max-height:600px) and (pointer:coarse)');
 const button=document.getElementById('mobilePanelToggle'),label=document.getElementById('mobilePanelLabel'),content=document.getElementById('sidebarContent');
 const landscape=matchMedia('(orientation:landscape)');
 const isLandscape=()=>media.matches&&(screen.orientation?.type?screen.orientation.type.startsWith('landscape'):landscape.matches);
 let expanded=false,currentView='ownership',startY=null,startX=null,dragged=false;
 const labels={ownership:'Podatki o zemljiščih',zvetl:'Stanje ZVEtL',initiatives:'Seznam naših pobud',business:'Poslovni subjekti',plain:'Brez barv'};
 function update(){document.body.dataset.mobileOrientation=isLandscape()?'landscape':'portrait';document.body.dataset.mobilePanel=expanded?'expanded':'collapsed';button.setAttribute('aria-expanded',String(expanded));label.textContent=expanded?(isLandscape()?'Več zemljevida →':'Več zemljevida ↓'):(labels[currentView]||'Podatki')+(isLandscape()?' ←':' ↑');content.inert=media.matches&&!expanded;requestAnimationFrame(()=>{window.savsko?.viewer?.resize();window.savsko?.viewer?.scene.requestRender();});}
 function set(open){expanded=open;update();}
 window.mobilePanel={collapse:()=>set(false),expand:()=>set(true)};
 button.onclick=()=>{if(dragged){dragged=false;return;}set(!expanded);};
 button.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;startY=e.clientY;startX=e.clientX;dragged=false;button.setPointerCapture(e.pointerId);});
 button.addEventListener('pointerup',e=>{if(startY===null)return;const delta=isLandscape()?e.clientX-startX:e.clientY-startY;startY=null;startX=null;if(Math.abs(delta)>28){dragged=true;set(delta<0);}});
 button.addEventListener('pointercancel',()=>{startY=null;dragged=false;});
 button.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();set(isLandscape()?e.key==='ArrowLeft':e.key==='ArrowUp');}});
 window.addEventListener('savsko-view-change',e=>{currentView=e.detail;set(!['ownership','zvetl','plain'].includes(currentView));content.scrollTop=0;});
 window.addEventListener('savsko-property-selected',()=>{if(!media.matches)return;set(true);requestAnimationFrame(()=>{const detail=document.getElementById('detail');content.scrollTop=detail.getBoundingClientRect().top-content.getBoundingClientRect().top+content.scrollTop-8;});});
 window.addEventListener('savsko-map-ready',update);media.addEventListener('change',update);landscape.addEventListener('change',update);screen.orientation?.addEventListener('change',()=>requestAnimationFrame(update));window.addEventListener('orientationchange',()=>requestAnimationFrame(update));
 // Keep dialogs above the on-screen keyboard when the browser exposes its visible viewport.
 function visibleViewport(){const v=window.visualViewport;document.documentElement.style.setProperty('--visible-height',(v?.height||innerHeight)+'px');document.documentElement.style.setProperty('--visible-top',(v?.offsetTop||0)+'px');}
 window.visualViewport?.addEventListener('resize',visibleViewport);window.visualViewport?.addEventListener('scroll',visibleViewport);window.addEventListener('resize',()=>{visibleViewport();update();});
 visibleViewport();update();
})();
