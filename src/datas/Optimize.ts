
/**
 * 防抖节流
 */
export namespace Optimize {
    export function debounds(callback: (...a: any) => void, delay: number = 300) {
        let timer: any = null;
        return function (...arg: any) {
            if (timer) { clearTimeout(timer); }
            timer = setTimeout(() => callback.apply(null, arg), delay);
        }
    }

    export function thorrtle(callback: (...a: any) => void, delay: number = 300) {
        let startTime: number = 0;
        return function (...arg: any) {
            let curTime: number = new Date().getTime()
            if (delay <= (curTime - startTime)) {
                callback.apply(null, arg);
                startTime = curTime;
            }
        }
    }
}