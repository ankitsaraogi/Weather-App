Basic Dropdown:

```js
var dropdownConfig = {
    options : [
        {
            text: 'Last 1 hour',
            value: 1,
        },
        {
            text: 'Last 12 hour',
            value: 12,
        },
        {
            text: 'Last 1 Day',
            value: 24,
        },
        {
            text: 'Last 1 Week',
            value: 7 * 24,
        },
        {
            text: 'Last 1 Month',
            value: 30 * 24,
        }
    ],
    id : "duration"
};

<DropdownComponent options = {dropdownConfig.options} id = {dropdownConfig.id} />

```