import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene42 extends Scene {
    constructor() { super('scene_42'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_42').setDisplaySize(width, height);
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene42;
