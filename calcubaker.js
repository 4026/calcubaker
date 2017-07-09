/**
 * JS for calcubaker app.
 */

function temperatureAdjust(temperature, timeAt30)
{
    return timeAt30 / Math.pow(0.95, 30 - temperature)
}

function breadFromDough(doughWeight)
{
    return doughWeight * 0.8;
}

function formatHours(hours)
{
    let h = Math.floor(hours);
    let m = Math.round((hours - h) * 60);
    return h + "h " + m + "m";
}


const recipes = [
    {
        name: "Sourdough",
        ingredients: { flour: 1500, water: 1000, starter: 70, salt: 30 },
        foldTime: 1,
        shapeTime: 1,
        bulkTime: 7
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
        multiplier: 1,
        temperature: 20
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
        },
        foldTime : function() {
            return formatHours(
                temperatureAdjust(this.temperature, this.selectedRecipe.foldTime)
            );
        },
        shapeTime : function() {
            return formatHours(
                temperatureAdjust(this.temperature, this.selectedRecipe.foldTime + this.selectedRecipe.shapeTime)
            );
        },
        bulkTime : function() {
            return formatHours(
                temperatureAdjust(this.temperature, this.selectedRecipe.bulkTime)
            );
        },
        totalTime : function() {
            return formatHours(
                temperatureAdjust(
                    this.temperature,
                    this.selectedRecipe.foldTime + this.selectedRecipe.shapeTime + this.selectedRecipe.bulkTime
                )
            );
        },
        bakeAt: function() {
            let hours = temperatureAdjust(
                this.temperature,
                this.selectedRecipe.foldTime + this.selectedRecipe.shapeTime + this.selectedRecipe.bulkTime
            );
            return moment().add(hours, "hours").calendar();
        }
    }
});