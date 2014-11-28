/*
 * Copyright (C) 2011, 2014 Josh A. Beam
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *   1. Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="Rasterizer.ts"/>

class DivRasterizer extends Rasterizer
{
    private container;

    private pixels = null;
    private depth = null;

    private width:number = 0;
    private height:number = 0;

    public constructor(container, pixelSize:number)
    {
        super();

        this.container = container;
        this.buildPixels(pixelSize);

        this.init();
    }

    private buildPixels(pixelSize:number):void
    {
        // remove all existing pixels
        while(this.container.hasChildNodes())
            this.container.removeChild(this.container.firstChild);

        this.pixels = [];

        // create divs representing the pixels
        this.width = Math.floor(this.container.offsetWidth / pixelSize) + 1;
        this.height = Math.floor(this.container.offsetHeight / pixelSize) + 1;
        for(var y = 0; y < this.height; ++y) {
            for(var x = 0; x < this.width; ++x) {
                var pixel = document.createElement("div");
                pixel.className = "pixel";
                pixel.style.left = (x * pixelSize) + "px";
                pixel.style.top = (y * pixelSize) + "px";
                pixel.style.width = pixelSize + "px";
                pixel.style.height = pixelSize + "px";
                this.container.appendChild(pixel);
                this.pixels.push(pixel);
            }
        }

        // create depth buffer
        this.depth = [];
        for(var i = 0; i < this.width * this.height; ++i)
            this.depth.push(1.0);
    }

    public getWidth():number
    {
        return this.width;
    }

    public getHeight():number
    {
        return this.height;
    }

    public setPixel(x:number, y:number, z:number, color:Vector4):void
    {
        x = Math.floor(x);
        y = Math.floor(y);

        // make sure the x/y coordinates are valid
        if(x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;

        // make sure the depth isn't greater than
        // the depth of the currently stored pixel
        var index = Math.floor(this.width * y + x);
        if(z > this.depth[index])
            return;

        // set the color and depth of the pixel
        this.pixels[index].style.backgroundColor = color.toColorString();
        this.depth[index] = z;
    }

    public clear():void
    {
        for(var i = 0; i < this.pixels.length; ++i) {
            this.pixels[i].style.backgroundColor = "transparent";
            this.depth[i] = 1.0;
        }
    }
}
