export const chooseTestSet = (allWords, numWords) => {
    let today = new Date();
    let dueWords = allWords.filter(word => new Date(word.due_date) <= today);
    if (numWords > dueWords.length) {
        numWords = dueWords.length;
    }
    //let dueWords = allWords;
    let selectedWords = []
    for (let i = 0; i < numWords; i ++) {
        let index = Math.floor(Math.random() * dueWords.length);
        let selectedWord = dueWords[index];
        selectedWords.push(selectedWord);
        dueWords.splice(index, 1);
    }
    return selectedWords;
}

export const setPermList = function (testSet, includeHandwriting) {
    let nums = Array.from(Array(testSet.length).keys());

    let qaCombinations;

    if (includeHandwriting) {
        qaCombinations = ['CP', 'CM', 'PC', 'PM', 'MP', 'MC'];
    } else {
        qaCombinations = ['PC', 'PM', 'MP', 'MC'];
    }

    let permList = [];

    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < qaCombinations.length; j++) {
            if (testSet[i]['simp'].length === 1 && qaCombinations[j][1] === "P") {
                continue;
            }

            permList.push({"index": nums[i].toString(),
                           "aCategory": qaCombinations[j][0],
                           "qCategory": qaCombinations[j][1]})
        }
    }


    return permList
}


const ranChoice = function (a) {
    let ranDec = Math.random() * a.length;
    let indx = Math.floor(ranDec);
    return a[indx]
}


export const assignQA = function (testSet, permList, charSet) {
    let perm = ranChoice(permList);
    let ranWord = testSet[perm.index];

    let Ax, ACs, Qx, QCs

    if (perm.aCategory === 'C') {
        Ax = ranWord[charSet];
        ACs = 'character';
    } else if (perm.aCategory === 'P') {
        Ax = ranWord['pinyin'];
        ACs = 'pinyin';
    } else if (perm.aCategory === 'M') {
        Ax = ranWord['meaning'].split('/');
        ACs = 'meaning';
    }

    if (perm.qCategory === 'C') {
        Qx = ranWord[charSet];
        QCs = 'character';
    } else if (perm.qCategory === 'P') {
        Qx = ranWord['pinyin'];
        QCs = 'pinyin';
    } else if (perm.qCategory === 'M') {
        Qx = ranWord['meaning'].split('/');
        QCs = 'meaning';
    }

    return {
        perm: perm,
        chosenCharacter: ranWord[charSet],
        answer: Ax,
        answerCategory: ACs,
        question: Qx,
        questionCategory: QCs
    }
}

export const toneChecker = function (inp, answer) {
    if (inp.replace(/[0-9]/g, '') === answer.replace(/[0-9]/g, '')) {
        return 'Incorrect tones'
    } else {
        return 'Try again';
    }
}

export const Counter = (array) => {
    var count = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
}