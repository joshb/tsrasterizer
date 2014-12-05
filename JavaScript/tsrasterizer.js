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
var Vector4 = (function () {
    function Vector4(x, y, z, w) {
        if (w === void 0) { w = 0.0; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Vector4.prototype.add = function (v) {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    };
    Vector4.prototype.subtract = function (v) {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    };
    Vector4.prototype.multiply = function (v) {
        return new Vector4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
    };
    Vector4.prototype.scale = function (f) {
        return new Vector4(this.x * f, this.y * f, this.z * f, this.w * f);
    };
    Vector4.prototype.lerp = function (end, f) {
        return this.add(end.subtract(this).scale(f));
    };
    Vector4.prototype.toString = function () {
        return this.x + "," + this.y + "," + this.z + "," + this.w;
    };
    Vector4.prototype.toColorString = function () {
        return "rgb(" + Math.floor(this.x) + "," + Math.floor(this.y) + "," + Math.floor(this.z) + ")";
    };
    return Vector4;
})();
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
/// <reference path="Vector4.ts"/>
var Edge = (function () {
    function Edge(color1, x1, y1, z1, color2, x2, y2, z2) {
        x1 = x1 | 0;
        y1 = y1 | 0;
        x2 = x2 | 0;
        y2 = y2 | 0;
        if (y1 < y2) {
            this.color1 = color1;
            this.x1 = x1;
            this.y1 = y1;
            this.z1 = z1;
            this.color2 = color2;
            this.x2 = x2;
            this.y2 = y2;
            this.z2 = z2;
        }
        else {
            this.color1 = color2;
            this.x1 = x2;
            this.y1 = y2;
            this.z1 = z2;
            this.color2 = color1;
            this.x2 = x1;
            this.y2 = y1;
            this.z2 = z1;
        }
    }
    return Edge;
})();
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
/// <reference path="Vector4.ts"/>
var Matrix4 = (function () {
    function Matrix4() {
        this._matrix = [];
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 4; ++j)
                this._matrix.push((i == j) ? 1.0 : 0.0);
        }
    }
    Matrix4.prototype.multiply = function (matrix) {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;
        var m1 = this._matrix;
        var m2 = matrix._matrix;
        m[0] = m1[0] * m2[0] + m1[1] * m2[4] + m1[2] * m2[8] + m1[3] * m2[12];
        m[1] = m1[0] * m2[1] + m1[1] * m2[5] + m1[2] * m2[9] + m1[3] * m2[13];
        m[2] = m1[0] * m2[2] + m1[1] * m2[6] + m1[2] * m2[10] + m1[3] * m2[14];
        m[3] = m1[0] * m2[3] + m1[1] * m2[7] + m1[2] * m2[11] + m1[3] * m2[15];
        m[4] = m1[4] * m2[0] + m1[5] * m2[4] + m1[6] * m2[8] + m1[7] * m2[12];
        m[5] = m1[4] * m2[1] + m1[5] * m2[5] + m1[6] * m2[9] + m1[7] * m2[13];
        m[6] = m1[4] * m2[2] + m1[5] * m2[6] + m1[6] * m2[10] + m1[7] * m2[14];
        m[7] = m1[4] * m2[3] + m1[5] * m2[7] + m1[6] * m2[11] + m1[7] * m2[15];
        m[8] = m1[8] * m2[0] + m1[9] * m2[4] + m1[10] * m2[8] + m1[11] * m2[12];
        m[9] = m1[8] * m2[1] + m1[9] * m2[5] + m1[10] * m2[9] + m1[11] * m2[13];
        m[10] = m1[8] * m2[2] + m1[9] * m2[6] + m1[10] * m2[10] + m1[11] * m2[14];
        m[11] = m1[8] * m2[3] + m1[9] * m2[7] + m1[10] * m2[11] + m1[11] * m2[15];
        m[12] = m1[12] * m2[0] + m1[13] * m2[4] + m1[14] * m2[8] + m1[15] * m2[12];
        m[13] = m1[12] * m2[1] + m1[13] * m2[5] + m1[14] * m2[9] + m1[15] * m2[13];
        m[14] = m1[12] * m2[2] + m1[13] * m2[6] + m1[14] * m2[10] + m1[15] * m2[14];
        m[15] = m1[12] * m2[3] + m1[13] * m2[7] + m1[14] * m2[11] + m1[15] * m2[15];
        return newMatrix;
    };
    Matrix4.prototype.transform = function (v) {
        var m = this._matrix;
        var x = m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3] * v.w;
        var y = m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7] * v.w;
        var z = m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11] * v.w;
        var w = m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15] * v.w;
        return new Vector4(x, y, z, w);
    };
    Matrix4.prototype.toString = function () {
        var s = "";
        for (var i = 0; i < 4; ++i) {
            if (i != 0)
                s += "\n";
            for (var j = 0; j < 4; ++j) {
                if (j != 0)
                    s += " ";
                s += this._matrix[i * 4 + j];
            }
        }
        return s;
    };
    Matrix4.perspective = function (fov, aspect, znear, zfar) {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;
        var f = 1.0 / Math.tan(fov / 2.0);
        var zdiff = znear - zfar;
        m[0] = f / aspect;
        m[5] = f;
        m[10] = (zfar + znear) / zdiff;
        m[11] = -1.0;
        m[14] = (2.0 * zfar * znear) / zdiff;
        m[15] = 0.0;
        return newMatrix;
    };
    Matrix4.yawRotation = function (angle) {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        m[0] = c;
        m[2] = s;
        m[8] = -s;
        m[10] = c;
        return newMatrix;
    };
    Matrix4.rollRotation = function (angle) {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        m[0] = c;
        m[1] = s;
        m[4] = -s;
        m[5] = c;
        return newMatrix;
    };
    Matrix4.translation = function (v) {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;
        m[3] = v.x;
        m[7] = v.y;
        m[11] = v.z;
        return newMatrix;
    };
    return Matrix4;
})();
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
/// <reference path="Vector4.ts"/>
var Span = (function () {
    function Span(color1, x1, z1, color2, x2, z2) {
        x1 = x1 | 0;
        x2 = x2 | 0;
        if (x1 < x2) {
            this.color1 = color1;
            this.x1 = x1;
            this.z1 = z1;
            this.color2 = color2;
            this.x2 = x2;
            this.z2 = z2;
        }
        else {
            this.color1 = color2;
            this.x1 = x2;
            this.z1 = z2;
            this.color2 = color1;
            this.x2 = x1;
            this.z2 = z1;
        }
    }
    return Span;
})();
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
var Rasterizer = (function () {
    function Rasterizer(canvas, pixelSize) {
        this.littleEndian = 0;
        this.width = 0;
        this.height = 0;
        this.heapSize = 0;
        this.modelviewMatrix = null;
        this.projectionMatrix = null;
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
    Rasterizer.prototype.buildCanvas = function (canvas, pixelSize) {
        this.width = Math.floor(canvas.offsetWidth / pixelSize) + 1;
        this.height = Math.floor(canvas.offsetHeight / pixelSize) + 1;
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
        this.context.fillStyle = "white";
        this.context.font = "16pt Arial";
        this.clear();
    };
    Rasterizer.prototype.init = function () {
        this.modelviewMatrix = new Matrix4();
        this.projectionMatrix = Matrix4.perspective(Math.PI / 2.0, this.width / this.height, Rasterizer.ZNEAR, Rasterizer.ZFAR);
    };
    Rasterizer.prototype.clear = function () {
        this.imageData = this.context.createImageData(this.width, this.height);
        if (this.heapSize == 0) {
            this.heapSize = 1 | 0;
            while (this.heapSize < this.imageData.data.length + this.width * this.height * 8)
                this.heapSize = (this.heapSize * 2) | 0;
        }
        var heap = new ArrayBuffer(this.heapSize);
        this.heapView = new Uint8Array(heap, 0, this.imageData.data.length);
        this.framebuffer = new Framebuffer(window, null, heap);
    };
    Rasterizer.prototype.flush = function (timeElapsed) {
        this.imageData.data.set(this.heapView);
        this.context.putImageData(this.imageData, 0, 0);
        var fps = (1.0 / timeElapsed).toFixed(1);
        this.context.fillText(fps + " fps", 10, 30);
    };
    Rasterizer.prototype.drawSpan = function (span, y) {
        if (y < 0 || y >= this.height)
            return;
        var xdiff = span.x2 - span.x1;
        if (xdiff == 0)
            return;
        this.framebuffer.drawSpan(this.littleEndian, this.width, this.height, y, span.x1, 1.0 - span.z1, span.color1.x, span.color1.y, span.color1.z, span.color1.w, span.x2, 1.0 - span.z2, span.color2.x, span.color2.y, span.color2.z, span.color2.w);
    };
    Rasterizer.prototype.drawSpansBetweenEdges = function (e1, e2) {
        // calculate difference between the y coordinates
        // of the first edge and return if 0
        var e1ydiff = e1.y2 - e1.y1;
        if (e1ydiff == 0)
            return;
        // calculate difference between the y coordinates
        // of the second edge and return if 0
        var e2ydiff = e2.y2 - e2.y1;
        if (e2ydiff == 0)
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
        var span;
        for (var y = e2.y1; y < yend; ++y) {
            // create and draw span
            span = new Span(e1.color1.lerp(e1.color2, factor1), this.framebuffer.lerp(e1.x1, e1.x2, factor1), this.framebuffer.lerp(e1.z1, e1.z2, factor1), e2.color1.lerp(e2.color2, factor2), this.framebuffer.lerp(e2.x1, e2.x2, factor2), this.framebuffer.lerp(e2.z1, e2.z2, factor2));
            this.drawSpan(span, y);
            factor1 += step1;
            factor2 += step2;
        }
        span = new Span(e1.color1.lerp(e1.color2, factor1), this.framebuffer.lerp(e1.x1, e1.x2, factor1), this.framebuffer.lerp(e1.z1, e1.z2, factor1), e2.color1.lerp(e2.color2, factor2), this.framebuffer.lerp(e2.x1, e2.x2, factor2), this.framebuffer.lerp(e2.z1, e2.z2, factor2));
        this.drawSpan(span, y);
    };
    Rasterizer.prototype.drawTriangle = function (color1, v1, color2, v2, color3, v3) {
        // creates edges for the triangle
        var edges = [
            new Edge(color1, v1.x, v1.y, v1.z, color2, v2.x, v2.y, v2.z),
            new Edge(color2, v2.x, v2.y, v2.z, color3, v3.x, v3.y, v3.z),
            new Edge(color3, v3.x, v3.y, v3.z, color1, v1.x, v1.y, v1.z)
        ];
        var maxLength = 0;
        var longEdge = 0;
        for (var i = 0; i < 3; ++i) {
            var length = edges[i].y2 - edges[i].y1;
            if (length > maxLength) {
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
    };
    Rasterizer.prototype.projectVertex = function (vertex) {
        var m = this.projectionMatrix.multiply(this.modelviewMatrix);
        var v = m.transform(vertex);
        if (v.z < Rasterizer.ZNEAR)
            return null;
        v = v.scale(1.0 / v.w);
        var cx = (this.width / 2) | 0;
        var cy = (this.height / 2) | 0;
        return new Vector4(cx + cx * v.x, cy - cy * v.y, v.z / Rasterizer.ZFAR, v.w);
    };
    Rasterizer.prototype.drawTriangle3D = function (color1, v1, color2, v2, color3, v3) {
        v1 = new Vector4(v1.x, v1.y, v1.z, 1.0);
        v2 = new Vector4(v2.x, v2.y, v2.z, 1.0);
        v3 = new Vector4(v3.x, v3.y, v3.z, 1.0);
        var pv1 = this.projectVertex(v1);
        var pv2 = this.projectVertex(v2);
        var pv3 = this.projectVertex(v3);
        if (pv1 == null || pv2 == null || pv3 == null)
            return;
        this.drawTriangle(color1, pv1, color2, pv2, color3, pv3);
    };
    Rasterizer.prototype.drawQuad3D = function (color1, v1, color2, v2, color3, v3, color4, v4) {
        this.drawTriangle3D(color1, v1, color2, v2, color3, v3);
        this.drawTriangle3D(color3, v3, color2, v2, color4, v4);
    };
    Rasterizer.prototype.setModelviewMatrix = function (m) {
        this.modelviewMatrix = m;
    };
    Rasterizer.ZNEAR = 0.1;
    Rasterizer.ZFAR = 2000.0;
    return Rasterizer;
})();
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
var Box = (function () {
    function Box(position, size, color) {
        this.position = position;
        this.size = size;
        this.color = color;
    }
    Box.prototype.render = function (rast) {
        var position = this.position;
        var size = this.size / 2;
        var color1 = this.color;
        var color2 = color1.scale(0.5);
        color2.w = color1.w;
        // front
        var v1 = new Vector4(-size, size, size);
        var v2 = new Vector4(-size, -size, size);
        var v3 = new Vector4(size, size, size);
        var v4 = new Vector4(size, -size, size);
        rast.drawQuad3D(color1, v1.add(position), color2, v2.add(position), color1, v3.add(position), color2, v4.add(position));
        // back
        v1 = new Vector4(size, size, -size);
        v2 = new Vector4(size, -size, -size);
        v3 = new Vector4(-size, size, -size);
        v4 = new Vector4(-size, -size, -size);
        rast.drawQuad3D(color1, v1.add(position), color2, v2.add(position), color1, v3.add(position), color2, v4.add(position));
        // left
        v1 = new Vector4(-size, size, -size);
        v2 = new Vector4(-size, -size, -size);
        v3 = new Vector4(-size, size, size);
        v4 = new Vector4(-size, -size, size);
        rast.drawQuad3D(color1, v1.add(position), color2, v2.add(position), color1, v3.add(position), color2, v4.add(position));
        // right
        v1 = new Vector4(size, size, size);
        v2 = new Vector4(size, -size, size);
        v3 = new Vector4(size, size, -size);
        v4 = new Vector4(size, -size, -size);
        rast.drawQuad3D(color1, v1.add(position), color2, v2.add(position), color1, v3.add(position), color2, v4.add(position));
        // top
        v1 = new Vector4(-size, size, -size);
        v2 = new Vector4(-size, size, size);
        v3 = new Vector4(size, size, -size);
        v4 = new Vector4(size, size, size);
        rast.drawQuad3D(color1, v1.add(position), color1, v2.add(position), color1, v3.add(position), color1, v4.add(position));
        // bottom
        v1 = new Vector4(-size, -size, size);
        v2 = new Vector4(-size, -size, -size);
        v3 = new Vector4(size, -size, size);
        v4 = new Vector4(size, -size, -size);
        rast.drawQuad3D(color2, v1.add(position), color2, v2.add(position), color2, v3.add(position), color2, v4.add(position));
    };
    return Box;
})();
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
/// <reference path="Box.ts"/>
/// <reference path="Rasterizer.ts"/>
var Application = (function () {
    function Application(time) {
        this.modelview = new Matrix4();
        this.x = 0.0;
        this.z = -8.0;
        this.rotation = 0.0;
        this.boxes = [];
        this.time = 0.0;
        this.keyState = [];
        this.firstCycle = true;
        this.time = time;
        this.canvas = document.getElementsByTagName("canvas")[0];
        if (!this.canvas) {
            window.alert("No canvas element found.");
            return;
        }
        this.rast = new Rasterizer(this.canvas, 4);
        this.boxes.push(new Box(new Vector4(-1, -1, -1), 1, new Vector4(255, 0, 0, 255)));
        this.boxes.push(new Box(new Vector4(-1, -1, 1), 1, new Vector4(0, 255, 0, 255)));
        this.boxes.push(new Box(new Vector4(-1, 1, -1), 1, new Vector4(0, 0, 255, 255)));
        this.boxes.push(new Box(new Vector4(-1, 1, 1), 1, new Vector4(255, 255, 255, 255)));
        this.boxes.push(new Box(new Vector4(1, -1, -1), 1, new Vector4(64, 64, 64, 255)));
        this.boxes.push(new Box(new Vector4(1, -1, 1), 1, new Vector4(255, 255, 0, 255)));
        this.boxes.push(new Box(new Vector4(1, 1, -1), 1, new Vector4(0, 255, 255, 255)));
        this.boxes.push(new Box(new Vector4(1, 1, 1), 1, new Vector4(255, 0, 255, 255)));
    }
    Application.prototype.cycle = function (time) {
        var timeElapsed = (time - this.time) / 1000.0;
        this.time = time;
        this.processKeyState(timeElapsed);
        this.rotation += Math.PI * timeElapsed / 10.0;
        var mr = Matrix4.rollRotation(this.rotation);
        var my = Matrix4.yawRotation(-this.rotation * 1.5);
        var mt = Matrix4.translation(new Vector4(this.x, 0, this.z));
        this.modelview = mt.multiply(my.multiply(mr));
        this.render(timeElapsed);
    };
    Application.prototype.processKeyState = function (timeElapsed) {
        timeElapsed *= 5.0;
        if (this.keyState[37])
            this.rotation -= Math.PI * timeElapsed / 30.0;
        if (this.keyState[38]) {
            this.z += timeElapsed;
        }
        if (this.keyState[39])
            this.rotation += Math.PI * timeElapsed / 30.0;
        if (this.keyState[40]) {
            this.z -= timeElapsed;
        }
    };
    Application.prototype.keyDown = function (e) {
        this.keyState[e.keyCode] = true;
    };
    Application.prototype.keyUp = function (e) {
        this.keyState[e.keyCode] = false;
    };
    Application.prototype.render = function (timeElapsed) {
        var _this = this;
        this.rast.clear();
        this.rast.setModelviewMatrix(this.modelview);
        this.boxes.forEach(function (box) { return box.render(_this.rast); });
        this.rast.flush(timeElapsed);
    };
    return Application;
})();
