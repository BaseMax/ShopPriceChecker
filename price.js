/*
 * Name: Shop product price, and availability checker with supporting n* filters
 * Author: Max Base
 * Date: 11/01/2021
 */

const PIECE = '_';
const state = {
    defaultPrice: {
        price: 99999,
        off: 99997
    },
    selections: [
        { filter: 'color', value: undefined },
        { filter: 'size', value: undefined },
    ],
    filters: [
        {
            id: 1, slug: 'color', name: 'رنگ', options: [
                { id: 1, slug: 'red', name: 'قرمز', color: '#ff0000' },
                { id: 2, slug: 'green', name: 'سبز', color: '#1bff00' },
                { id: 3, slug: 'blue', name: 'آبی', color: '#0095ff' },
                // { id: 4, slug: 'yellow', name: 'زرد', color: '#ffeb00' },
                // { id: 5, slug: 'black', name: 'سیاه', color: '#000000' },
                // { id: 6, slug: 'white', name: 'سفید', color: '#ffffff' },
                // { id: 7, slug: 'gray', name: 'خاکستری', color: '#9d9d9d' },
                // { id: 8, slug: 'brown', name: 'قهوه ای', color: '#3e3a05' },
                // { id: 9, slug: 'pink', name: 'روشن', color: 'gray' },
                // { id: 10, slug: 'purple', name: 'شفاف', color: 'white' },
                // { id: 11, slug: 'orange', name: 'نارنجی', color: 'orange' },
                // { id: 12, slug: 'beige', name: 'زرد سفید', color: 'pink' },
                // { id: 13, slug: 'multi', name: 'چند رنگ', color: 'red' },
            ]
        },
        {
            id: 2, slug: 'size', name: 'سایز', options: [
                { id: 1, slug: 'small', name: 'کوچک' },
                { id: 2, slug: 'medium', name: 'متوسط' },
                { id: 3, slug: 'large', name: 'بزرگ' },
                // { id: 4, slug: 'xlarge', name: 'بزرگ تر'},
            ],
        },
    ],
    prices: {
        // 'red_small': {
        //     price: 2000,
        //     off: 1700
        // },
        'red_medium': {
            price: 50000,
            off: 4500
        },
        'red_large': {
            price: 50000,
            off: 2500
        },
        'green_large': {
            price: 4000,
            off: 8700
        },
        'green_small': {
            price: 4000,
            off: 8700
        },
        'blue_': {
            price: 6000,
            off: 2700
        },
    },
};

const createFilterNamesWithOrder = (filterNames) => {
    let orderedFilters = [];
    state.filters.map(filter => filter.slug).forEach((filterSlug, index) => {
        if(filterNames.includes(filterSlug)) {
            orderedFilters.push(filterSlug);
        }
    });
    return orderedFilters;
};

const createFiltersWithOrder = (filters) => {
    let orderedFilters = {};
    state.filters.map(filter => filter.slug).forEach((filterSlug, index) => {
        if(filters[filterSlug]) {
            orderedFilters[filterSlug] = filters[filterSlug];
        }
    });
    // console.log(filters);
    return orderedFilters;
};

const resetStateSelections = () => {
    // set all values inside state.selections as undefiend
    state.selections.map(selection => selection.value = undefined);
};

const changeFilterValue = (filterSlug, optionValue) => {
    state.selections.map((selection, selection_index) => {
        if(selection.filter === filterSlug) {
            resetStateSelections();
            state.selections[selection_index].value = optionValue;
            fillUndefinedSelectionValues();
        }
    });
    // const selectionItem = state.selections.filter(selection => selection.filter === filterSlug)
    // console.log(selectionItem);
    // selectionItem.value = optionValue;
};

const getSelectedFilters = () => {
    return state.selections.map(select => select.value || '');
};

// get price of selected filters from `state.prices[state.selections...]`
const getSelectedPrice = () => {
    return getPrice(
        state.selections.map(select => select.value || '')
    );
};

const getFinalPrice = () => {
    return getSelectedPrice() ?? state.defaultPrice;
};

const getPrice = (filterSlugs) => {
    const selectionString = filterSlugs.join(PIECE);
    const selectionPrice = state.prices[selectionString];

    if(selectionPrice?.price !== null)
        return selectionPrice;
    return undefined;
};

const checkHasPricesForPrefix = (filterSlugs) => {
    const selectionString = filterSlugs.join(PIECE);
    if(!state.prices_keys) {
        state.prices_keys = Object.keys(state.prices);
    }
    // console.log(state.prices_keys);
    return state.prices_keys.map(key => key.startsWith(selectionString)).includes(true);
};

const getFiltersWithClauses = (clauses, want_filter) => {
    // re-order the keys
    clauses = createFiltersWithOrder(clauses);
    const clausesKeys = Object.keys(clauses);
    // const clausesValues = Object.values(clauses);

    // console.log("want_filter: ", want_filter)
    // console.log("clauses: ", clauses);
    // console.log("clausesKeys: ", clausesKeys);
    // console.log("clausesValues: ", clausesValues);
    
    const all_filters = state.filters_keys;
    // console.log("all_filters: ", all_filters);

    const all_want_options = [];
    state.filters
            // .filter(filter => filter.slug === want_filter)
            // .map(filter => filter.options);
            // .map(option => option.slug);
            .forEach(filter => {
                if(filter.slug === want_filter) {
                    filter.options.forEach(option => all_want_options.push(option.slug))
                }
            });
    // console.log(all_want_options);

    // check if clauses is a empty object {}
    if(clausesKeys.length === 0) {
        return all_want_options;
    }
    
    let pattern = '^';
    all_filters.forEach(filter => {
        // console.log(filter);
        if(pattern !== "^")
            pattern += "_";
        if(clauses[filter]) {
            pattern += `(${clauses[filter]}|)`;
        } else {
            pattern += `([^\\${PIECE}]+|)`;
        }
    });
    if(pattern === '^') {
        return [];
    }
    pattern += '$';
    console.log("pattern: ", pattern);

    const all_supported_field = [];
    // loop state.prices and get `key` of each item
    // console.log(state.prices);
    for(const price_key in state.prices) {
        const reg = new RegExp(pattern, 'g'); // Note: cannot define this Reg variable out side the loop. we need to redefine this everytime inside iterate...
        const match_reg = reg.test(price_key);
        console.log(reg, price_key, match_reg);
        if(match_reg) {
            const match_exec = reg.exec(price_key);
            console.log(match_exec);
            all_supported_field.push(price_key);
        }
    }
    
    return all_supported_field;
};

const fillUndefinedSelectionValues = () => {
    let tmp_selections = [];

    state.filters.forEach((filter, filter_index) => {
        if(filter.options.length === 0) return;

        // console.log(filter_index, state.selections[filter_index]);
        if(state.selections[filter_index].value !== undefined) {
            tmp_selections.push(state.selections[filter_index].value);
            return;
        }
        // console.log(filter_index, state.selections[filter_index]);

        filter.options.forEach((option, option_index) => {
            tmp_selections.push(option.slug);
            if(checkHasPricesForPrefix(tmp_selections)) {
                state.selections[filter_index] = {
                    filter: filter.slug,
                    value: option.slug,
                };
                return;
            } else {
                tmp_selections.pop();
            }
        });
    });
};

const initSelect = () => {
    let tmp_selections = [];

    let add_filters_keys = false;
    if(!state.filters_keys) {
        state.filters_keys = [];
        add_filters_keys = true;
    }

    state.filters.forEach((filter, filter_index) => {
        if(filter.options.length === 0) return;

        state.filters_keys.push(filter.slug);

        filter.options.forEach((option, option_index) => {
            tmp_selections.push(option.slug);
            if(checkHasPricesForPrefix(tmp_selections)) {
                state.selections[filter_index] = {
                    filter: filter.slug,
                    value: option.slug,
                };
                return;
            } else {
                tmp_selections.pop();
            }
        });
    });
};

const render = () => {
    const selections = state.selections;
    const filters = state.filters;

    let tmp_selections_values = [];
    let tmp_selections = {};

    const filters_html = filters.map(filter => {
        // tmp_selections.push(filter.slug);
        console.log(tmp_selections_values);
        console.log(tmp_selections);

        const options_html = filter.options.map(option => {
            const selected = selections.find(selection => selection.filter === filter.slug && selection.value === option.slug);
            const selected_class = selected ? ' selected' : '';
            if(selected) {
                console.log("option:", option);
                tmp_selections_values.push(option.slug);
                tmp_selections[filter.slug] = option.slug;
            }

            return `
                <div class="filter-option filter-option-${filter.slug}${selected_class}" data-filter="${filter.slug}" data-value="${option.slug}" data-id="${option.id}">
                    ${
                        filter.slug === 'color' ?
                            `<div class="filter-option-color" style="background-color: ${option.color}"></div>` :
                            `<span class="filter-option-name">${option.name}</span>`
                    }
                </div>
            `;
        }).join('')

        return `
            <div class="filter" data-filter-id="${filter.id}" data-filter-slug="${filter.slug}" data-filter-name="${filter.name}">
                <div class="filter-name">${filter.name}</div>
                <div class="filter-options">
                    ${options_html}
                </div>
            </div>
        `;

    }).join('');

    const final_price = getFinalPrice();
    const product_html = `
        <div class="product">
            ${filters_html}
            <div class="product-price-box">
                <span class="product-price">${final_price.price}</span>
                ${
                    final_price.off !== null ? `<span class="product-price-off">${final_price.off}</span>` : undefined
                }
            </div>
        </div>`;
    // console.log(product_html);
    return product_html;
};

initSelect();

// changeFilterValue('color', 'green');
// console.log( render() );
console.log( state );

console.log("getFiltersWithClauses:");
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

