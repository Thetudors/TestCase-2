import { Engine } from "./core/Engine";
import { SceneManager } from "./core/scene/SceneManager";
import { CaseOneScene } from "./scenes/CaseOneScene";
import { CaseTwoScene } from "./scenes/CaseTwoScene";
import { CaseThreeScene } from "./scenes/CaseThreeScene";
import { MainScene } from "./scenes/MainScene";

async function init() {
    const engine = new Engine();
    await engine.init();


    
    const sceneManager = SceneManager.init(engine);
    sceneManager.addScene('MainScene', new MainScene());
    sceneManager.addScene('CaseOneScene', new CaseOneScene());
    sceneManager.addScene('CaseTwoScene', new CaseTwoScene());
    sceneManager.addScene('CaseThreeScene', new CaseThreeScene());

}
init().catch(console.error);