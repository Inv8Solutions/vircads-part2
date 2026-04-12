import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene56 extends Scene {
    constructor() { super('scene_56'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_56').setDisplaySize(width, height);
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene56;
