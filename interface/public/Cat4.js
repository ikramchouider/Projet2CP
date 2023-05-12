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
	question : "  Apple lance le Macintosh, le premier micro-ordinateur à succès utilisant une souris et une interface graphique",
	choice1: "1990 ",
	choice2: "1984",
	choice3: "1988",
	choice4: "1992",
	answer: 2,

   }, 
   {
	question : " Le Britannique Thomas Flowers construit le premier ordinateur électronique programmable, contenant 2 400 tubes à vide pour les opérations logiques. Cet ordinateur de déchiffrement, portant le nom Colossus Mark I, peut traduire 5 000 caractères par seconde et utilise une bande perforée pour l’entrée de données.",
	choice1: "1832", 
	choice2: "1910",
	choice3: "1920",
	choice4: "1943",
	answer: 4,
   }, 
   {
	question : " Univac est utilisé pour prévoir les résultats de l’élection présidentielle de 1952. Personne ne croit sa prévision, fondée sur 1 % des voix, qu’Eisenhower remportera l’élection haut la main. Pourtant, c’est bien ce qui est arrivé.",
	choice1: "1970", 
	choice2: "1920",
	choice3: "1952",
	choice4: " 1930",
	answer: 3,
   },
   {
	question : "  les ordinateurs de la 3ième génération .Ils comprennent les premiers circuits intégrés, qui permettent de construire des machines encore plus petites. IBM lance le langage de programmation PL/1.",
	choice1: "1964", 
	choice2: "1970",
	choice3: "1941",
	choice4: " 1968 ",
	answer: 1,
   },
   {
	question : " Création d’Intel Corporation.",
	choice1: " 1968 ", 
	choice2: " 1966",
	choice3: "1950",
	choice4: " 1970 ",
	answer: 1,
   }, 
   {
	question : "  l'IBM 5100, machine totalement intégrée avec son clavier et son écran, qui se contente d'une prise de courant pour fonctionner.",
	choice1: " 1975 ", 
	choice2: "1933 ",
	choice3: " 1988",
	choice4: " 1979",
	answer: 1,
   },
   {
	question : "   Intel lance l'Intel 80286, utilisé par IBM en 1984 dans le PC/AT. À cette époque le PC devient l'architecture dominante sur le marché des ordinateurs personnels.",
	choice1: "1990", 
	choice2: "1992 ",
	choice3: " 1988",
	choice4: " 1982",
	answer: 4,
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