'use strict';

/**
 * File:     image-processing.js
 * Author:   Remus Tumac
 * Date:     12-04-2017
 * Purpose:  The ImageProcessor class provides basic manipulation functions for
 *           images
 */

const Jimp = require("jimp");

/**
 * Helper function ensures that RGB values are capped between 0 and 255
 * @param rgbVal 
 */
function normalizeRGB(rgbVal) {
    if(rgbVal < 0)
        return 0;
    
    if(rgbVal > 255)
        return 255;

    return rgbVal;
}

class ImageProcessor {
    /**
     * Transforms a picture from color to grayscale
     * @param fileName the name of the file representing an image
     */
    static async grayscale(fileName) {
        const image = await Jimp.read(fileName);

        //iterate through all the pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height,
            function (x, y, idx) {
                let red   = this.bitmap.data[idx + 0];
                let green = this.bitmap.data[idx + 1];
                let blue  = this.bitmap.data[idx + 2];

                let gray = (Math.max(red, green, blue)
                            + Math.min(red, green, blue)) / 2;

                //set current pixel rgb values to gray
                this.bitmap.data[idx + 0] = gray;
                this.bitmap.data[idx + 1] = gray;
                this.bitmap.data[idx + 2] = gray;
            });
    
        fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        await image.write(fileName + '-grayscale.jpg');
    }

    /**
     * Applies a simple blurr to an image 
     * @param fileName the name of the file representing an image
     */
    static async blurr(fileName) {
        const image = await Jimp.read(fileName);

        //iterate through all the pixels        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height,
            function (x, y, idx) {
                let redBlurr   = 0;
                let greenBlurr = 0;
                let blueBlurr  = 0;

                //iterate surrounding pixels inside a 4 x 4 pixels box and
                //compute blurr rpg value
                for (let kernelX = -2; kernelX < 2; kernelX++) {
                    for (let kernelY = -2; kernelY < 2; kernelY++) {                        
                        let rgb = Jimp.intToRGBA(
                            image.getPixelColor(x + kernelX, y + kernelY));

                        redBlurr   += rgb['r'];
                        greenBlurr += rgb['g'];
                        blueBlurr  += rgb['b'];                        
                    }
                }

                this.bitmap.data[idx + 0] = redBlurr / 16;
                this.bitmap.data[idx + 1] = greenBlurr / 16;
                this.bitmap.data[idx + 2] = blueBlurr / 16;
            });

        fileName = fileName.substring(0, fileName.lastIndexOf('.'));    
        await image.write(fileName + '-blurr.jpg');
    }

    /**
     * Sharpens the details of an image
     * @param fileName the name of the file representing an image
     */
    static async sharpen(fileName) {
        const image = await Jimp.read(fileName);

        //iterate through all the pixels        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height,
            function (x, y, idx) {
                let redSharp   = 0;
                let greenSharp = 0;
                let blueSharp  = 0;

                //iterate surrounding pixels inside a 2 x 2 pixels box and
                //compute sharpen rpg value
                for (let kernelX = -1; kernelX < 1; kernelX++) {
                    for (let kernelY = -1; kernelY < 1; kernelY++) {                        
                        let rgb = Jimp.intToRGBA(
                            image.getPixelColor(x + kernelX, y + kernelY));

                        //the pixel in ceneter has a heavier weight
                        if(kernelX == 0 && kernelY == 0) {
                            redSharp   += rgb['r'] * 6;
                            greenSharp += rgb['g'] * 6;
                            blueSharp  += rgb['b'] * 6;
                        }
                        else {
                            redSharp   -= rgb['r'];
                            greenSharp -= rgb['g'];
                            blueSharp  -= rgb['b']; 
                        }                       
                    }
                }

                this.bitmap.data[idx + 0] = normalizeRGB(redSharp);
                this.bitmap.data[idx + 1] = normalizeRGB(greenSharp);
                this.bitmap.data[idx + 2] = normalizeRGB(blueSharp);
            });  

        fileName = fileName.substring(0, fileName.lastIndexOf('.'));       
        await image.write(fileName + '-sharpen.jpg');
    }

}

module.exports = ImageProcessor;