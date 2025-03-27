class BaseStorySettings {
    constructor({ title, summary, author, step, mode, story, sentenceIndex }) {
        this.metadata = { title, summary, author };
        this.state = { step, mode, story, sentenceIndex };
    }

    update(updates = {}) {
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key in this.metadata) {
                    this.metadata[key] = value;
                } else if (key in this.state) {
                    this.state[key] = value;
                }
            }
        });
    }
}

// ✅ CreateStorySettings extends StorySettings properly
class CreateStorySettings extends BaseStorySettings {
    constructor(settings) {
        super(settings);
        this.state.sentenceInProgress = settings.sentenceInProgress;
    }
}

// ✅ PracticeStorySettings extends StorySettings properly
class PracticeStorySettings extends BaseStorySettings {
    constructor(settings) {
        super(settings);
        this.state.sentenceInPractice = settings.sentenceInPractice;
    }
}

export default (settings) => {
    if (settings?.mode === "create") {
        return new CreateStorySettings(settings);
    } else if (settings?.mode === "practice") {
        return new PracticeStorySettings(settings);
    } else {
        return new BaseStorySettings(settings); // Ensures `story` is always defined
    }
}
