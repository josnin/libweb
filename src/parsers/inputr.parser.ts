
export const inputValReactive = async (self: any, el: any, prop: string, val: string) => {
    if (el.type === 'text' &&
    el.dataset.bind === prop) {
    // make sure to update only that match with data-binding
    el.value = val;
    }
}