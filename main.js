document.querySelector(".control-buttons span").onclick = function (e) {
	startGame();
};
document.onkeyup = function (e) {
	if (e.key === "Enter") {
		startGame();
	}
};
var nameInput = document.querySelector(".urName");
function startGame() {
	// mute music checkbox
	var muteCheckbox = document.getElementById("mute-music");
	if (muteCheckbox.checked) {
		// mute music checkbox
		document.getElementById("back-music").pause();
	} else if (
		!muteCheckbox.checked &&
		nameInput.value != "" &&
		nameInput.value.length > 2
	) {
		// Sounds
		document.getElementById("back-music").volume = 0.08;
		document.getElementById("back-music").play();
	}
	if (nameInput.value != "" && nameInput.value.length > 2) {
		// to let the play take a peek on the cards
		blocks.forEach((bl) => {
			setTimeout(() => {
				bl.classList.remove("flipped");
			}, 1900);
			bl.classList.add("flipped");
		});
		// the counter have to be outside of the function
		let countingSeconds = 0;
		handler = setInterval(() => {
			countingSeconds += 1;
			countSpan.innerHTML = countingSeconds;
		}, 1000);
		// assign input value to user name
		document.querySelector(".info-container .name span").textContent =
			nameInput.value;
		document.querySelector(".control-buttons").remove();
	} else {
		e.preventDefault();
	}
}
// Elapsed
var div = document.createElement("div");
var countSpan = document.createElement("span");
div.append(document.createTextNode("Elapsed: "));
div.append(countSpan);
countSpan.append(document.createTextNode("0"));
div.classList.add("elapsed");
document.querySelector(".info-container").append(div);
var handler;
// Elapsed End

let attemptsNum = "12";

let duration = 1000;

var gameContainer = document.querySelector(".memory-game-blocks");

var blocks = Array.from(gameContainer.children);

// set the attempts number
let leftAttempts = document.querySelector(".num");
leftAttempts.innerHTML = parseInt(attemptsNum);
// let orderRange = [...Array(blocks.length).keys()];

// Another way
let orderRange = Array.from(Array(blocks.length).keys());

shuffle(orderRange);

// Add order css property to all blocks
blocks.forEach((block, index) => {
	block.style.order = orderRange[index];
	// Adding click event
	block.addEventListener("click", function () {
		flipBlock(block);
	});
});

function flipBlock(selectedBlock) {
	selectedBlock.classList.add("flipped");
	let flippedBlocks = blocks.filter((flippedBlock) =>
		flippedBlock.classList.contains("flipped")
	);
	// If There are two selected blocks
	if (flippedBlocks.length === 2) {
		cantClick();
		checkMatchedBlocks(flippedBlocks[0], flippedBlocks[1]);
	}
	// If Player Won
	let matchedBlocks = blocks.filter((matchedBlock) =>
		matchedBlock.classList.contains("matched")
	);
	if (matchedBlocks.length === blocks.length) {
		setTimeout(() => {
			let div = document.createElement("div");
			let span = document.createElement("span");
			div.append(span);
			span.append(document.createTextNode("Congrats"));
			span.classList.add("winMessage");
			div.classList.add("win");
			document.body.append(div);

			// play again
			let playAgain = document.createElement("div");
			playAgain.setAttribute("id", "playAgain");
			playAgain.append(document.createTextNode("Play again"));
			document.body.append(playAgain);
			playAgain.onclick = function () {
				window.location.reload();
			};

			// how much time you took
			let tookTime = document.createElement("div");
			let tookTimeSpan = document.createElement("span");
			tookTime.append(tookTimeSpan);
			tookTimeSpan.before("You took ");
			tookTimeSpan.after(" seconds");
			tookTimeSpan.style.cssText =
				"color: #4caf50; font-size: 28px; font-weight: bold;";
			tookTimeSpan.innerHTML = countSpan.innerHTML;
			document.body.append(tookTime);
			tookTime.setAttribute("id", "tookTime");

			// Sound
			document.getElementById("back-music").pause();
			document.getElementById("victory").play();
			clearInterval(handler);
		}, 300);
	}
}
// Stop clicking function
function cantClick() {
	gameContainer.classList.add("no-clicking");
	setTimeout(() => {
		gameContainer.classList.remove("no-clicking");
	}, duration);
}

function checkMatchedBlocks(firstBlock, secondBlock) {
	let attempts = document.querySelector(".attempts span");
	if (firstBlock.dataset.character === secondBlock.dataset.character) {
		firstBlock.classList.remove("flipped");
		secondBlock.classList.remove("flipped");

		firstBlock.classList.add("matched");
		secondBlock.classList.add("matched");
		// Sound
		document.getElementById("correct").volume = 0.03;
		document.getElementById("correct").play();
	} else {
		setTimeout(() => {
			leftAttempts.innerHTML = parseInt(leftAttempts.innerHTML) - 1;
			attempts.innerHTML = parseInt(attempts.innerHTML) + 1;
			firstBlock.classList.remove("flipped");
			secondBlock.classList.remove("flipped");
			// if player lost
			if (attempts.outerText == attemptsNum) {
				let div = document.createElement("div");
				let span = document.createElement("span");
				div.append(span);
				span.append(document.createTextNode("You Failed"));
				span.classList.add("loseMessage");
				div.classList.add("lose");
				document.body.append(div);
				// Retry
				let retry = document.createElement("div");
				retry.setAttribute("id", "retry");
				retry.append(document.createTextNode("Retry"));
				document.body.append(retry);
				retry.onclick = function () {
					window.location.reload();
				};
				// Sound
				document.getElementById("back-music").pause();
				document.getElementById("lose").volume = 0.3;
				document.getElementById("lose").play();
			}
		}, duration);
		document.getElementById("incorrect").volume = 0.03;
		document.getElementById("incorrect").play();
	}
}

// Shuffle Function
function shuffle(array) {
	let current = array.length,
		temp,
		random;

	while (current > 0) {
		// Random Number
		random = Math.floor(Math.random() * current);
		// Decrease Length to make the loop stop
		current--;

		// [1] Save Current Element in Stash
		temp = array[current];

		// [2] Current Element = Random Element
		array[current] = array[random];

		// [3] Random Element = Get Element From Stash
		array[random] = temp;
	}
	return array;
}
