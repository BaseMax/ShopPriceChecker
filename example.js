const app = document.querySelector("#app");

function update() {
    const res = render();
    app.innerHTML = res;

    const options = document.querySelectorAll(".filter-option");
    console.log("options: ", options);

    // for(const option of options) {
    //     console.log("option: ", option);
    //     option.addEventListener("click", changeFilterValueReload);
    // }
    options.forEach(option => option.addEventListener("click", changeFilterValueReload))
}

function changeFilterValueReload(filter, value) {
    changeFilterValue(filter, value);
    update();
}

window.addEventListener("load", update);

console.log("\ninitSelect:");
initSelect();
console.log(state.selections);

console.log("\ngetSelectedPrice:");
const p1= getSelectedPrice();
console.log(p1);

console.log("\ngetFinalPrice");
const w = getFinalPrice();
console.log(w);

console.log("\ngetSelectedFilters:");
const g = getSelectedFilters();
console.log(g);

console.log("\ngetPrice:");
const p2 = getPrice(['red', 'large']);
console.log(p2);

// render
console.log("\nrender:");
const res = render();
console.log(res);

// checkHasPricesForPrefix
console.log("\ncheckHasPricesForPrefix:");
const a = checkHasPricesForPrefix(['red', 'large']);
console.log(a, true);
const b = checkHasPricesForPrefix(['red']);
console.log(b, true);
const c = checkHasPricesForPrefix(['red', 'small']);
console.log(c, false);
const d = checkHasPricesForPrefix(['green', 'small']);
console.log(d, true);
const e = checkHasPricesForPrefix(['green']);
console.log(e, true);

// createFiltersWithOrder
console.log("\ncreateFiltersWithOrder:");
const k = createFilterNamesWithOrder(['size', 'color']);
console.log(k);

console.log("\ncreateFilterNamesWithOrder:");
const q = createFilterNamesWithOrder(['color', 'size']);
console.log(q);

// createFiltersWithOrder
console.log("\ncreateFiltersWithOrder:");
const h = createFiltersWithOrder({
    size: 'small',
    color: 'red'
});
console.log(h);

// changeFilterValue
console.log("changeFilterValue:");
changeFilterValue('color', 'green');
console.log(state.selections);

// render
console.log("\nrender:");
const res2 = render();
console.log(res2);

const o = getFiltersWithClauses({}, 'size');
console.log(o);

const o1 = getFiltersWithClauses({color: 'red'}, 'size');
console.log(o1);

const o2 = getFiltersWithClauses({color: 'blue'}, 'size');
console.log(o2);

const o3 = getFiltersWithClauses({color: 'green'}, 'size');
console.log(o3);

const o4 = getFiltersWithClauses({size: 'small'}, 'color');
console.log(o4);

const o5 = getFiltersWithClauses({size: 'medium'}, 'color');
console.log(o5);

const o6 = getFiltersWithClauses({size: 'large'}, 'color');
console.log(o6);
