exports.undergroundPathFinder = (entityMap, xNotY /* direction */, line /* x or y */, start, end, maxLen) => {
	if(start === end){
		throw new Error("start equal to end!");
	}

	let startX;
	let endX;
	let startY;
	let endY;
	if(xNotY){
		startX = start;
		endX = end;
		startY = line;
		endY = line;
	} else {
		startX = line;
		endX = line;
		startY = start;
		endY = end;
	}

	// check that beginning and end are clear
	if(entityMap[startX][startY] || entityMap[endX][endY]){
		throw new Error("No path! Start or end blocked!");
	}

	let getAtIdx = (idx) => {
		if(xNotY){
			return entityMap[getPlacementForIdx(idx)][line];
		}else{
			return entityMap[line][getPlacementForIdx(idx)];
		}
	};

	getPlacementForIdx = (idx) => {
		let isAsc = start < stop;
		return start + (isAsc) ? idx : -1 * idx;
	};

	let totalDistance = Math.abs(start - end);

	let newEntities = [];
	let possiblePlacements = [getPlacementForIdx(-1)]; // has to start one before startY because we add one in the check later on
	for(let i = 1; i < totalDistance - 1; i++){
		if(!getAtIdx(i) && !getAtIdx(i + 1)){
			possiblePlacements.push(getPlacementForIdx(i));
		}
	}
	let lastPlacement = start;
	let foundPath = [start];
	for(let i = 1; i < possiblePlacements.length; i++){
		let distance = Math.abs(lastPlacement - possiblePlacements[i]) - 1;
		if(distance === maxLen){
			foundPath.push(possiblePlacements[i]);
			lastPlacement = possiblePlacements[i];
		} else if(distance > maxLen){
			let lastPlacementChecked = possiblePlacements[i - 1];
			if(lastPlacement === lastPlacementChecked){
        		return "!! NO PATH !!";
            }
			lastPlacement = lastPlacementChecked;
			foundPath.push(lastPlacementChecked);
			i--; // need to check this index again
        }
	}
	if(Math.abs(lastPlacement - end) - 1 > maxLen){
        return "!! NO PATH !!";
    }
	foundPath.push(end);

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