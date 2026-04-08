import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene11 extends Scene {
    constructor() {
        super('scene_11');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_11').setDisplaySize(width, height);

        // TODO: add scene-specific UI/logic here

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene11;
