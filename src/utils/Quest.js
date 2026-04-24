import InventoryManager from './Inventory.js';

export default class QuestManager {
    static quests = {}; 
    static init(data) {
        this.quests = data;
    }
    static getQuestStatus(questId) {
        return this.quests[questId] ? this.quests[questId].current_stage : -1;
    }
    static checkCompletion(requirements) {
        for (let item in requirements) {
            if (InventoryManager.getItemCount(item) < requirements[item]) {
                return false;
            }
        }
        return true;
    }
    static updateQuest(questId, nextStage) {
        if (this.quests[questId]) {
            this.quests[questId].current_stage = nextStage;
            console.log(`Quest ${questId} updated to stage ${nextStage}`);
        }
    }
}