import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene55 extends Scene {
    constructor() { super('scene_55'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_55').setDisplaySize(width, height);
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene55;
