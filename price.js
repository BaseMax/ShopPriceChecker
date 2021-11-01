/*
 * Name: Shop product price, and availability checker with supporting n* filters
 * Author: Max Base
 * Date: 11/01/2021
 */

const state = {
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

const getSelectedFilters = () => {
    return state.selections.map(select => select.value || '');
};

// get price of selected filters from `state.prices[state.selections...]`
const getSelectedPrice = () => {
    return getPrice(
        state.selections.map(select => select.value || '')
    );
};

const getPrice = (filterSlugs) => {
    const selectionString = filterSlugs.join('_');
    const selectionPrice = state.prices[selectionString];

    if(selectionPrice?.price !== null)
        return selectionPrice;
    return undefined;
};

const checkHasPricesForPrefix = (filterSlugs) => {
    const selectionString = filterSlugs.join('_');
    if(!state.prices_keys) {
        state.prices_keys = Object.keys(state.prices);
    }
    // console.log(state.prices_keys);
    return state.prices_keys.map(key => key.startsWith(selectionString)).includes(true);
};

const initSelect = () => {
    // auto select first option of each filter and save that at `state.selection`
    const filters = state.filters;
    filters.forEach((filter, filter_index) => {
        const first_option = filter.options[0];
        state.selections[filter_index] = {
            filter: filter.slug,
            value: first_option.slug,
        };
    });
};

const render = () => {
    const selections = state.selections;
    const filters = state.filters;
    const prices = state.prices;
    const price = getSelectedPrice();

    // const price_html = `
    //     <div class="price">
    //         <span class="price-value">${price.price}</span>
    //         <span class="price-off">${price.off}</span>
    //     </div>
    // `;

    const filters_html = filters.map(filter => {
        return `
            <div class="filter" data-filter-id="${filter.id}" data-filter-slug="${filter.slug}" data-filter-name="${filter.name}">
                <div class="filter-name">${filter.name}</div>
                <div class="filter-options">
                    ${
                        filter.options.map(option => {
                            const selected = selections.find(selection => selection.filter === filter.slug && selection.value === option.slug);
                            const selected_class = selected ? ' selected' : '';
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
                    }
                </div>
            </div>
        `;
    }).join('');

    const product_html = `
        <div class="product">
            ${filters_html}
            <div class="product-price-box">
                <span class="product-price">${5000}</span>
            </div>
        </div>`;
    console.log(product_html);
};

// const choose = (filter_type, filter_value_id) => {
//     state.selections.forEach(selection => {
//         if (selection.filter === filter_type) {
//             selection.value = filter_value_id;
//         }
//     });
//     console.log(state.selections);
//     console.log(state.prices);
// };

initSelect();

const p1= getSelectedPrice();
console.log(p1);

const g = getSelectedFilters();
console.log(g);

const p2 = getPrice(['red', 'large']);
console.log(p2);

render();
// checkHasPricesForPrefix
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
console.log("Test createFiltersWithOrder:");
const k = createFilterNamesWithOrder(['size', 'color']);
console.log(k);

const q = createFilterNamesWithOrder(['color', 'size']);
console.log(q);

// createFiltersWithOrder
console.log("Test createFiltersWithOrder:");
const h = createFiltersWithOrder({
    size: 'small',
    color: 'red'
});
console.log(h);
