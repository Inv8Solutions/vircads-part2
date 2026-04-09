import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene33 extends Scene {
    constructor() { super('scene_33'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_33').setDisplaySize(width, height);

        // UI scaffold placeholder
        const uiContainer = this.add.container(0, 0).setDepth(1000);
        const label = this.add.text(12, 12, 'scene_33 UI scaffold', { font: '16px Arial', color: '#ffffff' }).setDepth(1000);
        uiContainer.add(label);

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene33;
