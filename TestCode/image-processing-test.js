/**
 * File:     image-processing-test.js
 * Author:   Remus Tumac
 * Date:     12-04-2017
 * Purpose:  Provides an example on how to use the ImageProcessor class and 
 *           detectComponents function
 */

const ImageProcessor = require('../image-processing.js');
const detectComponents = require('../connect-components.js')

ImageProcessor.grayscale('../ImageSamples/lenna.png');
ImageProcessor.blurr('../ImageSamples/lenna.png');

detectComponents('../ImageSamples/bacteria.jpg');