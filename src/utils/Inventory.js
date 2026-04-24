//Inventory.js
export default class InventoryManager {
    static items = {}; 
    static addItem(id, amount = 1) {
        this.items[id] = (this.items[id] || 0) + amount;
        console.log(`Inventory: Added ${amount} ${id}(s). Total: ${this.items[id]}`);
    }
    static removeItem(id, amount = 1) {
        if (this.getItemCount(id) >= amount) {
            this.items[id] -= amount;
            return true;
        }
        return false;
    }
    static getItemCount(id) {
        return this.items[id] || 0;
    }
}
