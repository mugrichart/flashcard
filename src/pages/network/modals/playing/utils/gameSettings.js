
import storySettingsSelector from "../../../../external/yapping/utils/storySettings";

class RoomSetup {
    constructor({ id, users, creator }) {
        this.id = id;
        this.users = users,
        this.creator = creator
    }

    update(newSetup) {
        Object.entries(newSetup).forEach(([settingKey, settingValue]) => {
            if (settingValue !== undefined) this[settingKey] = settingValue;
        });
    }
}

class GameSetup {
    constructor(setup) {
        this.type = setup.typeOfGame;
        this.room = new RoomSetup(setup.room)
        this.data = gameSelector(setup) // || { update: () => {} };  // ✅ Avoids `undefined.update()`
    }

    get players () { return this.room.users }
    get creator () { return this.room.creator }
    get id () { return this.room.creator}

    update(newSetup) {
        this.room.update(newSetup.room || {})
        this.data.update(newSetup[this.type] || {})
        return this
    }

}

const gameSelector = (setup) => {
   switch (setup.typeOfGame) {
        case "story": return new storySettingsSelector(setup.story);
        default: return null;
   }
}

export default GameSetup