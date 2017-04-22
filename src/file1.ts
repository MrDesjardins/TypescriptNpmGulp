import { ClassA } from "./fileToInclude";
export function toTest() {
    const a = new ClassA();
    const x = 2;
    if (x === 2) {
        a.method1();
    }
}