/**
 * IOC container
 *
 * methods: push, find, get
 *
 * @export
 * @class Injector
 */
export declare class Injector {
    /**
     * provider map: save provider with key and value
     *
     * @private
     * @type {Map<any, any>}
     * @memberof Injector
     */
    private readonly providerMap;
    /**
     * instance map: save singleton instance with key and value
     *
     * @private
     * @type {Map<any, any>}
     * @memberof Injector
     */
    private readonly instanceMap;
    /**
     * set Provider(Map) for save provide
     *
     * @param {*} key
     * @param {*} value
     * @memberof Injector
     */
    setProvider(key: any, value: any): void;
    /**
     * get Provider(Map) by key for save provide
     *
     * @param {*} key
     * @returns {*}
     * @memberof Injector
     */
    getProvider(key: any): any;
    /**
     * set instance of provider by key
     *
     * @param {*} key
     * @param {*} value
     * @memberof Injector
     */
    setInstance(key: any, value: any): void;
    /**
     * get instance of provider by key
     *
     * @param {*} key
     * @returns {*}
     * @memberof Injector
     */
    getInstance(key: any): any;
    /**
     * set value of provider by key
     *
     * @param {*} key
     * @param {*} value
     * @memberof Injector
     */
    setValue(key: any, value: any): void;
}
export declare const rootInjector: Injector;
