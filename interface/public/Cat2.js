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
	question : " Quel mode d'adressage nécéssite 2 lectures de la mémoire centrale ?",
	choice1: "immédiat ",
	choice2: "direct",
	choice3: "indirect",
	choice4: "indexé",
	answer: 2,

   }, 
   {
	question : " dans le mode d'adressage indexé , le préfix à ajouter qu étiquète se trouve dans le registre ?",
	choice1: "RI", 
	choice2: "ACC",
	choice3: "SI/DI",
	choice4: "CX",
	answer: 3,
   }, 
   {
	question : " quel est le mode d'adressage dans l'instruction ' MOV AX, tab[2] '  ?",
	choice1: "indirect", 
	choice2: "immédiat",
	choice3: "indexé",
	choice4: " direct",
	answer: 3,
   },
   {
	question : " si on veut charger du  mot mémoire A le contenu d'un registre AX , quelle l'instruction correcte   ?",
	choice1: "MOV A,AX", 
	choice2: "CHG A,AX",
	choice3: "MOVI AX,A",
	choice4: " MOVI A,AX ",
	answer: 1,
   },
   {
	question : " combien de mots mémoire il faut pour lire une instruction du mode d'adressage indirect ?",
	choice1: " 1 seul mot mémoire ", 
	choice2: " 2 mots mémoire",
	choice3: "4 mots mémoire",
	choice4: " 3 mots mémoire ",
	answer: 4,
   }, 
   {
	question : "  au quel mode d'adressage appartient l'instructuion suivante 'SUB AX,BX' ?",
	choice1: " mode direct ", 
	choice2: "mdoe indirect ",
	choice3: " mode basé indexé",
	choice4: " mode immédiat",
	answer: 4,
   },
   {
	question : "  Dans l'architecture PASSE les registres liés au mode d'adressage basé/indexé sont ?",
	choice1: "EX/FX", 
	choice2: "SI/DI ",
	choice3: " ACC/AX",
	choice4: " BX/CX",
	answer: 2,
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