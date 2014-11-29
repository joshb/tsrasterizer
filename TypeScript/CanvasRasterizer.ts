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

declare var asm;

class CanvasRasterizer extends Rasterizer
{
    private context;
    private imageData;
    private data;

    private pixels;
    private depth;

    private rgba;

    public constructor(container, pixelSize:number)
    {
        super();

        this.rgba = asm.isLittleEndian() ? asm.rgbaLE : asm.rgbaBE;

        this.buildCanvas(container, pixelSize);
        this.init();
    }

    private buildCanvas(container, pixelSize:number):void
    {
        // remove existing canvas
        while(container.hasChildNodes())
            container.removeChild(container.firstChild);

        this.width = Math.floor(container.offsetWidth / pixelSize) + 1;
        this.height = Math.floor(container.offsetHeight / pixelSize) + 1;

        // create the canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        container.appendChild(canvas);

        this.context = canvas.getContext("2d");
        this.clear();
    }

    public setPixel(x:number, y:number, z:number, color:Vector4):void
    {
        x |= 0;
        y |= 0;

        // make sure the x/y coordinates are valid
        if(x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;

        // make sure the depth isn't greater than
        // the depth of the currently stored pixel
        var index = this.width * y + x;
        if(this.depth[index] != null && z > this.depth[index])
            return;

        // do alpha blending
        var oldColor = this.pixels[index];
        if(color.w != 255 && oldColor != null) {
            var fa = color.w / 255.0;
            color = color.scale(fa).add(oldColor.scale(1.0 - fa));
        }

        // calculate the rgba color data
        var c = this.rgba(color.x, color.y, color.z, color.w);

        // set the color and depth of the pixel
        this.data[index] = c;
        this.pixels[index] = color;
        this.depth[index] = z;
    }

    public clear():void
    {
        this.imageData = this.context.createImageData(this.width, this.height);
        this.data = new Uint32Array(this.imageData.data.buffer);
        this.pixels = [];
        this.depth = [];
    }

    public flush():void
    {
        this.context.putImageData(this.imageData, 0, 0);
    }
}
