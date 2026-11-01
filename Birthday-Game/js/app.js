// ======================================
// APPLICATION CONTROLLER
// ======================================

const App = {

    player: {
        name: "",
        age: 0
    },

    startGame(name, age) {

        this.player.name = name;
        this.player.age = age;

        console.log("Player:", this.player);

        Game.start();
    },

    escapeHTML(value) {

        return value.replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);

    }

};