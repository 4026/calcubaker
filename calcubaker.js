/**
 * JS for calcubaker app.
 */

const recipes = [
    {
        name: "Sourdough",
        ingredients: { flour: 500, water: 330, starter: 25, salt: 10 }
    }
];


Vue.component('ingredient', {
    props: ['name', 'recipeWeight', 'value'],
    template: '#ingredient-template',
    computed: {
        inputId : function() {
            return "input-" + this.name;
        },
        displayName: function() {
            return this.name.charAt(0).toUpperCase() + this.name.slice(1);
        },
        weight : function() {
            return Math.round(this.value * this.recipeWeight);
        }
    },
    methods : {
        updateMultiplier : function (value) {
            this.$emit('input', value / this.recipeWeight)
        }
    }
});

Vue.component('total', {
    props: ['ingredients', 'value'],
    template: '#ingredient-template',
    computed: {
        inputId : function() {
            return "input-dough";
        },
        displayName: function() {
            return "Dough";
        },
        weight : function() {
            return Math.round(
                _.reduce(
                    this.ingredients,
                    function (sum, value) { return sum + (value * this.value); }.bind(this),
                    0
                )
            );
        }
    },
    methods : {
        updateMultiplier : function (value) {
            this.$emit('input', value / _.reduce(this.ingredients, (sum, value) => sum + value, 0))
        }
    }
});


const app = new Vue({
    el: '#app',
    template: "#app-template",
    data: {
        selectedRecipe: recipes[0],
        multiplier: 1
    },
    computed: {
        totalWeight: function() {
            return Math.round(
                _.reduce(
                    this.selectedRecipe.ingredients,
                    function (sum, value) { return sum + (value * this.multiplier); }.bind(this),
                    0
                )
            );
        }
    }
});