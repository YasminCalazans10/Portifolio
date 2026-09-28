const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
const navLinks={pt:['Sobre','Experiência','Projetos','QA','AI Security','Tecnologias','Contato'],en:['About','Experience','Projects','QA','AI Security','Technologies','Contact']};
const ptMain=document.querySelector('main');
const englishTemplate=document.querySelector('#english-portfolio');
const footer=document.querySelector('footer');
let currentLang='pt', enMain=null;
function setupReveal(root=document){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});root.querySelectorAll('.reveal').forEach(el=>io.observe(el));}
setupReveal(ptMain);
function setLanguage(lang){
 currentLang=lang;
 if(lang==='en'){
   if(!enMain){enMain=englishTemplate.content.firstElementChild.cloneNode(true);footer.parentNode.insertBefore(enMain,footer);}
   ptMain.hidden=true;enMain.hidden=false;document.documentElement.lang='en';document.title='Yasmin Calazans | QA & Software';
 }else{
   ptMain.hidden=false;if(enMain)enMain.hidden=true;document.documentElement.lang='pt-BR';document.title='Yasmin Calazans | QA & Software';
 }
 document.querySelectorAll('.lang-btn').forEach(b=>{const active=b.dataset.lang===lang;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 document.querySelectorAll('nav a').forEach((a,i)=>{a.textContent=navLinks[lang][i];a.href='#'+(['sobre','experiencia','projetos','qa','ai-security','stack','contato'][i])+(lang==='en'?'-en':'');});
 document.querySelector('.menu').setAttribute('aria-label',lang==='en'?'Open menu':'Abrir menu');
 footer.querySelector('a').href=lang==='en'?'#inicio-en':'#inicio';
 footer.querySelectorAll('p')[0].textContent=lang==='en'?'Quality Assurance · Software Testing · Development':'Quality Assurance · Software Testing · Desenvolvimento';
 nav.classList.remove('open');
}
document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
