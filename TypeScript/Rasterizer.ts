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

declare function Framebuffer(stdlib, foreign, heap):void;

class Rasterizer
{
    public static ZNEAR = 0.1;
    public static ZFAR = 2000.0;

    private littleEndian:number = 0;
    private width:number = 0;
    private height:number = 0;

    private context;
    private imageData;
    private heapSize = 0;
    private heapView;
    private framebuffer;

    private modelviewMatrix:Matrix4 = null;
    private projectionMatrix:Matrix4 = null;

    constructor(canvas, pixelSize:number)
    {
        this.buildCanvas(canvas, pixelSize);
        this.init();

        // determine the endianness to use when writing pixel data
        var buf = new ArrayBuffer(2);
        var buf8 = new Uint8Array(buf);
        var buf16 = new Uint16Array(buf);
        buf8[0] = 1;
        buf8[1] = 0;
        this.littleEndian = buf16[0] & 0xff;
    }

    private buildCanvas(canvas, pixelSize:number):void
    {
        this.width = Math.floor(canvas.offsetWidth / pixelSize) + 1;
        this.height = Math.floor(canvas.offsetHeight / pixelSize) + 1;

        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
        this.clear();
    }

    protected init():void
    {
        this.modelviewMatrix = new Matrix4();
        this.projectionMatrix = Matrix4.perspective(Math.PI / 2.0, this.width / this.height, Rasterizer.ZNEAR, Rasterizer.ZFAR);
    }

    public clear():void
    {
        this.imageData = this.context.createImageData(this.width, this.height);

        if(this.heapSize == 0) {
            this.heapSize = 1|0;
            while(this.heapSize < this.imageData.data.length + this.width * this.height * 8)
                this.heapSize = (this.heapSize * 2)|0;
        }

        var heap = new ArrayBuffer(this.heapSize);
        this.heapView = new Uint8Array(heap, 0, this.imageData.data.length);
        this.framebuffer = new Framebuffer(window, null, heap);
    }

    public flush(timeElapsed:number):void
    {
        this.imageData.data.set(this.heapView);
        this.context.putImageData(this.imageData, 0, 0);
    }

    public drawSpan(span:Span, y:number):void
    {
        if(y < 0 || y >= this.height)
            return;

        var xdiff = span.x2 - span.x1;
        if(xdiff == 0)
            return;

        this.framebuffer.drawSpan(this.littleEndian, this.width, this.height, y,
                                  span.x1, 1.0 - span.z1, span.color1.x, span.color1.y, span.color1.z, span.color1.w,
                                  span.x2, 1.0 - span.z2, span.color2.x, span.color2.y, span.color2.z, span.color2.w);
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

        // calculate factors to use for interpolation
        // with the edges and the step values to increase
        // them by after drawing each span
        var factor1 = (e2.y1 - e1.y1) / e1ydiff;
        var step1 = 1.0 / e1ydiff;
        var factor2 = 0.0;
        var step2 = 1.0 / e2ydiff;

        // loop through the lines between the edges and draw spans
        var yend = e2.y2 - 1;
        var span:Span;
        for(var y = e2.y1; y < yend; ++y) {
            // create and draw span
            span = new Span(e1.color1.lerp(e1.color2, factor1),
                            this.framebuffer.lerp(e1.x1, e1.x2, factor1),
                            this.framebuffer.lerp(e1.z1, e1.z2, factor1),
                            e2.color1.lerp(e2.color2, factor2),
                            this.framebuffer.lerp(e2.x1, e2.x2, factor2),
                            this.framebuffer.lerp(e2.z1, e2.z2, factor2));
            this.drawSpan(span, y);
            factor1 += step1;
            factor2 += step2;
        }

        span = new Span(e1.color1.lerp(e1.color2, factor1),
                        this.framebuffer.lerp(e1.x1, e1.x2, factor1),
                        this.framebuffer.lerp(e1.z1, e1.z2, factor1),
                        e2.color1.lerp(e2.color2, factor2),
                        this.framebuffer.lerp(e2.x1, e2.x2, factor2),
                        this.framebuffer.lerp(e2.z1, e2.z2, factor2));
        this.drawSpan(span, y);
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
        var m = this.projectionMatrix.multiply(this.modelviewMatrix);
        var v = m.transform(vertex);
        if(v.z < Rasterizer.ZNEAR)
            return null;

        v = v.scale(1.0 / v.w);

        var cx = (this.width / 2) | 0;
        var cy = (this.height / 2) | 0;
        return new Vector4(cx + cx * v.x, cy - cy * v.y, v.z / Rasterizer.ZFAR, v.w);
    }

    public drawTriangle3D(color1:Vector4, v1:Vector4, color2:Vector4, v2:Vector4, color3:Vector4, v3:Vector4):void
    {
        v1 = new Vector4(v1.x, v1.y, v1.z, 1.0);
        v2 = new Vector4(v2.x, v2.y, v2.z, 1.0);
        v3 = new Vector4(v3.x, v3.y, v3.z, 1.0);

        var pv1 = this.projectVertex(v1);
        var pv2 = this.projectVertex(v2);
        var pv3 = this.projectVertex(v3);

        if(pv1 == null || pv2 == null || pv3 == null)
            return;

        this.drawTriangle(color1, pv1, color2, pv2, color3, pv3);
    }

    public drawQuad3D(color1:Vector4, v1:Vector4, color2:Vector4, v2:Vector4, color3:Vector4, v3:Vector4, color4:Vector4, v4:Vector4):void
    {
        this.drawTriangle3D(color1, v1, color2, v2, color3, v3);
        this.drawTriangle3D(color3, v3, color2, v2, color4, v4);
    }

    public setModelviewMatrix(m:Matrix4):void
    {
        this.modelviewMatrix = m;
    }
}
