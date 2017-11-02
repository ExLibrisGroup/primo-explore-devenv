'use strict';

const fs = require('fs-extra');
const path = require('path');
const resemble = require('../../lib/resemble.js');

describe('node-resemble.js', () => {
    const peopleImage = path.resolve(__dirname, './example/People.png');
    const peopleBlackWhiteImage = path.resolve(__dirname, './example/PeopleBW.png');
    const peopleTwoImage = path.resolve(__dirname, './example/People2.png');
    const largeImage = path.resolve(__dirname, './example/LargeImage.png');
    const smallImage = path.resolve(__dirname, './example/SmallImage.png');
    const withAntiAliasing = path.resolve(__dirname, './example/withAntiAliasing.png');
    const withoutAntiAliasing = path.resolve(__dirname, './example/withoutAntiAliasing.png');

    describe('compareTo', () => {
        describe('defaults', () => {
            it('should successful compare 2 identical images with each other', done => {
                resemble(peopleImage, peopleImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });

            it('should successful compare 2 identical not equally sized images with each other', done => {
                resemble(smallImage, largeImage)
                    .onComplete(data => {
                        expect(data.isSameDimensions).toEqual(false);
                        expect(data.dimensionDifference).toEqual({width: -201, height: -201});
                        expect(data.misMatchPercentage).toEqual('0.00');
                        expect(data.diffBounds).toEqual({top: 1201, left: 1201, bottom: 0, right: 0});
                        done();
                    });
            });

            it('should fail comparing 2 non identical images with each other', done => {
                resemble(peopleImage, peopleTwoImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('8.66');
                        done();
                    });
            });
        });

        describe('ignoreColors', () => {
            it('should fail comparing 2 non identical images with each other without ignoreColors enabled', done => {
                resemble(peopleImage, peopleBlackWhiteImage, {ignoreColors: false})
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('23.57');
                        done();
                    });
            });

            it('should succeed comparing 2 non identical images with each other with ignoreColors enabled', done => {
                resemble(peopleImage, peopleBlackWhiteImage, {ignoreColors: true})
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });
        });

        describe('ignoreAntialiasing', () => {
            it('should fail comparing 2 non identical images with each other without ignoreAntialiasing enabled', done => {
                resemble(withAntiAliasing, withoutAntiAliasing, {ignoreAntialiasing: false})
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.58');
                        done();
                    });
            });

            it('should succeed comparing 2 non identical images with each other with ignoreAntialiasing enabled', done => {
                resemble(withAntiAliasing, withoutAntiAliasing, {ignoreAntialiasing: true})
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });
        });

        describe('ignoreRectangles', () => {
            it('should fail comparing 2 non identical images with each other without ignoreRectangles enabled', done => {
                resemble(peopleImage, peopleTwoImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('8.66');
                        done();
                    });
            });

            it('should fail comparing 2 non identical images with each other with an empty ignoreRectangles object', done => {
                resemble(peopleImage, peopleTwoImage, {ignoreRectangles: []})
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('8.66');
                        done();
                    });
            });

            it('should fail comparing 2 non identical images with each other with ignoreRectangles enabled', done => {
                resemble(peopleImage, peopleTwoImage, {
                    ignoreAntialiasing: true,
                    ignoreColors: true,
                    ignoreRectangles: [
                        {
                            x: 15,
                            y: 15,
                            height: 200,
                            width: 460
                        }, {
                            x: 0,
                            y: 200,
                            height: 300,
                            width: 460
                        }
                    ]
                })
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });
        });
    });

    describe('outputSettings', () => {
        it('should save a difference when 2 non identical images fail comparing', done => {
            resemble(peopleImage, peopleTwoImage)
                .onComplete(data => {
                    const filePath = path.resolve(process.cwd(), '.tmp/diff.png');
                    fs.ensureDirSync(filePath);

                    expect(data.misMatchPercentage).toEqual('8.66');

                    data.getDiffImage().pack().pipe(fs.createWriteStream(filePath));
                    expect(fs.existsSync(filePath)).toBe(true);
                    done();
                });
        });
    });
});
