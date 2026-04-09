import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene30 extends Scene {
    constructor() { super('scene_30'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_30').setDisplaySize(width, height);

        // UI scaffold placeholder
        const uiContainer = this.add.container(0, 0).setDepth(1000);
        const label = this.add.text(12, 12, 'scene_30 UI scaffold', { font: '16px Arial', color: '#ffffff' }).setDepth(1000);
        uiContainer.add(label);

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene30;
