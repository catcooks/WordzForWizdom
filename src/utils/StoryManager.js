export default class StoryManager {
    static storyData = {};

    static init(data) {
        this.storyData = data;
    }

    static getCurrentQuestTitle(questId) {
        const story = this.storyData[questId];
        if (!story) return null; 
        
        const currentIndex = story.current_stage;
        return story.quest[currentIndex].title; 
    }

    // NEW: Helper to check what stage we are currently on
    static getCurrentStage(questId) {
        return this.storyData[questId] ? this.storyData[questId].current_stage : -1;
    }

    // NEW: The method to complete a stage and advance
    static completeCurrentStage(questId) {
        const story = this.storyData[questId];
        if (!story) return;

        const current = story.current_stage;
        
        // Ensure the stage actually exists in the array
        if (story.quest[current]) {
            // Mark it as completed
            story.quest[current].is_completed = true;
            console.log(`✅ Quest Log Updated: Finished "${story.quest[current].title}"`);

            // Advance to the next stage if there is one
            if (story.quest[current + 1]) {
                story.current_stage++;
                console.log(`➡️ Quest Advanced: Now on Stage ${story.current_stage}`);
            }
        }
    }
}