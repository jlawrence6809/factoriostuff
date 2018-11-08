/*
Factorio:
- Universal tilable mining?
- Create construcition tree
- Create blueprint for total construction factory
	- different classes of needs
	- full output needed for feeding into the output of the total factory
	- leftover production for some items, not needed, not guaranteed to produce full line of output (are all of these to be fed into chests?)
	- build backwards? calc total number of needed raw material inputs
	- opt out of building some things entirely?
	- if the number of raw inputs is just overwhelming what then?
	- pu
- Tilable refining?
*/

const zlib = require('zlib');
const Buffer = require('buffer').Buffer;
const assemblySection = require('./assemblySection').blueprint;
// console.log(assemblySection);
let bpstr = "eNqNkNEKgzAMRf/lPlfQPkzXXxlj6BakoGlp61Ck/77WwRgbwz2FhOTkJCu6YSLrNAeoFfpq2EOdVnjdczvkWlgsQUEHGiHA7Zgzmq0j74vgWvbWuFB0NAREAc03mqGqKP6GTGnE9c6k+ImR8SxAHHTQ9BTbkuXC09iRS3v2aQLW+AQwnE0StBRYoIqk+PJiO+W1X3i5d/EPeBmz+HauenuxwJ2c35oPTS1lUx3LWsb4ANgrhWM=";

let encodeBlueprint = (blueprint) => "0" + zlib.deflateSync(Buffer.from(JSON.stringify(blueprint),'utf8')).toString('base64');
let decodeBlueprint = (input) => JSON.parse(zlib.inflateSync(Buffer.from(input, 'base64')).toString('utf8'));
let entitiesToBlueprint = (entities) => {return { blueprint: { icons: [], entities: entities, item: "blueprint", version: 68722819072}}};
let rotate90 = (position) => {
	// rotates opposite of what you think
	const x = position.x;
	position.x = position.y;
	position.y = -1*x;
};
let getBounds = (entities) => {return {
	minX: Math.min(...(entities.map(e => e.position.x))),
	minY: Math.min(...(entities.map(e => e.position.y))),
	maxX: Math.max(...(entities.map(e => e.position.x))),
	maxY: Math.max(...(entities.map(e => e.position.y))),
}};
function printMap(entities){
	const bounds = getBounds(entities);
	const mapping = {};
	entities.forEach(e => {
		let p = e.position;
		if(!mapping[p.x]){
			mapping[p.x] = {};
		}
		mapping[p.x][p.y] = e;
	});

	let map = "";
	for(let x = bounds.minX; x <= bounds.maxX; x++){
		for(let y = bounds.minY; y <= bounds.maxY; y++){
			map += (mapping[x][y]) ? mapping[x][y].name[0] : ' ';
		}
		map += '\n';
	}
	return map;
}

assemblySection.push({
				"entity_number": 37,
				"name": "fast-splitter",
				"position": {
					"x": 0,
					"y": 7.5
				},
				direction: 2
			});

let blueprint = entitiesToBlueprint(decodeBlueprint(bpstr).blueprint.entities);
console.log(blueprint.blueprint.entities);

// blueprint.blueprint.entities.forEach( entity => rotate90(entity.position));
// console.log(getBounds(assemblySection));
// console.log(encodeBlueprint(entitiesToBlueprint(assemblySection)));
// console.log(JSON.stringify(decodeBlueprint(bpstr), null, '\t'));
// console.log(printMap(blueprint.blueprint.entities));

return;
/*
- write function to place a column of machines
	- need to keep track of main belt and items
		- one overall object to keep track of belt state
	- need to keep track of location of inputs and outputs to machines
	- need to be able to add new main belt line for new items
	- need to be able to split current belt and hook up to inputs
	- need to be able to add column to larger entities mapping
*/

let getColumn = (recipe, belts) => {
	// recipe = {name: 'blah', ingredients: ['a', 'b']}
	// belt = { itemA: {yLocations: [1,3,4,11], lastIdx: 2} , itemB: etc...}
	// go over ingredients
	// find ingredient on belts
	// split belt
	// hook split belt to machine
	// if more than 3 ingredients join them on single belt
	// if item type gas make sure to hook it up that way
	// return entities
	// note: columns must be configured so that they never overlap

	let entities = JSON.parse(JSON.stringify(assemblySection));
	let entityCounter = entities[entities.length - 1].entity_number;

	let addEntity = (name, x, y, direction, type) => {
		entities.push({
				"entity_number": ++entityCounter,
				"name": name,
				"position": {
					"x": x,
					"y": y
				},
				direction: direction,
				type: type,
			});
	}

	const beltsY = belts.map( belt => belt.yLocations[0]);

	if(recipe.ingredientList.length == 1) {
		let belt = belts[recipe.ingredientList[0]];
		let y = belt.yLocations[0];

		// add in the splitter
		addEntity("express-splitter", 0, y - 0.5, 2);
		// add the next few belts in the same line
		addEntity("express-transport-belt", 0, y, 2);
		addEntity("express-transport-belt", 1, y, 2);
		addEntity("express-transport-belt", 3, y, 2);
		// now add the bend output from the transport belt
		addEntity("express-transport-belt", 1, y - 1, 1);
		// add the first initial underground belt
		addEntity("express-underground-belt", 1, y - 2, 1, 'input');
		// now add the underground belts up to the input line for the assembly machines
		const y_forInputBelt = 4; // underground belt into assembly section
		const beltSpan = 10;

		let startingY = y - 2;
		while(startingY > y_forInputBelt){
			if(startingY - beltSpan + 3 < y_forInputBelt){

			} else {
				let newStartingY = startingY - beltSpan + 1;
				if(beltsY.indexOf(newStartingY) > -1){
					newStartingY = newStartingY - 2;
				}
				addEntity("express-underground-belt", 1, y - 2, 1, 'input');

				// left off here!!! Need function to figure out if there is an undergroud path from y0 to y1 given list of entities
				// undergroundPathFinder
			}


		}

		belts.forEach( otherBelt => {

			if(otherBelt.yLocations[0] < y){

			}
		});
	}

	recipe.ingredientList.forEach( ingredient => {
		let belt = belts[ingredient];
		if(!belt){
			throw new Exception();
		}
		let y = belt.yLocations[(++belt.lastIdx)%belt.yLocations.length];

	});


};

// current state of project:
// got the conditioned recipes to a state I like and the code in the recipesCondition.js readable
// started on the column generation, just on one input type right now
// currently working on undergroundPathFinder, which could be a mod in itself



let entityMapper = (entities) => {
	const getEntityFootPrint = (entity) {
	// get the actual tiles taken up by an entity
		if(entity.name === 'express-underground-belt'){
			return {[entity.position.x]: {[entity.position.y]: true}};
		}
		// todo: handle cases other than this specific one
	}

	let entityMap = {};
	entities.forEach( entity => {
		let footPrint = getEntityFootPrint(entity);
		Object.keys(footPrint).forEach( x => {
			if(!entityMap[x]){
				entityMap[x] = {};
			}
			Object.keys(footPrint[x]).forEach( y => {
				if(!entityMap[x][y]){
					entityMap[x][y] = {};
				}
				entityMap[x][y] = entity;
			});
		});
	});
};

let undergroundPathFinder = (entityMap, x, startY, endY, maxLen) => {
	if(startY === endY){
		throw new Error("invalid");
	}

	// check that beginning and end are clear
	if(entityMap[x][startY] || entityMap[x][endY]){
			throw new Error("no path");
	}

	if(Math.abs(startY - endY) <= maxLen){
		// just return the start and end
	}

	// check that there is width two empty space at least ever maxLen blocks
	// recursively check with greedy algorithm

	let newEntities = [];
	let twoWidthYs = [];
	for(let y = startY + 1; y < endY; y++){
		if(!entityMap[x][y] && !entityMap[x][y + 1]){
			twoWidthYs.push(y);
		}
	}
	let lastY = startY;
	for(let i = 0; i < twoWidthYs.length; i++){
		if(Math.abs(lastY - twoWidthYs[y]) > maxLen){
			throw new Error("no path");
		}
	}
	
}


let getColumns = (recipes) => {
	// go over recipes running getColumn with initial belt of basic items (copper iron plates etc)
	// merge into single entities list making sure nothing overlaps
	// todo: work out input output math so we can make multiple columns of same product when needed
};





// position: { "x": 4, "y": -59 }
// splitters have "output_priority": "left" | "right"
// splitters have "filter" : [item_name]
// assembly machines have "recipe" : [item_name]
// logistics chests have "request_filters" : [look up this schema]
// underground belts have "type": "input" | "output"






return;

 
