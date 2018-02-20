'use strict';

/**
 * File:     connect-components.js
 * Author:   Remus Tumac
 * Date:     12-04-2017
 * Purpose:  Provides function that takes an image, splits it in components,
 *           and colors every component with a random color.
 */

const Jimp = require("jimp");
const ImageProcessor = require("./image-processing.js");

/**
 * Detects components in an image and colors them with a random color
 * @param fileName the name of the file representing an image
 */
async function detectComponents(fileName) {
    const image = await Jimp.read(fileName);
    const width  = image.bitmap.width;
    const height = image.bitmap.height;

    let redThreshold   = 0;
    let greenThreshold = 0;
    let blueThreshold  = 0;

    //calculate threshold for distinguishing components
    image.scan(0, 0, width, height, function (x, y, idx) {
        redThreshold   += this.bitmap.data[ idx + 0 ];
        greenThreshold += this.bitmap.data[ idx + 1 ];
        blueThreshold  += this.bitmap.data[ idx + 2 ];
    });

    redThreshold   /= width * height;
    greenThreshold /= width * height;
    blueThreshold  /= width * height;

    //use computed threshold to create an image containing just black and white
    image.scan(0, 0, width, height, function (x, y, idx) {
        if(this.bitmap.data[ idx + 0 ] < redThreshold 
            && this.bitmap.data[ idx + 1 ] < greenThreshold
            && this.bitmap.data[ idx + 2 ] < blueThreshold ) {
            
            this.bitmap.data[ idx + 0 ] = 255;
            this.bitmap.data[ idx + 1 ] = 255;
            this.bitmap.data[ idx + 2 ] = 255;
        }
        else {
            this.bitmap.data[ idx + 0 ] = 0;
            this.bitmap.data[ idx + 1 ] = 0;
            this.bitmap.data[ idx + 2 ] = 0;
        }
    });

    fileName = fileName.substring(0, fileName.lastIndexOf('.'));       
    await image.write(fileName + '-components-blackwhite.jpg');

    //color each component with a random color
    image.scan(0, 0, width, height, function (x, y, idx) {
        if(image.bitmap.data[idx] == 255) {
            let red   = parseInt(Math.random() * 254 + 1);
            let green = parseInt(Math.random() * 254 + 1);
            let blue  = parseInt(Math.random() * 254 + 1);
            let hex = Jimp.rgbaToInt(red, green, blue, 1);

            color(image, x, y, hex);            
        }
    });
        
    await image.write(fileName + '-components-color.jpg');
}


/**
 * Helper function that colors an entire component of a picture
 * @param image the image being edited
 * @param x the x coordinate of a pixel inside the component being colored
 * @param y the y coordinate of a pixel inside the component being colored
 * @param hex 
 */
function color(image, x, y, hex) {
    const stack = [];
    stack.push([x, y]);
    let size = 1;

    //performs a depth first search to find all the pixels that are part of
    //the component that is being colored
    while(size > 0) {
        const x = stack[size - 1][0];
        const y = stack[size - 1][1];
        stack.pop();
        size--;

        let rgb = Jimp.intToRGBA(image.getPixelColor(x, y));
        if(rgb['r'] == 255) {
            image.setPixelColor(hex, x, y);
            stack.push([x - 1, y    ]);
            stack.push([x + 1, y    ]);
            stack.push([x    , y - 1]);
            stack.push([x    , y + 1]);
            size += 4;
        }
    }
}

module.exports = detectComponents;