import "es6-promise/auto";

export function runAsync(fn) {
    return async (done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done.fail(err);
        }
    };
};
