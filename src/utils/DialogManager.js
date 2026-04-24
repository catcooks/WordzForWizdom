import StoryManager from './StoryManager.js';

export default class DialogManager {
    constructor(scene) {
        this.scene = scene;
        
        const dialogFile = scene.cache.json.get('dialogData');
        this.dialogNodes = dialogFile ? dialogFile.nodes : {};
        
        this.currentNodeKey = null;
        this.history = [];
    }

    /**
     * Fetches the category title from StoryManager and starts the interaction
     */
    getInteraction(questId) {
        // 1. Get the title (e.g., "Meet the Alchemist")
        const categoryTitle = StoryManager.getCurrentQuestTitle(questId);
        
        if (!categoryTitle || !this.dialogNodes[categoryTitle]) {
            console.error(`Category "${categoryTitle}" not found in dialog.json!`);
            return null;
        }

        // 2. Grab the first node key inside that category to kick things off
        const categoryObj = this.dialogNodes[categoryTitle];
        const firstNodeKey = Object.keys(categoryObj)[0];

        return this.start(firstNodeKey);
    }

    start(nodeKey) {
        const node = this.findNode(nodeKey);
        if (!node) {
            console.error(`Node "${nodeKey}" not found!`);
            return null;
        }
        
        this.currentNodeKey = nodeKey;
        this.history = [nodeKey];
        return node;
    }   

    nextStep() {
        const current = this.getCurrentNode();
        
        // If the node has a quest_trigger, handle it here
        if (current && current.quest_trigger) {
            console.log(`📜 Quest Trigger hit for:`, current.quest_trigger);
            // You can route this back to StoryManager when you're ready
        }

        if (current && current.next_node) {
            this.currentNodeKey = current.next_node;
            this.history.push(this.currentNodeKey);
            return this.getCurrentNode();
        }
        
        return null;
    }

    prevStep() {
        if (this.history.length > 1) {
            this.history.pop(); 
            this.currentNodeKey = this.history[this.history.length - 1];
            return this.getCurrentNode();
        }
        return null;
    }

    getCurrentNode() {
        return this.findNode(this.currentNodeKey);
    }

    /**
     * HELPER: Searches your nested JSON categories (e.g., "Meet the Alchemist")
     * to find the specific node key.
     */
    findNode(key) {
        if (!key) return null;
        
        // Search inside categories
        for (const category in this.dialogNodes) {
            if (typeof this.dialogNodes[category] === 'object' && this.dialogNodes[category][key]) {
                return this.dialogNodes[category][key];
            }
        }
        
        return null;
    }
}