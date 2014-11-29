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
        x1 |= 0;
        y1 |= 0;
        x2 |= 0;
        y2 |= 0;
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
        x1 |= 0;
        x2 |= 0;
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
    function Rasterizer() {
        this.width = 0;
        this.height = 0;
        this._modelviewMatrix = null;
        this._projectionMatrix = null;
    }
    Rasterizer.prototype.init = function () {
        this._modelviewMatrix = new Matrix4();
        this._projectionMatrix = Matrix4.perspective(Math.PI / 2.0, this.width / this.height, Rasterizer.ZNEAR, Rasterizer.ZFAR);
    };
    Rasterizer.prototype.setPixel = function (x, y, z, color) {
        // do nothing - this should be implemented by subclasses
    };
    Rasterizer.prototype.clear = function () {
        // do nothing - this should be implemented by subclasses
    };
    Rasterizer.prototype.flush = function () {
        // do nothing - this should be implemented by subclasses
    };
    Rasterizer.prototype.drawSpan = function (span, y) {
        if (y < 0 || y >= this.height)
            return;
        var xdiff = span.x2 - span.x1;
        if (xdiff == 0)
            return;
        var colordiff = span.color2.subtract(span.color1);
        var zdiff = span.z2 - span.z1;
        var factor = 0.0;
        var factorStep = 1.0 / xdiff;
        for (var x = span.x1; x < span.x2; ++x) {
            this.setPixel(x, y, span.z1 + zdiff * factor, span.color1.add(colordiff.scale(factor)));
            factor += factorStep;
        }
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
        for (var y = e2.y1; y < e2.y2; ++y) {
            // create and draw span
            var span = new Span(e1.color1.add(e1colordiff.scale(factor1)), e1.x1 + (e1xdiff * factor1), e1.z1 + (e1zdiff * factor1), e2.color1.add(e2colordiff.scale(factor2)), e2.x1 + (e2xdiff * factor2), e2.z1 + (e2zdiff * factor2));
            this.drawSpan(span, y);
            // increase factors
            factor1 += factorStep1;
            factor2 += factorStep2;
        }
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
        var m = this._projectionMatrix.multiply(this._modelviewMatrix);
        var v = m.transform(vertex);
        if (v.z < Rasterizer.ZNEAR)
            return null;
        v = v.scale(1.0 / v.w);
        var cx = (this.width / 2) | 0;
        var cy = (this.height / 2) | 0;
        return new Vector4(cx + cx * v.x, cy - cy * v.y, v.z / Rasterizer.ZFAR, v.w);
    };
    Rasterizer.prototype.drawTriangle3D = function (color1, v1, color2, v2, color3, v3) {
        v1 = this.projectVertex(new Vector4(v1.x, v1.y, v1.z, 1.0));
        v2 = this.projectVertex(new Vector4(v2.x, v2.y, v2.z, 1.0));
        v3 = this.projectVertex(new Vector4(v3.x, v3.y, v3.z, 1.0));
        if (v1 == null || v2 == null || v3 == null)
            return;
        this.drawTriangle(color1, v1, color2, v2, color3, v3);
    };
    Rasterizer.prototype.drawQuad3D = function (color1, v1, color2, v2, color3, v3, color4, v4) {
        this.drawTriangle3D(color1, v1, color2, v2, color3, v3);
        this.drawTriangle3D(color3, v3, color2, v2, color4, v4);
    };
    Rasterizer.prototype.drawLine = function (color1, x1, y1, color2, x2, y2) {
        var xdiff = x2 - x1;
        var ydiff = y2 - y1;
        if (xdiff == 0 && ydiff == 0) {
            this.setPixel(x1, y1, 0.0, color1);
            return;
        }
        if (Math.abs(xdiff) > Math.abs(ydiff)) {
            var xmin, xmax;
            // set xmin to the lower x value given
            // and xmax to the higher value
            if (x1 < x2) {
                xmin = x1;
                xmax = x2;
            }
            else {
                xmin = x2;
                xmax = x1;
            }
            // draw line in terms of y slope
            var slope = ydiff / xdiff;
            for (var x = xmin; x <= xmax; ++x) {
                var y = y1 + ((x - x1) * slope);
                var color = color1.add(color2.subtract(color1).scale((x - x1) / xdiff));
                this.setPixel(x, y, 0.0, color);
            }
        }
        else {
            var ymin, ymax;
            // set ymin to the lower y value given
            // and ymax to the higher value
            if (y1 < y2) {
                ymin = y1;
                ymax = y2;
            }
            else {
                ymin = y2;
                ymax = y1;
            }
            // draw line in terms of x slope
            var slope = xdiff / ydiff;
            for (var y = ymin; y <= ymax; ++y) {
                var x = x1 + ((y - y1) * slope);
                var color = color1.add(color2.subtract(color1).scale((y - y1) / ydiff));
                this.setPixel(x, y, 0.0, color);
            }
        }
    };
    Rasterizer.prototype.setModelviewMatrix = function (m) {
        this._modelviewMatrix = m;
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
        var color2 = color1.scale(0.75);
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="Rasterizer.ts"/>
var CanvasRasterizer = (function (_super) {
    __extends(CanvasRasterizer, _super);
    function CanvasRasterizer(container, pixelSize) {
        _super.call(this);
        this.depth = [];
        this.buildCanvas(container, pixelSize);
        this.init();
    }
    CanvasRasterizer.prototype.buildCanvas = function (container, pixelSize) {
        while (container.hasChildNodes())
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
    };
    CanvasRasterizer.prototype.setPixel = function (x, y, z, color) {
        x |= 0;
        y |= 0;
        // make sure the x/y coordinates are valid
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;
        // make sure the depth isn't greater than
        // the depth of the currently stored pixel
        var index = this.width * y + x;
        if (index < this.depth.length && z > this.depth[index])
            return;
        // set the color and depth of the pixel
        var r = color.x & 0xff;
        var g = color.y & 0xff;
        var b = color.z & 0xff;
        var a = color.w & 0xff;
        this.data[index] = (a << 24) | (b << 16) | (g << 8) | r;
        this.depth[index] = z;
    };
    CanvasRasterizer.prototype.clear = function () {
        this.imageData = this.context.createImageData(this.width, this.height);
        this.data = new Uint32Array(this.imageData.data.buffer);
        this.depth = [];
    };
    CanvasRasterizer.prototype.flush = function () {
        this.context.putImageData(this.imageData, 0, 0);
    };
    return CanvasRasterizer;
})(Rasterizer);
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
var DivRasterizer = (function (_super) {
    __extends(DivRasterizer, _super);
    function DivRasterizer(container, pixelSize) {
        _super.call(this);
        this.pixels = [];
        this.depth = [];
        this.container = container;
        this.buildPixels(pixelSize);
        this.init();
    }
    DivRasterizer.prototype.buildPixels = function (pixelSize) {
        while (this.container.hasChildNodes())
            this.container.removeChild(this.container.firstChild);
        // create divs representing the pixels
        this.width = Math.floor(this.container.offsetWidth / pixelSize) + 1;
        this.height = Math.floor(this.container.offsetHeight / pixelSize) + 1;
        for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
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
    };
    DivRasterizer.prototype.setPixel = function (x, y, z, color) {
        x = Math.floor(x);
        y = Math.floor(y);
        // make sure the x/y coordinates are valid
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;
        // make sure the depth isn't greater than
        // the depth of the currently stored pixel
        var index = Math.floor(this.width * y + x);
        if (index < this.depth.length && z > this.depth[index])
            return;
        // set the color and depth of the pixel
        this.pixels[index].style.backgroundColor = color.toColorString();
        this.depth[index] = z;
    };
    DivRasterizer.prototype.clear = function () {
        for (var i = 0; i < this.pixels.length; ++i)
            this.pixels[i].style.backgroundColor = "transparent";
        this.depth = [];
    };
    return DivRasterizer;
})(Rasterizer);
