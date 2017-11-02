/// <reference types="selenium-webdriver" />
/// <reference types="q" />
/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as q from 'q';
import { WebDriver } from 'selenium-webdriver';
import { Config } from '../config';
export declare abstract class DriverProvider {
    drivers_: WebDriver[];
    config_: Config;
    private bpRunner;
    constructor(config: Config);
    /**
     * Get all existing drivers.
     *
     * @public
     * @return array of webdriver instances
     */
    getExistingDrivers(): WebDriver[];
    getBPUrl(): string;
    /**
     * Create a new driver.
     *
     * @public
     * @return webdriver instance
     */
    getNewDriver(): WebDriver;
    /**
     * Quit a driver.
     *
     * @public
     * @param webdriver instance
     */
    quitDriver(driver: WebDriver): q.Promise<WebDriver>;
    /**
     * Default update job method.
     * @return a promise
     */
    updateJob(update: any): q.Promise<any>;
    /**
     * Default setup environment method, common to all driver providers.
     */
    setupEnv(): q.Promise<any>;
    /**
     * Set up environment specific to a particular driver provider. Overridden
     * by each driver provider.
     */
    protected abstract setupDriverEnv(): q.Promise<any>;
    /**
     * Teardown and destroy the environment and do any associated cleanup.
     * Shuts down the drivers.
     *
     * @public
     * @return {q.promise} A promise which will resolve when the environment
     *     is down.
     */
    teardownEnv(): q.Promise<q.Promise<WebDriver>[]>;
}
