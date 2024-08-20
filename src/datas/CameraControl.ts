import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class CameraControl extends OrbitControls{
    // 视图立方体
    // public viewCube: ViewCubeControl;
    // 辅助平面
    // public planeHelperent: Fdm.FdmPlaneHelperent | null = null;

    // 是否启用视图移动，当正在物体操作的时候就屏蔽掉
    // private isEnableView: boolean = true;

    public domElement: HTMLElement;

    public mouseDownFunc: any = null;
    public mouseUpFunc: any = null;
    public mouseMoveFunc: any = null;
    public mouseWheelFunc: any = null;
    public resizeFunc: any = null;

    constructor(object: any, domElement: HTMLElement) {
        super(object, domElement);

        this.enabled = false;
        this.enableZoom = false;
        this.enableRotate = false;
        this.enablePan = false;

        this.domElement = domElement;

        this.mouseDownFunc = this.onMouseDown.bind(this);
        this.mouseUpFunc = this.onMouseUp.bind(this);
        this.mouseMoveFunc = this.onMouseMove.bind(this);
        this.mouseWheelFunc = this.onMouseWheel.bind(this);
        this.resizeFunc = this.onResize.bind(this);

        domElement.addEventListener("mousedown", this.mouseDownFunc, false);
        domElement.addEventListener("mouseup", this.mouseUpFunc, false);
        domElement.addEventListener("mousemove", this.mouseMoveFunc, false);
        domElement.addEventListener("wheel", this.mouseWheelFunc, false);
        window.addEventListener("resize", this.resizeFunc, false);

        this.object.position.set(-50000, -50000, 50000);
        this.object.up.set(0, 0, 1);
        this.object.lookAt(0, 0, 0);
        this.target.set(0, 0, 0);
        this.update();

        // this.viewCube = new ViewCubeControl(object, domElement, this);
        // this.planeHelperent = new Fdm.FdmPlaneHelperent();
    }

    public removeEventListener(): void {
        this.domElement.removeEventListener("mousedown", this.mouseDownFunc, false);
        this.domElement.removeEventListener("mouseup", this.mouseUpFunc, false);
        this.domElement.removeEventListener("mousemove", this.mouseMoveFunc, false);
        this.domElement.removeEventListener("wheel", this.mouseWheelFunc, false);
        window.removeEventListener("resize", this.resizeFunc, false);

        // Fdm.app.scene3.remove(this.viewCube.getObject());
        // this.planeHelperent?.remove();
    }

    // public setEnableView(isEnable: boolean): void {
    //     this.isEnableView = isEnable;
    // }

    public UpdateCamera(pos: THREE.Vector3, dir: THREE.Vector3): void {
        const camera: THREE.OrthographicCamera = this.object as THREE.OrthographicCamera;

        camera.position.copy(pos);
        this.target = pos.clone().add(dir);
        camera.updateProjectionMatrix();
        this.update();

        // Fdm.xdb.redraw();
    }

    private bIsWheelDown: boolean = false;                          // 滚轮是否按下
    private bIsCtrlKey: boolean = false;                            // 是否有ctrl键
    private wheelDownPtInScreen: THREE.Vector3 | null = null;       // 滚轮按下时鼠标在屏幕上的点
    private wheelDownPtInWord: THREE.Vector3 | null = null;         // 滚轮按下时在世界坐标系中的点
    private wheelDownProjectionMatrixInverse: THREE.Matrix4 | null = null;  // 滚轮按下时的逆投影矩阵
    private wheelDownMatrixWorld: THREE.Matrix4 | null = null;              // 滚轮按下时的相机矩阵
    private wheelDownCameraPos: THREE.Vector3 | null = null;                // 滚轮按下时相机的位置
    private wheelDownCameraDir: THREE.Vector3 | null = null;                // 滚轮接下时相机的方向

    private onResize(event: MouseEvent): void {

        const camera: THREE.OrthographicCamera = this.object as THREE.OrthographicCamera;

        const dWid: number = this.domElement.offsetWidth;
        const dHei: number = this.domElement.offsetHeight;
        const k: number = dWid / dHei;

        camera.left = -k * dHei * 0.5;
        camera.right = k * dHei * 0.5;
        camera.top = dHei * 0.5;
        camera.bottom = -dHei * 0.5;

        camera.updateProjectionMatrix();
        this.update();
    }

    private onMouseDown(event: MouseEvent): void {
        if (event.button === 1) { // 鼠标滚轮
            this.bIsWheelDown = true;
            this.bIsCtrlKey = event.ctrlKey;

            const camera: THREE.OrthographicCamera = this.object as THREE.OrthographicCamera;

            this.wheelDownPtInScreen = this.getMousePtInScreen(event.clientX, event.clientY);
            this.wheelDownPtInWord = this.wheelDownPtInScreen.clone();
            this.wheelDownPtInWord.unproject(camera);

            this.wheelDownProjectionMatrixInverse = camera.projectionMatrixInverse.clone();
            this.wheelDownMatrixWorld = camera.matrixWorld.clone();

            this.wheelDownCameraPos = camera.position.clone();
            this.wheelDownCameraDir = new THREE.Vector3();
            camera.getWorldDirection(this.wheelDownCameraDir);
            
            // if(this.planeHelperent){ this.planeHelperent.rlt = XdbPlugin.getPointByRayHit(event.clientX, event.clientY, true); } 
        }
    }

    private onMouseUp(event: MouseEvent): void {
        if (event.button === 1) { // 鼠标滚轮
            this.bIsWheelDown = false;
            // this.planeHelperent?.hidePlaneHelper();
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.bIsWheelDown) {
            const camera: THREE.OrthographicCamera = this.object as THREE.OrthographicCamera;
            if (this.bIsCtrlKey) {
                // 计算在屏幕上的移动量
                const screenPt: THREE.Vector3           = this.getMousePtInScreen(event.clientX, event.clientY);
                const vecMoveOnScreen: THREE.Vector3    = screenPt.clone().sub(this.wheelDownPtInScreen!);

                // 计算按下时与水平面的交点，作为旋转的中心点
                let rayIntersectPt: THREE.Vector3 = new THREE.Vector3();
                /* if(this.planeHelperent?.rlt){
                    rayIntersectPt = this.planeHelperent?.rlt.point.clone();
                } else */ {
                    const testRay: THREE.Ray            = new THREE.Ray(this.wheelDownPtInWord!.clone(), this.wheelDownCameraDir!.clone());
                    const horZ0Plan: THREE.Plane        = new THREE.Plane(new THREE.Vector3(0, 0 , 1), 0);
                    testRay.intersectPlane(horZ0Plan, rayIntersectPt);
                    let tmprlt: any = {rlt: {point: rayIntersectPt.clone()}};
                    // Object.assign(this.planeHelperent!,tmprlt);
                }
                // this.planeHelperent?.updataPlaneHelper();

                // 计算上下翻转的轴
                const verRotateAxisPt1: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
                const verRotateAxisPt2: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
                verRotateAxisPt1.applyMatrix4(this.wheelDownMatrixWorld!);
                verRotateAxisPt2.applyMatrix4(this.wheelDownMatrixWorld!);
                const verRotateAxis: THREE.Vector3 = verRotateAxisPt2.clone().sub(verRotateAxisPt1).setZ(0).normalize();

                // 计算旋转量
                const verRotateQuaternion: THREE.Quaternion = new THREE.Quaternion();
                const horRotateQuaternion: THREE.Quaternion = new THREE.Quaternion();
                verRotateQuaternion.setFromAxisAngle(verRotateAxis, Math.PI * vecMoveOnScreen.y);
                horRotateQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * (-vecMoveOnScreen.x));

                // 旋转相机位置和视角
                const cameraNewPos: THREE.Vector3 = this.wheelDownCameraPos!.clone();
                const cameraNewDir: THREE.Vector3 = this.wheelDownCameraDir!.clone();

                cameraNewPos.sub(rayIntersectPt);
                cameraNewPos.applyQuaternion(verRotateQuaternion);
                cameraNewPos.applyQuaternion(horRotateQuaternion);
                cameraNewPos.add(rayIntersectPt);

                cameraNewDir.applyQuaternion(verRotateQuaternion);
                cameraNewDir.applyQuaternion(horRotateQuaternion);

                const newLookAt: THREE.Vector3 = cameraNewPos.clone();
                newLookAt.add(cameraNewDir);

                camera.position.copy(cameraNewPos);
                this.target = newLookAt;

                camera.updateProjectionMatrix();
                this.update();
        
                // Fdm.xdb.redraw();
            } else {
                const screenPtInWorld: THREE.Vector3 = this.getMousePtInScreen(event.clientX, event.clientY);
                screenPtInWorld.applyMatrix4(this.wheelDownProjectionMatrixInverse!).applyMatrix4(this.wheelDownMatrixWorld!);

                const vecMove: THREE.Vector3 = screenPtInWorld.clone().sub(this.wheelDownPtInWord!);
                const ptNewPosition: THREE.Vector3 = this.wheelDownCameraPos!.clone();
                ptNewPosition.sub(vecMove);

                // 移动相机位置
                camera.position.copy(ptNewPosition);
                // 移动相机lookat点
                const cameraDir: THREE.Vector3 = new THREE.Vector3();
                camera.getWorldDirection(cameraDir);
                const newLookAt: THREE.Vector3 = camera.position.clone();
                newLookAt.add(cameraDir);
                this.target = newLookAt;

                camera.updateProjectionMatrix();
                this.update();
            }
        }
    }

    private onMouseWheel(event: WheelEvent): void {
        if (!event) {
            return;
        }
        
        event.preventDefault();
        event.stopPropagation();

        const camera: THREE.OrthographicCamera = this.object as THREE.OrthographicCamera;

        let scale: number = Math.pow(0.94, 4.0);
        if (event.deltaY < 0) {
            scale = 1 / scale;
        }
        const screenPtInWorld: THREE.Vector3 = this.getMousePtInScreen(event.clientX, event.clientY);
        screenPtInWorld.unproject(camera);

        const vecMove: THREE.Vector3 = screenPtInWorld.clone();
        vecMove.sub(camera.position).multiplyScalar((scale - 1) / scale);

        // 缩放相机
        camera.zoom *= scale;
        // 移动相机位置
        camera.position.add(vecMove);
        // 移动相机lookat点
        const cameraDir: THREE.Vector3 = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        const newLookAt: THREE.Vector3 = camera.position.clone();
        newLookAt.add(cameraDir);
        this.target = newLookAt;

        camera.updateProjectionMatrix();
        this.update();

        // Fdm.xdb.redraw();
    }

    private getMousePtInScreen(clientX: number, clientY: number): THREE.Vector3 {
        const dScreenX: number = (clientX / this.domElement.offsetWidth) * 2 - 1;
        const dScreenY: number = -(clientY / this.domElement.offsetHeight) * 2 + 1;
        const screenPt: THREE.Vector3 = new THREE.Vector3(dScreenX, dScreenY, -1);
        return screenPt;
    }
}