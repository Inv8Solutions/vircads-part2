
import { Boot } from './scenes/Boot';
import { Intro } from './scenes/Intro';
import { Scene1 } from './scenes/scene_1';
import { Scene2 } from './scenes/scene_2';
import { Scene3 } from './scenes/scene_3';
import { Scene4 } from './scenes/scene_4';
import { Scene5 } from './scenes/scene_5';
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
        Scene5
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
