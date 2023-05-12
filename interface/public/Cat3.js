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
	question : " comment spécifier le début d'un programme en PASSE ?",
	choice1: "ORG 100H",
	choice2: "SET 100H",
	choice3: "MOV CO 100H",
	choice4: "MovI ACC 100H",
	answer: 1,

   }, 
   {
	question : " que fait l'instruction suivante 'SET D 3H' ?",
	choice1: "Met dans la variable D l'adresse de la valeur 3", 
	choice2: "Met la valeur 3 en héxadécimal dans la variable D",
	choice3: "Met l'adresse début d'un programme à 3H",
	choice4: "Met dans la variable D la valeur 3 en décimal",
	answer: 2,
   }, 
   {
	question : " la partie de programme qui sauvegarde toute les informations de programme ?",
	choice1: "Segment du code", 
	choice2: "Segment de données",
	choice3: "PSP",
	choice4: " Segment d'extention",
	answer: 3,
   },
   {
	question : " l'enchainement des instructions du programme est assuré par :  ?",
	choice1: "le RI registre instruction", 
	choice2: "le co compteur ordinal ",
	choice3: "l'accumulateur ",
	choice4: " le Séquenceur ",
	answer: 2,
   },
   {
	question : " le décodage de l'instruction se fait au niveau de  ?",
	choice1: " le séquenceur ", 
	choice2: " le compteur ordinal ",
	choice3: "le registre instruction RI",
	choice4: " l'UAL unitét arithmétique et logique ",
	answer: 3,
   }, 
   {
	question : " Une instruction de format long si elle est sur ?",
	choice1: " 1 mot mémoire ", 
	choice2: " 2/3 mots mémoire ",
	choice3: " 4 mots mémoire",
	choice4: " plus de 4 mots mémoire",
	answer: 2,
   },
   {
	question : " cet instruction 'ADD AX,EX' est codée sur combien de mots mémoire  ?",
	choice1: "2 mots mémoire ", 
	choice2: "3 mots mémoire ",
	choice3: " 1 mot mémoire",
	choice4: " 4 mots mémoire",
	answer: 3,
   },




];
// ctee 

const correctbonus = 1; 
const maxquestions = 7;

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