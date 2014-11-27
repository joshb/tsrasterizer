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

/// <reference path="Edge.ts"/>
/// <reference path="Matrix4.ts"/>
/// <reference path="Vector4.ts"/>
/// <reference path="Span.ts"/>

class Rasterizer
{
    public static ZNEAR = 0.1;
    public static ZFAR = 2000.0;

    private _container;

    private _width = 0;
    private _height = 0;
    private _centerX = 0;
    private _centerY = 0;

    private _pixels = null;
    private _depth = null;

    private _modelviewMatrix:Matrix4 = null;
    private _projectionMatrix:Matrix4 = null;

    public constructor(container)
    {
        this._container = container;
        this.buildPixels();

        this._modelviewMatrix = new Matrix4();
        this._projectionMatrix = Matrix4.perspective(Math.PI / 2.0, this._width / this._height, Rasterizer.ZNEAR, Rasterizer.ZFAR);
    }

    private buildPixels():void
    {
        // remove all existing pixels
        while(this._container.hasChildNodes())
            this._container.removeChild(this._container.firstChild);

        this._pixels = [];

        // create first pixel
        var pixel = document.createElement("div");
        pixel.className = "pixel";
        pixel.style.left = "0px";
        pixel.style.top = "0px";
        this._container.appendChild(pixel);
        this._pixels.push(pixel);

        var pixelWidth = pixel.offsetWidth;
        var pixelHeight = pixel.offsetHeight;

        // create the rest of the pixels
        var framebufferWidth = this._container.offsetWidth;
        var framebufferHeight = this._container.offsetHeight;
        this._width = Math.floor(framebufferWidth / pixelWidth) + 1;
        this._height = Math.floor(framebufferHeight / pixelHeight) + 1;
        this._centerX = this._width / 2;
        this._centerY = this._height / 2;
        for(var y = 0; y < this._height; ++y) {
            for(var x = ((y == 0) ? 1 : 0); x < this._width; ++x) {
                pixel = document.createElement("div");
                pixel.className = "pixel";
                pixel.style.left = (x * pixelWidth) + "px";
                pixel.style.top = (y * pixelHeight) + "px";
                this._container.appendChild(pixel);
                this._pixels.push(pixel);
            }
        }

        // create depth buffer
        this._depth = [];
        for(var i = 0; i < this._width * this._height; ++i)
            this._depth.push(1.0);
    }

    public setPixel(x:number, y:number, z:number, color:Vector4):void
    {
        // make sure the x/y coordinates are valid
        if(x < 0 || x >= this._width || y < 0 || y >= this._height)
            return;

        // make sure the depth isn't greater than
        // the depth of the currently stored pixel
        var index = Math.floor(this._width * Math.floor(y) + Math.floor(x));
        if(z > this._depth[index])
            return;

        // set the color and depth of the pixel
        this._pixels[index].style.backgroundColor = color.toColorString();
        this._depth[index] = z;
    }

    public drawSpan(span:Span, y:number):void
    {
        var xdiff = span.x2 - span.x1;
        if(xdiff == 0)
            return;

        var colordiff = span.color2.subtract(span.color1);
        var zdiff = span.z2 - span.z1;

        var factor = 0.0;
        var factorStep = 1.0 / xdiff;

        // draw each pixel in the span
        for(var x = span.x1; x < span.x2; ++x) {
            this.setPixel(x, y, span.z1 + zdiff * factor, span.color1.add(colordiff.scale(factor)));
            factor += factorStep;
        }
    }

    public drawSpansBetweenEdges(e1:Edge, e2:Edge):void
    {
        // calculate difference between the y coordinates
        // of the first edge and return if 0
        var e1ydiff = e1.y2 - e1.y1;
        if(e1ydiff == 0)
            return;

        // calculate difference between the y coordinates
        // of the second edge and return if 0
        var e2ydiff = e2.y2 - e2.y1;
        if(e2ydiff == 0)
            return;

        // calculate differences between the x/z coordinates
        // and colors of the points of the edges
        var e1xdiff = e1.x2 - e1.x1;
        var e2xdiff = e2.x2 - e2.x1;
        var e1zdiff = e1.z2 - e1.z1;
        var e2zdiff = e2.z2 - e2.z1;
        var e1colordiff = e1.color2.subtract(e1.color1);
        var e2colordiff = e2.color2.subtract(e2.color1);

        // calculate factors to use for interpolation
        // with the edges and the step values to increase
        // them by after drawing each span
        var factor1 = (e2.y1 - e1.y1) / e1ydiff;
        var factorStep1 = 1.0 / e1ydiff;
        var factor2 = 0.0;
        var factorStep2 = 1.0 / e2ydiff;

        // loop through the lines between the edges and draw spans
        for(var y = e2.y1; y < e2.y2; ++y) {
            // create and draw span
            var span = new Span(e1.color1.add(e1colordiff.scale(factor1)),
                                e1.x1 + (e1xdiff * factor1),
                                e1.z1 + (e1zdiff * factor1),
                                e2.color1.add(e2colordiff.scale(factor2)),
                                e2.x1 + (e2xdiff * factor2),
                                e2.z1 + (e2zdiff * factor2));
            this.drawSpan(span, y);

            // increase factors
            factor1 += factorStep1;
            factor2 += factorStep2;
        }
    }

    public drawTriangle(color1:Vector4, v1:Vector4, color2:Vector4, v2:Vector4, color3:Vector4, v3:Vector4):void
    {
        // creates edges for the triangle
        var edges = [
            new Edge(color1, v1.x, v1.y, v1.z, color2, v2.x, v2.y, v2.z),
            new Edge(color2, v2.x, v2.y, v2.z, color3, v3.x, v3.y, v3.z),
            new Edge(color3, v3.x, v3.y, v3.z, color1, v1.x, v1.y, v1.z)
        ];

        var maxLength = 0;
        var longEdge = 0;

        // find edge with the greatest length in the y axis
        for(var i = 0; i < 3; ++i) {
            var length = edges[i].y2 - edges[i].y1;
            if(length > maxLength) {
                maxLength = length;
                longEdge = i;
            }
        }

        var shortEdge1 = (longEdge + 1) % 3;
        var shortEdge2 = (longEdge + 2) % 3;

        // draw spans between edges; the long edge can be drawn
        // with the shorter edges to draw the full triangle
        this.drawSpansBetweenEdges(edges[longEdge], edges[shortEdge1]);
        this.drawSpansBetweenEdges(edges[longEdge], edges[shortEdge2]);
    }

    public projectVertex(vertex:Vector4):Vector4
    {
        var v = this._modelviewMatrix.transform(vertex);
        v = this._projectionMatrix.transform(v);
        if(v.z < Rasterizer.ZNEAR)
            return null;

        v = v.scale(1.0 / v.w);

        var cx = this._centerX;
        var cy = this._centerY;
        return new Vector4(cx + cx * v.x, cy - cy * v.y, v.z / Rasterizer.ZFAR, v.w);
    }

    public drawTriangle3D(color1:Vector4, v1:Vector4, color2:Vector4, v2:Vector4, color3:Vector4, v3:Vector4):void
    {
        v1 = this.projectVertex(new Vector4(v1.x, v1.y, v1.z, 1.0));
        v2 = this.projectVertex(new Vector4(v2.x, v2.y, v2.z, 1.0));
        v3 = this.projectVertex(new Vector4(v3.x, v3.y, v3.z, 1.0));

        if(v1 == null || v2 == null || v3 == null)
            return;

        this.drawTriangle(color1, v1, color2, v2, color3, v3);
    }

    public drawQuad3D(color1:Vector4, v1:Vector4, color2:Vector4, v2:Vector4, color3:Vector4, v3:Vector4, color4:Vector4, v4:Vector4):void
    {
        this.drawTriangle3D(color1, v1, color2, v2, color3, v3);
        this.drawTriangle3D(color3, v3, color2, v2, color4, v4);
    }

    public drawLine(color1:Vector4, x1:number, y1:number, color2:Vector4, x2:number, y2:number)
    {
        var xdiff = x2 - x1;
        var ydiff = y2 - y1;

        if(xdiff == 0 && ydiff == 0) {
            this.setPixel(x1, y1, 0.0, color1);
            return;
        }

        if(Math.abs(xdiff) > Math.abs(ydiff)) {
            var xmin, xmax;

            // set xmin to the lower x value given
            // and xmax to the higher value
            if(x1 < x2) {
                xmin = x1;
                xmax = x2;
            } else {
                xmin = x2;
                xmax = x1;
            }

            // draw line in terms of y slope
            var slope = ydiff / xdiff;
            for(var x:number = xmin; x <= xmax; ++x) {
                var y = y1 + ((x - x1) * slope);
                var color = color1.add(color2.subtract(color1).scale((x - x1) / xdiff));
                this.setPixel(x, y, 0.0, color);
            }
        } else {
            var ymin, ymax;

            // set ymin to the lower y value given
            // and ymax to the higher value
            if(y1 < y2) {
                ymin = y1;
                ymax = y2;
            } else {
                ymin = y2;
                ymax = y1;
            }

            // draw line in terms of x slope
            var slope = xdiff / ydiff;
            for(var y:number = ymin; y <= ymax; ++y) {
                var x = x1 + ((y - y1) * slope);
                var color = color1.add(color2.subtract(color1).scale((y - y1) / ydiff));
                this.setPixel(x, y, 0.0, color);
            }
        }
    }

    public getWidth():number
    {
        return this._width;
    }

    public getHeight():number
    {
        return this._height;
    }

    public clear():void
    {
        for(var i = 0; i < this._pixels.length; ++i) {
            this._pixels[i].style.backgroundColor = "transparent";
            this._depth[i] = 1.0;
        }
    }

    public setModelviewMatrix(m:Matrix4):void
    {
        this._modelviewMatrix = m;
    }
}
