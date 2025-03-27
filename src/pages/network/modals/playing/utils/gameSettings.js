
import storySettingsSelector from "../../../../external/yapping/utils/storySettings";

class RoomSettings {
    constructor({ roomID, roomUsers, isCreator }) {
        this.id = roomID;
        this.users = roomUsers;
        this.creator = isCreator;
    }

    update(newSettings) {
        Object.entries(newSettings).forEach(([settingKey, settingValue]) => {
            if (settingValue !== undefined) this[settingKey] = settingValue;
        });
    }
}

class GameSettings {
    constructor({ typeOfGame }) {
        this.type = typeOfGame;
    }

    update(newSettings) {
        Object.entries(newSettings).forEach(([settingKey, settingValue]) => {
            if (settingValue !== undefined) this[settingKey] = settingValue;
        });
    }
}

// ✅ Base class to remove repetition
class BaseGameRoomSettings {
    constructor(settings) {
        this.room = new RoomSettings(settings);
        this.game = new GameSettings(settings);
    }

    updateRoom(newSettings) {
        this.room.update(newSettings);
    }
    
    updateGame(newSettings) {
        this.game.update(newSettings);
    }
}


// ✅ Subclasses extend the base class
class QuizGameSettings extends BaseGameRoomSettings {}

class StoryGameSettings extends BaseGameRoomSettings {
    constructor(settings) {
        super(settings);
        this.story = storySettingsSelector(settings)
    }

}

class ChatGameSettings extends BaseGameRoomSettings {}

export {
    QuizGameSettings,
    StoryGameSettings,
    ChatGameSettings
}