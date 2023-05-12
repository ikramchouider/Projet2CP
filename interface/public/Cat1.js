const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressbarfull = document.getElementById("progress-bar-fall");
console.log(choices);
const progrestext = document.getElementById('progresstext');
const scoreText = document.getElementById('score');
let currentquestion={};
let acceptinganswers = false; 
let score =0 ; 
 let questioncounter =0 ;
let availablequestions=[];

let questions = [
   { 
	question : " Quelle est la composante chargée de storage des instructions du programme lue à partir de la mémoire centrale ?",
	choice1: "RAM",
	choice2: "RIM",
	choice3: "UAL",
	choice4: "RI",
	answer: 4,

   }, 
   {
	question : " Le registre utilisé pour la manipulation des tableaux est ?",
	choice1: "ACC", 
	choice2: "AX",
	choice3: "SI",
	choice4: "FX",
	answer: 3,
   }, 
   {
	question : "la composante ou le role est le storage de l'adresse de la mémoire centrale en cours est ?",
	choice1: "registre adresse mémoire RAM", 
	choice2: "unité arithmétique et logique UAL",
	choice3: "unité de commande UC",
	choice4: " Compteur ordinal CO",
	answer: 4,
   },
   {
	question : " la composante chargée de l'exécution de toute instruction définiée dans le jeux d'instructions de la macgine est   ?",
	choice1: "CPU", 
	choice2: "unité arithmétique et logique UAL",
	choice3: "la mémoire centrale",
	choice4: " le séquenceur ",
	answer: 2,
   },
   {
	question : " quel est le role de registre flags / drapaux  ?",
	choice1: "registre de storage des données général", 
	choice2: " storage des instructions",
	choice3: "storage d'adresse mémoire de l'instruction en cours d'exécution ",
	choice4: " storage d'état de la donnée existante dans l'aacumulateur  ",
	answer: 4,
   }, 
   {
	question : " si le bus d'adresse est sur 11 bits , combien de case mémoire sont adressables à travers ce bus  ?",
	choice1: " 1125 mots ", 
	choice2: "11 mots ",
	choice3: " 2048 mots",
	choice4: " 65536 mots ",
	answer: 3,
   }




];
// ctee 

const correctbonus = 1; 
const maxquestions = 6;

startgame = ()  => { 
questioncounter =0; 
score =0; 
availablequestions = [... questions];
getnewquestion();
};
getnewquestion = ()=> {
	if (availablequestions.length==0 || questioncounter >= maxquestions){
		localStorage.setItem('mostrecentscore',score);
		localStorage.setItem('nbq',maxquestions);
		return window.location.assign("sort.html")

	}
	questioncounter++; 
	progrestext.innerText = "Question : "+ questioncounter+"/"+maxquestions;
	// update progress bar 
	progressbarfull.style.width = (((questioncounter-1)/maxquestions)*100)+"%";
	const questionindex = Math.floor(Math.random() * availablequestions.length);
	currentquestion = availablequestions[questionindex];
	question.innerText = currentquestion.question;
	// pour les choix 
	choices.forEach(choice => {
		const  number = choice.dataset['number'];
		choice.innerText = currentquestion['choice' + number];
	})

	availablequestions.splice(questionindex,1);
	acceptinganswers = true; 
};
choices.forEach(choice => { 
	choice.addEventListener('click', e => { 
   if (!acceptinganswers) return;
   acceptinganswers = false ; 
   const selectedchoice = e.target;
   const selectedanswer = selectedchoice.dataset['number'];

   const classtoapply = 
   selectedanswer == currentquestion.answer ? "correct" : "incorrect";
   console.log(classtoapply);
   if(classtoapply=== 'correct'){
	incrementscore(correctbonus);
   }
   selectedchoice.parentElement.classList.add(classtoapply);

   setTimeout( ()=> {
	selectedchoice.parentElement.classList.remove(classtoapply);
	getnewquestion();
   },400);
  
	}); 
});
incrementscore = num => { 
	score ++; 
	scoreText.innerText = score+"/"+maxquestions; 
}

startgame();