import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene44 extends Scene {
    constructor() { super('scene_44'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_44').setDisplaySize(width, height);
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene44;
