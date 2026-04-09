
import { Boot } from './scenes/Boot';
import { Intro } from './scenes/Intro';
import { Scene1 } from './scenes/scene_1';
import { Scene2 } from './scenes/scene_2';
import { Scene3 } from './scenes/scene_3';
import { Scene4 } from './scenes/scene_4';
import { Scene5 } from './scenes/scene_5';
import { Scene6 } from './scenes/scene_6';
import { Scene7 } from './scenes/scene_7';
import { Scene8 } from './scenes/scene_8';
import { Scene9 } from './scenes/scene_9';
import { Scene10 } from './scenes/scene_10';
import { Scene11 } from './scenes/scene_11';
import { Scene12 } from './scenes/scene_12';
import { Scene13 } from './scenes/scene_13';
import { Scene14 } from './scenes/scene_14';
import { Scene15 } from './scenes/scene_15';
import { Scene16 } from './scenes/scene_16';
import { Scene17 } from './scenes/scene_17';
import { Scene18 } from './scenes/scene_18';
import { Scene19 } from './scenes/scene_19';
import { Scene20 } from './scenes/scene_20';
import { Scene21 } from './scenes/scene_21';
import { Scene22 } from './scenes/scene_22';
import { Scene23 } from './scenes/scene_23';
import { Scene24 } from './scenes/scene_24';
import { Scene25 } from './scenes/scene_25';
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1600,
    height: 900,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Intro,
        Scene1,
        Scene2,
        Scene3,
        Scene4,
        Scene5,
        Scene6,
        Scene7,
        Scene8,
        Scene9,
        Scene10,
        Scene11,
        Scene12,
        Scene13,
        Scene14,
        Scene15,
        Scene16,
        Scene17,
        Scene18,
        Scene19,
        Scene20,
        Scene21,
        Scene22,
        Scene23,
        Scene24,
        Scene25
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
