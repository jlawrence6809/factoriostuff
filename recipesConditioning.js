let fs = require('fs');
let recipesMap = JSON.parse(fs.readFileSync('./recipes_16_35.json', 'UTF-8'));
let keys = Object.keys(recipesMap);
let recipes = Object.values(recipesMap);

let valids = [
	"piercing-rounds-magazine",
	"gun-turret",
	"grenade",
	"science-pack-2",
	"speed-module",
	"long-handed-inserter",
	"effectivity-module-2",
	"low-density-structure",
	"big-electric-pole",
	"effectivity-module-3",
	"iron-gear-wheel",
	"assembling-machine-2",
	"iron-stick",
	"fast-inserter",
	"cargo-wagon",
	"productivity-module-3",
	"heat-exchanger",
	"military-science-pack",
	"electric-engine-unit",
	"logistic-robot",
	"advanced-circuit",
	"express-transport-belt",
	"assembling-machine-3",
	"stack-filter-inserter",
	"copper-cable",
	"express-splitter",
	"constant-combinator",
	"iron-axe",
	"stack-inserter",
	"underground-belt",
	"locomotive",
	"transport-belt",
	"train-stop",
	"substation",
	"hazard-concrete",
	"assembling-machine-1",
	"rail-chain-signal",
	"storage-tank",
	"rail",
	"electronic-circuit",
	"nuclear-reactor",
	"offshore-pump",
	"flying-robot-frame",
	"stone-furnace",
	"pump",
	"speed-module-2",
	"heat-pipe",
	"steel-furnace",
	"high-tech-science-pack",
	"steel-chest",
	"rocket-silo",
	"inserter",
	"steam-turbine",
	"fast-transport-belt",
	"splitter",
	"speed-module-3",
	"express-underground-belt",
	"solar-panel-equipment",
	"chemical-plant",
	"solar-panel",
	"uranium-fuel-cell",
	"productivity-module",
	"logistic-chest-requester",
	"pipe-to-ground",
	"science-pack-3",
	"science-pack-1",
	"satellite",
	"productivity-module-2",
	"steel-axe",
	"rocket-fuel",
	"pipe",
	"red-wire",
	"repair-pack",
	"refined-hazard-concrete",
	"beacon",
	"centrifuge",
	"battery",
	"boiler",
	"radar",
	"pumpjack",
	"programmable-speaker",
	"accumulator",
	"concrete",
	"green-wire",
	"processing-unit",
	"electric-mining-drill",
	"power-switch",
	"rocket-control-unit",
	"refined-concrete",
	"arithmetic-combinator",
	"logistic-chest-active-provider",
	"fast-splitter",
	"electric-furnace",
	"logistic-chest-passive-provider",
	"logistic-chest-buffer",
	"lab",
	"fluid-wagon",
	"logistic-chest-storage",
	"production-science-pack",
	"roboport",
	"filter-inserter",
	"fast-underground-belt",
	"steam-engine",
	"medium-electric-pole",
	"rail-signal",
	"engine-unit",
	"construction-robot",
	"decider-combinator",
	"effectivity-module",
	"oil-refinery"
];

function doInclude(recipe){
	const category = ['smelting', 'chemistry', 'rocket-building', 'oil-processing', 'centrifuging'];
	const subgroups = ['empty-barrel','fill-barrel','fluid-recipes','intermediate-product','raw-material'];
	return recipe && valids.indexOf(recipe.name) > -1 && !(category.indexOf(recipe.category) > -1 || subgroups.indexOf(recipe.subgroup) > -1 );
}

// https://gist.githubusercontent.com/shinout/1232505/raw/68bb46d15f6996f43f7f2160d6a0c276b0d295ce/tsort.js
function tsort(r){var n={},t=[],i={},f=function(r){this.id=r,this.afters=[]};return r.forEach(function(r){var t=r[0],i=r[1];n[t]||(n[t]=new f(t)),n[i]||(n[i]=new f(i)),n[t].afters.push(i)}),Object.keys(n).forEach(function r(f,o){var a=n[f],s=a.id;i[f]||(Array.isArray(o)||(o=[]),o.push(s),i[f]=!0,a.afters.forEach(function(n){if(o.indexOf(n)>=0)throw new Error("closed chain : "+n+" is in "+s);r(n.toString(),o.map(function(r){return r}))}),t.unshift(s))}),t}

// build ingredientFor
keys.forEach( key => {
	let rec = recipesMap[key];
	let ingredients = rec.ingredients;
	if(typeof ingredients === 'undefined'){
		ingredients = rec.normal.ingredients;
	}
	rec.ingredientList = ingredients.map( i => Array.isArray(i) ? i[0] : i.name);
	rec.ingredientList.forEach( ing => {
		if(keys.indexOf(ing) > -1){
			if(!recipesMap[ing].ingredientFor){
				recipesMap[ing].ingredientFor = [];
			}
			recipesMap[ing].ingredientFor.push(key);
		}
	});
});

// construct edges
let edges = [];
keys.forEach( key => {
	if(valids.indexOf(key) < 0) return;
	recipesMap[key].ingredientList.forEach( ing => edges.push([ing, key]));
});

// run topo sorting
let sortedKeys = tsort(edges);


// hydrate the recipes list
let sortedRecipes = [];
let rawInputs = [];
sortedKeys.forEach( key => {
	if(doInclude(recipesMap[key])){
		sortedRecipes.push({
			name: key,
			ingredientList: recipesMap[key].ingredientList,
			ingredientFor: recipesMap[key].ingredientFor,
		});
	} else {
		rawInputs.push(key);
	}
});

// sortedKeys = sortedKeys.filter( key => doInclude(recipesMap[key]));

let miscIngredients = [];
sortedRecipes.forEach( recipe => {
	recipe.ingredientList.forEach( ingredient => {
		if(!recipesMap[ingredient] && miscIngredients.indexOf(ingredient) < 0){
			miscIngredients.push(ingredient);
		}
	});
});

let output = {
	sortedRecipes: sortedRecipes,
	rawInputs: rawInputs,
	miscIngredients: miscIngredients,
};

console.log(JSON.stringify(output, null, '\t'));















