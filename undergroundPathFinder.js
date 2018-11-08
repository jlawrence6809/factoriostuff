exports.undergroundPathFinder = (entityMap, x, startY, endY, maxLen) => {
	if(startY === endY){
		console.log("invalid");
	}

	// check that beginning and end are clear
	if(entityMap[x][startY] || entityMap[x][endY]){
			console.log("no path");
	}

	if(Math.abs(startY - endY) <= maxLen){
		// just return the start and end
	}

	let newEntities = [];
	let possiblePlacements = [startY - 1]; // has to start one before startY because we add one in the check later on
	for(let y = startY + 1; y < endY; y++){
		if(!entityMap[x][y] && !entityMap[x][y + 1]){
			possiblePlacements.push(y);
		}
	}
	let lastPlacement = startY;
	let foundPath = [startY];
	for(let i = 1; i < possiblePlacements.length; i++){
		let distance = Math.abs(lastPlacement - possiblePlacements[i]);
		if(distance === maxLen){
			foundPath.push(possiblePlacements[i]);
			lastPlacement = possiblePlacements[i] + 1;
		} else if(distance > maxLen){
			let lastPlacementChecked = possiblePlacements[i - 1];
			if(lastPlacement === lastPlacementChecked + 1){
        		return "!! NO PATH !!";
            }
			lastPlacement = lastPlacementChecked + 1;
			foundPath.push(lastPlacementChecked);
			i--; // need to check this index again
        }
	}
	if(Math.abs(lastPlacement - endY) > maxLen){
        return "!! NO PATH !!";
    }
	foundPath.push(endY);

	return foundPath;
}

/* TESTS */

/*
runTest = (bStr, maxLen) => {
	let o = {};
	for(let i = 0; i < bStr.length; i++){
		o[i] = bStr[i] === '0';
    }
	let res = undergroundPathFinder({0: o}, 0, 0, bStr.indexOf('e'), maxLen);
	let rStr;
	if(typeof res === 'string'){
		rStr = res;
    } else {
        let replaceAt= (str, index, replacement) => str.substr(0, index) + replacement+ str.substr(index + replacement.length);
        rStr = JSON.parse(JSON.stringify(bStr));
        res.forEach( idx => rStr = replaceAt(rStr, idx, 'X'));
    }
	console.log( bStr + "\n" + rStr);
};
//       0123456789ABCDEF
runTest('100110e110000000', 3);
runTest('100110011001100e', 3);
runTest('100101010101010e', 3);
runTest('1e01100110001000', 3);
runTest('10e1100110001000', 3);
runTest('100e100110001000', 3);
runTest('111111111111111e', 3);
runTest('111100011111111e', 3);
console.log();
*/