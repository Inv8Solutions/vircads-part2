import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene14 extends Scene {
    constructor() {
        super('scene_14');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_14').setDisplaySize(width, height);

        // TODO: add scene-specific UI/logic here

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene14;
