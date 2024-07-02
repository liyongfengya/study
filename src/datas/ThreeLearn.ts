import { Color, Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, DoubleSide, Vector3,
     ArrowHelper, Matrix4 } from "three";

export class ThreeLearn{
    // 基本元素
    private scene: Scene | null = null;
    private camera: PerspectiveCamera | null = null;
    private domElement: HTMLElement | null = null;

    // 功能元素
    private wheelDownPtInScreen: Vector3 = new Vector3();
    private wheelDownPtInWord: Vector3 = new Vector3();
    private bIsWheelDown: boolean = false;
    private bIsCtrlKey: boolean = false;

    // 绑定函数，需要改变this指向(事件中this指向触发元素)
    private mouseDownFunc: any = null;
    private mouseUpFunc: any = null;
    private mouseMoveFunc: any = null;
    private mouseWheelFunc: any = null;
    private resizeFunc: any = null;

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
        this.scene.background = new Color("#DEDEDE");
        this.camera = new PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 3000);
        this.camera.position.set(1000,1000,1000);
        this.camera.lookAt(new Vector3(0,0,0));

        // 渲染器
        const renderer = new WebGLRenderer();
        renderer.setSize(el.clientWidth, el.clientHeight);
        el.appendChild(renderer.domElement);
        this.domElement = renderer.domElement;

        // 坐标轴
        const orign = new Vector3();
        const length = 1000;
        const arrowX = new ArrowHelper( new Vector3(1,0,0), orign, length, "#FF0000", 100, 35 );
        const arrowY = new ArrowHelper( new Vector3(0,1,0), orign, length, "#00FF00", 100, 35 );
        const arrowZ = new ArrowHelper( new Vector3(0,0,1), orign, length, "#0000FF", 100, 35 );
        this.scene.add( arrowX, arrowY, arrowZ );

        // 地面
        const planeGeo = new PlaneGeometry(1500,1500);
        const matrix: Matrix4 = new Matrix4().makeRotationX(Math.PI / 2);
        planeGeo.applyMatrix4(matrix);
        const planMat = new MeshBasicMaterial({
             color: 0xffff00,
             side: DoubleSide,
             transparent: true,
             opacity: 0.5,
            });
        const plane = new Mesh(planeGeo, planMat);
        this.scene.add(plane);

        const geometry = new BoxGeometry(100, 100, 100);
        const material = new MeshBasicMaterial({
            color: 0x00ff00,
            depthTest: false
        });
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);

        const scene = this.scene;
        const camera = this.camera;
        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
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
        if (event.button === 1) { // 鼠标滚轮
            this.bIsWheelDown = true;
            this.bIsCtrlKey = event.ctrlKey;

            this.wheelDownPtInScreen = this.getMousePtInScreen(event.clientX, event.clientY);
            this.wheelDownPtInWord = this.wheelDownPtInScreen.clone();
            this.wheelDownPtInWord.unproject(this.camera);
        }
    }
    private mouseUp(event: MouseEvent){
        if (event.button === 1) { // 鼠标滚轮
            this.bIsWheelDown = false;
        }
    }
    private mouseMove(event: MouseEvent){
        if(!this.camera){ return; }
        if (this.bIsWheelDown) {
            // if (this.bIsCtrlKey) {
            //     // 计算在屏幕上的移动量
            //     const screenPt: Vector3           = this.getMousePtInScreen(event.clientX, event.clientY);
            //     const vecMoveOnScreen: Vector3    = screenPt.clone().sub(this.wheelDownPtInScreen!);

                // 计算按下时与水平面的交点，作为旋转的中心点
            //     let rayIntersectPt: Vector3 = new Vector3();
            //     if(this.planeHelperent?.rlt){
            //         rayIntersectPt = this.planeHelperent?.rlt.point.clone();
            //     } else {
            //         const testRay: THREE.Ray            = new THREE.Ray(this.wheelDownPtInWord!.clone(), this.wheelDownCameraDir!.clone());
            //         const horZ0Plan: THREE.Plane        = new THREE.Plane(new THREE.Vector3(0, 0 , 1), 0);
            //         testRay.intersectPlane(horZ0Plan, rayIntersectPt);
            //         let tmprlt: any = {rlt: {point: rayIntersectPt.clone()}};
            //         Object.assign(this.planeHelperent!,tmprlt);
            //     }
            //     this.planeHelperent?.updataPlaneHelper();

            //     // 计算上下翻转的轴
            //     const verRotateAxisPt1: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
            //     const verRotateAxisPt2: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
            //     verRotateAxisPt1.applyMatrix4(this.wheelDownMatrixWorld!);
            //     verRotateAxisPt2.applyMatrix4(this.wheelDownMatrixWorld!);
            //     const verRotateAxis: THREE.Vector3 = verRotateAxisPt2.clone().sub(verRotateAxisPt1).setZ(0).normalize();

            //     // 计算旋转量
            //     const verRotateQuaternion: THREE.Quaternion = new THREE.Quaternion();
            //     const horRotateQuaternion: THREE.Quaternion = new THREE.Quaternion();
            //     verRotateQuaternion.setFromAxisAngle(verRotateAxis, Math.PI * vecMoveOnScreen.y);
            //     horRotateQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * (-vecMoveOnScreen.x));

            //     // 旋转相机位置和视角
            //     const cameraNewPos: THREE.Vector3 = this.wheelDownCameraPos!.clone();
            //     const cameraNewDir: THREE.Vector3 = this.wheelDownCameraDir!.clone();

            //     cameraNewPos.sub(rayIntersectPt);
            //     cameraNewPos.applyQuaternion(verRotateQuaternion);
            //     cameraNewPos.applyQuaternion(horRotateQuaternion);
            //     cameraNewPos.add(rayIntersectPt);

            //     cameraNewDir.applyQuaternion(verRotateQuaternion);
            //     cameraNewDir.applyQuaternion(horRotateQuaternion);

            //     const newLookAt: THREE.Vector3 = cameraNewPos.clone();
            //     newLookAt.add(cameraNewDir);

            //     camera.position.copy(cameraNewPos);
            //     this.target = newLookAt;

            //     camera.updateProjectionMatrix();
            //     this.update();
        
            //     Fdm.xdb.redraw();
            // } else {
                const screenPtInWorld: Vector3 = this.getMousePtInScreen(event.clientX, event.clientY);
                // screenPtInWorld.applyMatrix4(this.wheelDownProjectionMatrixInverse!).applyMatrix4(this.wheelDownMatrixWorld!);
                screenPtInWorld.unproject(this.camera);

                const vecMove: Vector3 = screenPtInWorld.clone().sub(this.wheelDownPtInWord!);
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
        
            // }
        }
    }
    private mouseWheel(event: MouseEvent){}
    private resize(){}


    // 获取屏幕点在标准坐标系中的值
    private getMousePtInScreen(clientX: number, clientY: number): Vector3 {
        const dScreenX: number = (clientX / this.domElement!.offsetWidth) * 2 - 1;
        const dScreenY: number = -(clientY / this.domElement!.offsetHeight) * 2 + 1;
        const screenPt: Vector3 = new Vector3(dScreenX, dScreenY, -1);
        return screenPt;
    }

}