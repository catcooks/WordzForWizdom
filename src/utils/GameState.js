export default class GameState {
    static items = {}; // { 'goblin_ear': 5, 'ogre_tongue': 1 }
    static quests = {}; // This will hold your story.json data

    // Initial setup
    static init(initialQuests) {
        this.quests = initialQuests;
    }

    // THE GLOBAL FUNCTION: Call this from ANY scene
    static addItem(itemId, amount = 1) {
        // 1. Update Inventory
        this.items[itemId] = (this.items[itemId] || 0) + amount;
        console.log(`Inventory: ${itemId} is now ${this.items[itemId]}`);

        // 2. Automatically update all active quests that need this item
        for (let qKey in this.quests) {
            const quest = this.quests[qKey];
            if (quest.requirements && quest.requirements[itemId]) {
                // We found a match!
                console.log(`Quest Update: ${quest.title} progress increased!`);
                // You can add logic here to check if the quest is now "Ready to Turn In"
            }
        }
    }

    static getItemCount(itemId) {
        return this.items[itemId] || 0;
    }
}