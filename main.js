let categorySelect = document.getElementById('category-select');
let numQues = document.getElementById('number-select');
let diffSelect = document.getElementById('difficulty-select');
let typeSelect = document.getElementById('type-select');

let difficulties = ['easy','medium','hard'];
let typesAns = ['multiple','boolean'];
const catURL = 'https://opentdb.com/api_category.php';  

let score = 0;

fetch(catURL)
	.then(response => response.json())
	.then(categories => {
		console.log(categories);
		const categoriesArray = [...categories.trivia_categories];
		console.log(categoriesArray);
		categoriesArray.forEach(category => {
			const option = `<option id="category-${category.id}" value="${category.id}">${category.name}</option>`;
			categorySelect.innerHTML += option;
		})
	})

// WRITING DOWN NUMBER OF QUESTIONS
for(let i = 0; i < 50; i++) {
	const optionNumber = `<option id="${i+1}" value="${i+1}">${i+1}</option>`;
	numQues.innerHTML += optionNumber;
}

// DIFFICULTY
difficulties.forEach( difficulty => {
	const diff = `<option id="${difficulty}" class='text-cap' value="${difficulty}">${difficulty}</option>`;
	diffSelect.innerHTML += diff;
})

//TYPE
typesAns.forEach( type => {
	const typeHTML = `<option id="${type}" class='text-cap' value="${type}">${type}</option>`;
	typeSelect.innerHTML += typeHTML;
})

writeOutQuestions = () => {
	const arrFilterValues = getValuesFromFilter();
	if(arrFilterValues.includes("Any Number") || arrFilterValues.includes("Any Category")||arrFilterValues.includes("Any Difficulty")||arrFilterValues.includes("Any Type")){
		alert('Select All the Filters');
		let blank_spaceAlert = document.getElementById('outter-container');
		blank_spaceAlert.innerHTML = `<a class = "search-again-btn" href="home.html">Try Again</a>`
	}
	console.log(arrFilterValues);
	let blank_space = document.getElementById('container');
	blank_space.innerHTML = '';
	const questionsURL = `https://opentdb.com/api.php?amount=${arrFilterValues[0]}&category=${arrFilterValues[1]}&difficulty=${arrFilterValues[2]}&type=${arrFilterValues[3]}`
	let onlyQuestionsArr = []
	fetch(questionsURL)
		.then(responseQ => responseQ.json())
		.then(questions => {
			console.log(questions)
			if(questions.response_code === 1) {
				let blank_space11 = document.getElementById('outter-container');
				blank_space11.innerHTML = '';
				const warnResponse = `<h2>The API doesn't have enough questions for your query</h2><div class="padding-30"><a href="home.html" class="search-again-btn">Search Again</a></div>`;
				blank_space11.innerHTML = warnResponse;
			}
			let correctsAnswers = [];
			onlyQuestionsArr = [...questions.results];
			onlyQuestionsArr.forEach((question,ind) => {
				correctsAnswers.push(question.correct_answer);
				const randomNumber = Math.floor(Math.random()*4)
				let answers = [...question.incorrect_answers];
				answers.splice(randomNumber, 0, question.correct_answer);
				writeDownEachQues(question,ind);
				writeAnswers(answers,ind);

			})		
			console.log(correctsAnswers);
			createSubmitButton(correctsAnswers);
			
		})

}

getValuesFromFilter = () => {
	let categorySelectValue = document.getElementById('category-select').value;
	let numQuesValue = document.getElementById('number-select').value;
	let diffSelectValue = document.getElementById('difficulty-select').value;
	let typeSelectValue = document.getElementById('type-select').value;
	console.log(categorySelectValue);
	console.log(numQuesValue);
	console.log(diffSelectValue);
	console.log(typeSelectValue);
	return [numQuesValue, categorySelectValue, diffSelectValue,typeSelectValue];
} 

writeDownEachQues = (eachQuestion,index) => {
	let blank_space1 = document.getElementById('questionsContainerApi-2');
	const questionHTML = `<h2 class="mt-50 mb-20">${index+1}.) ${eachQuestion.question}</h2>`;
	blank_space1.innerHTML += questionHTML;
}
writeAnswers = (arr,indeA) => {
	arr.forEach( (ans,ind) => {
		let blank_space10 = document.getElementById('questionsContainerApi-2');
		const ansHTML =`<input class="choice" type="radio" id="${indeA}${ind}" name="${indeA}" value="${ans}" required /><label for="${indeA}${ind}">${ans}</label><br>`;
		blank_space10.innerHTML += ansHTML;
	})
}
createSubmitButton = (arr) => {
	let blank_spaceButton = document.getElementById('questionsContainerApi-2');
	blank_spaceButton.innerHTML += `<input onclick="getValuesSelected('${arr}')" id='submit-format-button' class ="submit-btn-form" type='submit' value="Submit">`
}
getValuesSelected = (arr) => {
	let button = document.getElementById('submit-format-button');
	let arrAnsSelected = [];
	const options = Array.from(document.getElementsByClassName('choice'));
	options.forEach(option => {
		if(option.checked) {
			console.log(option.value);
			arrAnsSelected.push(option.value);
		}
	})
	console.log('respuestas correctas')
	console.log(arr);
	const correctsAf = arr.split(',');
	console.log('dos arrays para comprarar')
	console.log(correctsAf);
	console.log(arrAnsSelected);
	// console.log(options);
	let addPoints = 10; 
	for(let  i = 0; i < correctsAf.length; i++ ) {
		if(correctsAf[i] == arrAnsSelected[i]){
			score+=addPoints;
		}
	}
	console.log('tu score:')
	console.log(score);
	const outterCont = document.getElementById("outter-container");
	if(arrAnsSelected.length < correctsAf.length){
		//nothing
		alert('Select all the answers before submit!!')
	}else {
		if(score == correctsAf.length*10){
			outterCont.innerHTML = "";
			outterCont.innerHTML += `<h1>Congratulations!!</h1>`
			outterCont.innerHTML += `<h1>You've Reach The Maximum Points</h1>`
			outterCont.innerHTML += `<h1>Your Score is: ${score} out of ${score}</h1>`
			outterCont.innerHTML += `<a class = "search-again-btn" href="home.html">Try Again</a>`
		}else {
			outterCont.innerHTML = "";
			outterCont.innerHTML += `<h1>Your Score is: ${score} out of ${correctsAf.length*10}</h1>`
			outterCont.innerHTML += `<a class = "search-again-btn" href="home.html">Try Again</a>`
		}
	}

}





























