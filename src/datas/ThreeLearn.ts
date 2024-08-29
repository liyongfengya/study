import { Color, Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, DoubleSide, Vector3,
     ArrowHelper, Matrix4, Quaternion, Ray, Plane, Texture, TextureLoader, RepeatWrapping, GridHelper, HemisphereLight, DirectionalLight,
     Group, AnimationClip, AnimationMixer, AnimationAction, Clock,
     Box3} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Tween } from 'three/examples/jsm/libs/tween.module.js';

export class ThreeLearn{
    // 控制参数
    private cameraMoveScale: number = 0.15;


    // 基本元素
    private scene: Scene | null = null;
    private camera: PerspectiveCamera | null = null;
    private domElement: HTMLElement | null = null;

    // 功能元素
    private wheelDownPtInScreen: Vector3 = new Vector3();
    private wheelDownPtInWord: Vector3 = new Vector3();
    private bIsMouseDown: boolean = false;
    private bIsWheelDown: boolean = false;
    private wheelDownProjectionMatrixInverse: Matrix4 | null = null;  // 滚轮按下时的逆投影矩阵
    private wheelDownMatrixWorld: Matrix4 | null = null;              // 滚轮按下时的相机矩阵
    private wheelDownCameraPos: Vector3 | null = null;                // 滚轮按下时相机的位置
    private wheelDownCameraDir: Vector3 | null = null;                // 滚轮接下时相机的方向

    // 绑定函数，需要改变this指向(事件中this指向触发元素)
    private mouseDownFunc: any = null;
    private mouseUpFunc: any = null;
    private mouseMoveFunc: any = null;
    private mouseWheelFunc: any = null;
    private resizeFunc: any = null;

    // 动画
    private mixer: AnimationMixer | null = null;
    private clock: Clock | null = null;

    constructor(id: string){
        this.init(id);
        this.cameraControl();
    }

    public init(elId: string) {
        // 挂载元素
        const el: HTMLElement | null = document.getElementById(elId);
        if(!el){ return; }

        // 画布、透视相机
        this.scene = new Scene();
        this.scene.background = new Color("#F5F5F5");
        this.camera = new PerspectiveCamera(75, el.clientWidth / el.clientHeight, 100, 5000);
        this.camera.position.set(0,-1000,1000* Math.tan(Math.PI / 6));
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(new Vector3(0,2000,0));

        // 渲染器
        const renderer = new WebGLRenderer();
        renderer.setSize(el.clientWidth, el.clientHeight);
        el.appendChild(renderer.domElement);
        this.domElement = renderer.domElement;

        // 坐标轴
        /* const orign = new Vector3();
        const length = 500;
        const arrowX = new ArrowHelper( new Vector3(1,0,0), orign, length, "#FF0000", 80, 20 );
        const arrowY = new ArrowHelper( new Vector3(0,1,0), orign, length, "#00FF00", 80, 20 );
        const arrowZ = new ArrowHelper( new Vector3(0,0,1), orign, length, "#0000FF", 80, 20 );
        this.scene.add( arrowX, arrowY, arrowZ ); */

        // 地面
        const planeGeo = new PlaneGeometry(15000,15000);
        /* const texture: Texture = new TextureLoader().load("src/assets/img/ground.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(10,10); */
        const planMat = new MeshBasicMaterial({
             color: "#CDC3A7",
             side: DoubleSide,
             transparent: true,
             opacity: 0.5,
            });
        const plane: Mesh = new Mesh(planeGeo, planMat);
        const grid = new GridHelper( 15000, 40, 0xFFFFFF, 0xFFFFFF );
        grid.material.transparent = true;
        const gridMat: Matrix4 = new Matrix4().premultiply(new Matrix4().makeRotationX(Math.PI / 2)).premultiply(new Matrix4().makeRotationZ(Math.PI/12));
        grid.applyMatrix4(gridMat);
        this.scene.add(plane, grid);

        // 灯光
        const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
        hemiLight.position.set( 0, 0, 500 );
        this.scene.add( hemiLight );

        const dirLight = new DirectionalLight( 0xffffff, 3 );
        dirLight.position.set( 0, -500, 500 );
        this.scene.add( dirLight );

        // 物体
        /* const geometry = new BoxGeometry(100, 100, 100);
        const material = new MeshBasicMaterial({
            color: 0x00ff00,
            depthTest: false
        });
        const cube = new Mesh(geometry, material);
        this.scene.add(cube); */

        // 机器人
        const loader = new GLTFLoader();
        loader.load( 'src/models/RobotExpressive.glb', ( gltf )=>{
            const model = gltf.scene;
            model.scale.set(150, 150, 150);
            const mat: Matrix4 = new Matrix4().premultiply(new Matrix4().makeRotationX(Math.PI / 2))/* .premultiply(new Matrix4().makeRotationZ(Math.PI/12)) */;
            model.applyMatrix4(mat);
            this.scene!.add( model );
            // createGUI( model, gltf.animations );
            this.robotAnimation(model, gltf.animations);
        }, undefined, function ( e ) {
            console.error( e );
        });

        // 文字
        const fontLoader = new FontLoader();
        fontLoader.load( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json', ( font )=>{
            const textgGeo = new TextGeometry( 'Welcome to my admin system !', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            });
            // 位置
            textgGeo.computeBoundingBox();
            const box: Box3 | null = textgGeo.boundingBox;
            const length: number = box !== null ? Math.abs(box.max.x - box.min.x) : 100;
            const mat: Matrix4 = new Matrix4().premultiply(new Matrix4().makeRotationX(Math.PI / 2)).premultiply(new Matrix4().makeTranslation(-length/2, 0, 800));
            textgGeo.applyMatrix4(mat);
            const textMaterial = new MeshBasicMaterial({
                color: "green",
                transparent: true
            });
            const mesh = new Mesh(textgGeo, textMaterial);
            this.scene!.add(mesh);
        });

        const animate = ()=>{
            requestAnimationFrame(animate);
            /* cube.rotation.x += 0.01;
            cube.rotation.y += 0.01; */
            if(this.mixer && this.clock){
                this.mixer.update(this.clock.getDelta());
            }
            renderer.render(this.scene!, this.camera!);
        }
        animate();
    }

    public cameraControl(): void{
        if(!this.domElement){ return; }
        // this指向当前对象
        this.mouseDownFunc = this.mouseDown.bind(this);
        this.mouseUpFunc = this.mouseUp.bind(this);
        this.mouseMoveFunc = this.mouseMove.bind(this);
        this.mouseWheelFunc = this.mouseWheel.bind(this);
        this.resizeFunc = this.resize.bind(this);
        // 添加事件
        this.domElement.addEventListener("mousedown", this.mouseDownFunc, false);
        this.domElement.addEventListener("mouseup", this.mouseUpFunc, false);
        this.domElement.addEventListener("mousemove", this.mouseMoveFunc, false);
        this.domElement.addEventListener("wheel", this.mouseWheelFunc, false);
        window.addEventListener("resize", this.resizeFunc, false);
    }
    public cancelCameraControl(): void {
        if(!this.domElement){ return; }
        this.domElement.removeEventListener("mousedown", this.mouseDownFunc, false);
        this.domElement.removeEventListener("mouseup", this.mouseUpFunc, false);
        this.domElement.removeEventListener("mousemove", this.mouseMoveFunc, false);
        this.domElement.removeEventListener("wheel", this.mouseWheelFunc, false);
        window.removeEventListener("resize", this.resizeFunc, false);
    }

    private mouseDown(event: MouseEvent){
        if(!this.camera){ return; }
        if (event.button === 1 || event.button === 0) { // 鼠标滚轮/左键
            // 鼠标
            this.domElement!.style.cursor = "move";
            //
            this.bIsMouseDown = true;
            this.bIsWheelDown = event.button === 1;
            //
            this.wheelDownPtInScreen = this.getMousePtInScreen(event.clientX, event.clientY);
            this.wheelDownPtInWord = this.wheelDownPtInScreen.clone();
            this.wheelDownPtInWord.unproject(this.camera);
            this.wheelDownProjectionMatrixInverse = this.camera.projectionMatrixInverse.clone();
            this.wheelDownMatrixWorld = this.camera.matrixWorld.clone();
            this.wheelDownCameraPos = this.camera.position.clone();
            this.wheelDownCameraDir = new Vector3();
            this.camera.getWorldDirection(this.wheelDownCameraDir);
        }
    }
    private mouseUp(event: MouseEvent){
        this.bIsMouseDown = false;
        // 鼠标
        this.domElement!.style.cursor = "default";
        if (event.button === 1) { // 鼠标滚轮
            this.bIsWheelDown = false;
        }
    }
    // 左键旋转，滚轮挪动
    private mouseMove(event: MouseEvent){
        if(!this.camera){ return; }
        if (this.bIsMouseDown) {
            if (this.bIsWheelDown) {
                const screenPtInWorld: Vector3 = this.getMousePtInScreen(event.clientX, event.clientY);
                screenPtInWorld.applyMatrix4(this.wheelDownProjectionMatrixInverse!).applyMatrix4(this.wheelDownMatrixWorld!);
                const vecMove: Vector3 = screenPtInWorld.clone().sub(this.wheelDownPtInWord!).multiplyScalar(this.cameraMoveScale);
                const ptNewPosition: Vector3 = this.camera.position.clone();
                ptNewPosition.add(vecMove);

                // 移动相机位置
                this.camera.position.copy(ptNewPosition);
                // 移动相机lookat点
                const cameraDir: Vector3 = new Vector3();
                this.camera.getWorldDirection(cameraDir);
                const newLookAt: Vector3 = this.camera.position.clone();
                newLookAt.add(cameraDir);
                this.camera.lookAt(newLookAt);

                this.camera.updateProjectionMatrix();
            } else {
                // 计算在屏幕上的移动量
                const screenPt: Vector3           = this.getMousePtInScreen(event.clientX, event.clientY);
                const vecMoveOnScreen: Vector3    = screenPt.clone().sub(this.wheelDownPtInScreen!);

                // 计算按下时与水平面的交点，作为旋转的中心点
                const rayIntersectPt: Vector3 = this.getRayHitOnXOY();

                // 计算上下翻转的轴
                const verRotateAxisPt1: Vector3 = new Vector3(0, 0, 0);
                const verRotateAxisPt2: Vector3 = new Vector3(1, 0, 0);
                verRotateAxisPt1.applyMatrix4(this.wheelDownMatrixWorld!);
                verRotateAxisPt2.applyMatrix4(this.wheelDownMatrixWorld!);
                const verRotateAxis: Vector3 = verRotateAxisPt2.clone().sub(verRotateAxisPt1).setZ(0).normalize();

                // 计算旋转量
                const verRotateQuaternion: Quaternion = new Quaternion();
                const horRotateQuaternion: Quaternion = new Quaternion();
                verRotateQuaternion.setFromAxisAngle(verRotateAxis, Math.PI * vecMoveOnScreen.y);
                horRotateQuaternion.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI * (-vecMoveOnScreen.x));

                // 旋转相机位置和视角
                const cameraNewPos: Vector3 = this.wheelDownCameraPos!.clone();
                const cameraNewDir: Vector3 = this.wheelDownCameraDir!.clone();

                cameraNewPos.sub(rayIntersectPt);
                cameraNewPos.applyQuaternion(verRotateQuaternion);
                cameraNewPos.applyQuaternion(horRotateQuaternion);
                cameraNewPos.add(rayIntersectPt);

                cameraNewDir.applyQuaternion(verRotateQuaternion);
                cameraNewDir.applyQuaternion(horRotateQuaternion);

                const newLookAt: Vector3 = cameraNewPos.clone();
                newLookAt.add(cameraNewDir);

                this.camera.position.copy(cameraNewPos);
                this.camera.lookAt(newLookAt);

                this.camera.updateProjectionMatrix();
            }
        }
    }
    // 
    private mouseWheel(event: MouseEvent){
        event.preventDefault();
        event.stopPropagation();

        if(!this.camera){  return; }
        if(!this.bIsWheelDown){
            //
            const delta: number = (event as any).wheelDelta ?? 100;
            //
            // const screenHitPt: Vector3 = this.getMousePtInScreen(event.clientX, event.clientY);
            // screenHitPt.unproject(this.camera);
            const cameraPos: Vector3 = this.camera.position.clone();
            // const wheelDir: Vector3 = new Vector3().subVectors(screenHitPt, cameraPos).normalize();
            const wheelDir: Vector3 = new Vector3();
            this.camera.getWorldDirection(wheelDir);
            // 
            const newCameraPos: Vector3 = cameraPos.addScaledVector(wheelDir, delta);
            this.camera.position.copy(newCameraPos);
            //

            this.camera.updateProjectionMatrix();
        }
    }
    private resize(){}


    // 获取屏幕点在标准坐标系中的值
    private getMousePtInScreen(clientX: number, clientY: number): Vector3 {
        const dScreenX: number = (clientX / this.domElement!.offsetWidth) * 2 - 1;
        const dScreenY: number = -(clientY / this.domElement!.offsetHeight) * 2 + 1;
        const screenPt: Vector3 = new Vector3(dScreenX, dScreenY, -1);
        return screenPt;
    }
    // 获取旋转时候的基点(基于世界坐标系xoy平面)
    private getRayHitOnXOY(){
        const rayHitPt: Vector3 = new Vector3();
        const testRay: Ray            = new Ray(this.wheelDownPtInWord!.clone(), this.wheelDownCameraDir!.clone());
        const horZ0Plan: Plane        = new Plane(new Vector3(0, 0 , 1), 0);
        testRay.intersectPlane(horZ0Plan, rayHitPt);
        return rayHitPt;
    }

    // 动画
    private robotAnimation( model: Group, animations: AnimationClip[]) {
        const wave: AnimationClip | undefined = animations.find(el=> el.name === "Wave");
        if(!wave){ return; }
        this.mixer = new AnimationMixer(model);
        const clipAtion: AnimationAction = this.mixer.clipAction(wave);
        clipAtion.play();
        clipAtion.timeScale = 0.7;
        this.clock = new Clock();
    }
}