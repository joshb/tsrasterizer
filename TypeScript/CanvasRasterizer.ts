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

class CanvasRasterizer extends Rasterizer
{
    private container;
    private canvas;
    private context;

    private depth = [];

    private width:number = 0;
    private height:number = 0;
    private pixelSize:number = 0;
    private scaled:boolean = false;

    public constructor(container, pixelSize:number, scaled:boolean)
    {
        super();

        this.container = container;
        this.buildCanvas(pixelSize, scaled);

        this.init();
    }

    private buildCanvas(pixelSize:number, scaled:boolean):void
    {
        // remove existing canvas
        while(this.container.hasChildNodes())
            this.container.removeChild(this.container.firstChild);

        this.width = Math.floor(this.container.offsetWidth / pixelSize) + 1;
        this.height = Math.floor(this.container.offsetHeight / pixelSize) + 1;
        this.pixelSize = Math.floor(pixelSize);
        this.scaled = scaled;

        // create the canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = scaled ? this.width : this.container.offsetWidth;
        this.canvas.height = scaled ? this.height : this.container.offsetHeight;
        this.canvas.style.left = "0px";
        this.canvas.style.top = "0px";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.container.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
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
        if(index < this.depth.length && z > this.depth[index])
            return;

        // set the color and depth of the pixel
        this.context.fillStyle = color.toColorString();
        if(this.scaled)
            this.context.fillRect(x, y, 1, 1);
        else
            this.context.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
        this.depth[index] = z;
    }

    public clear():void
    {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.depth = [];
    }
}
