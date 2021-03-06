exports.undergroundPathFinder = (entityMap, xNotY /* direction */, line /* x or y */, start, end, maxLen) => {
	if(start === end){
		throw new Error("start equal to end!");
	}
	// hello world wut

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
		let isAsc = start < end;
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
	possiblePlacements.push(end);
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

// to debug node in chrome:
// node --inspect-brk undergroundPathFinder.js
// go to: chrome://inspect/#devices
// "open dedicated devtools for node"

/*
runTest = (bStr, maxLen) => {
	let o = {};
	for(let i = 0; i < bStr.length; i++){
		o[i] = bStr[i] === '0';
    }
	let res = exports.undergroundPathFinder({0: o}, false, 0, 0, bStr.indexOf('e'), maxLen);
	let rStr;
	if(typeof res === 'string'){
		rStr = res;
    } else {
        let replaceAt = (str, index, replacement) => str.substr(0, index) + replacement+ str.substr(index + replacement.length);
        rStr = JSON.parse(JSON.stringify(bStr));
        res.forEach( idx => rStr = replaceAt(rStr, idx, 'X'));
    }
	console.log( bStr + "\n" + rStr);
};
while(true){
	try{
		debugger;
	//  0123456789ABCDEF
		runTest('100110e110000000', 3);
		runTest('100110011001100e', 3);
		runTest('100101010101010e', 3);
		runTest('1e01100110001000', 3);
		runTest('10e1100110001000', 3);
		runTest('100e100110001000', 3);
		runTest('111111111111111e', 3);
		runTest('111100011111111e', 3);
		console.log(JSON.stringify(exports.undergroundPathFinder({0: {0: false, [-1]: true, [-2]: true, [-3]: false, [-4]: false, [-5]: true, [-6]:false, [-7]:false, [-8]:true, [-9]:false}}, false, 0, 0, -9, 3))); // y desc: [0,-3,-6,-9]
		console.log(JSON.stringify(exports.undergroundPathFinder({0: {0: false}, 1: {0: true}, 2: {0: true}, 3: {0: false}, 4: {0: false}, 5: {0: true}, 6:{0: false}, 7:{0: false}, 8:{0: true}, 9:{0: false}}, true, 0, 0, 9, 3))); // x asc: [0,3,6,9]
		console.log(JSON.stringify(exports.undergroundPathFinder({0: {0: false}, [-1]: {0: true}, [-2]: {0: true}, [-3]: {0: false}, [-4]: {0: false}, [-5]: {0: true}, [-6]:{0: false}, [-7]:{0: false}, [-8]:{0: true}, [-9]:{0: false}}, true, 0, 0, -9, 3))); // x desc: [0,-3,-6,-9]
		console.log();
	}catch(e){
		debugger;
	}
}
*/


/*
100110e110000000
X00X10X110000000
100110011001100e
X00X100X100X100X
100101010101010e
!! NO PATH !!
1e01100110001000
XX01100110001000
10e1100110001000
X0X1100110001000
100e100110001000
X00X100110001000
111111111111111e
X11X111X111X111X
111100011111111e
!! NO PATH !!
*/






