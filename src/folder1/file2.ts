import foo = require("fileToLazyLoad");
import require = require("require");
export class ClassB {
    public method1(): void
    {
        console.log("ClassB>method1");
        setTimeout( () => {
        require(["fileToLazyLoad"], (c: typeof foo.ClassC) => {
                c.method1();
            });
        }, 5000);
    }
}