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

class Matrix4
{
    private _matrix:number[];

    public constructor()
    {
        this._matrix = [];
        for(var i = 0; i < 4; ++i) {
            for(var j = 0; j < 4; ++j)
                this._matrix.push((i == j) ? 1.0 : 0.0);
        }
    }

    public multiply(matrix:Matrix4):Matrix4
    {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;
        var m1 = this._matrix;
        var m2 = matrix._matrix;

        m[ 0] = m1[ 0]*m2[ 0] + m1[ 1]*m2[ 4] + m1[ 2]*m2[ 8] + m1[ 3]*m2[12];
        m[ 1] = m1[ 0]*m2[ 1] + m1[ 1]*m2[ 5] + m1[ 2]*m2[ 9] + m1[ 3]*m2[13];
        m[ 2] = m1[ 0]*m2[ 2] + m1[ 1]*m2[ 6] + m1[ 2]*m2[10] + m1[ 3]*m2[14];
        m[ 3] = m1[ 0]*m2[ 3] + m1[ 1]*m2[ 7] + m1[ 2]*m2[11] + m1[ 3]*m2[15];
        m[ 4] = m1[ 4]*m2[ 0] + m1[ 5]*m2[ 4] + m1[ 6]*m2[ 8] + m1[ 7]*m2[12];
        m[ 5] = m1[ 4]*m2[ 1] + m1[ 5]*m2[ 5] + m1[ 6]*m2[ 9] + m1[ 7]*m2[13];
        m[ 6] = m1[ 4]*m2[ 2] + m1[ 5]*m2[ 6] + m1[ 6]*m2[10] + m1[ 7]*m2[14];
        m[ 7] = m1[ 4]*m2[ 3] + m1[ 5]*m2[ 7] + m1[ 6]*m2[11] + m1[ 7]*m2[15];
        m[ 8] = m1[ 8]*m2[ 0] + m1[ 9]*m2[ 4] + m1[10]*m2[ 8] + m1[11]*m2[12];
        m[ 9] = m1[ 8]*m2[ 1] + m1[ 9]*m2[ 5] + m1[10]*m2[ 9] + m1[11]*m2[13];
        m[10] = m1[ 8]*m2[ 2] + m1[ 9]*m2[ 6] + m1[10]*m2[10] + m1[11]*m2[14];
        m[11] = m1[ 8]*m2[ 3] + m1[ 9]*m2[ 7] + m1[10]*m2[11] + m1[11]*m2[15];
        m[12] = m1[12]*m2[ 0] + m1[13]*m2[ 4] + m1[14]*m2[ 8] + m1[15]*m2[12];
        m[13] = m1[12]*m2[ 1] + m1[13]*m2[ 5] + m1[14]*m2[ 9] + m1[15]*m2[13];
        m[14] = m1[12]*m2[ 2] + m1[13]*m2[ 6] + m1[14]*m2[10] + m1[15]*m2[14];
        m[15] = m1[12]*m2[ 3] + m1[13]*m2[ 7] + m1[14]*m2[11] + m1[15]*m2[15];

        return newMatrix;
    }

    public transform(v:Vector4):Vector4
    {
        var m = this._matrix;

        var x = m[ 0] * v.x + m[ 1] * v.y + m[ 2] * v.z + m[ 3] * v.w;
        var y = m[ 4] * v.x + m[ 5] * v.y + m[ 6] * v.z + m[ 7] * v.w;
        var z = m[ 8] * v.x + m[ 9] * v.y + m[10] * v.z + m[11] * v.w;
        var w = m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15] * v.w;

        return new Vector4(x, y, z, w);
    }

    public toString():string
    {
        var s = "";

        for(var i = 0; i < 4; ++i) {
            if(i != 0)
                s += "\n";
            for(var j = 0; j < 4; ++j) {
                if(j != 0)
                    s += " ";
                s += this._matrix[i*4 + j];
            }
        }

        return s;
    }

    public static perspective(fov:number, aspect:number, znear:number, zfar:number):Matrix4
    {
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
    }

    public static yawRotation(angle:number):Matrix4
    {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;

        var c = Math.cos(angle);
        var s = Math.sin(angle);
        m[0] = c;
        m[2] = s;
        m[8] = -s;
        m[10] = c;

        return newMatrix;
    }

    public static rollRotation(angle:number):Matrix4
    {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;

        var c = Math.cos(angle);
        var s = Math.sin(angle);
        m[0] = c;
        m[1] = s;
        m[4] = -s;
        m[5] = c;

        return newMatrix;
    }

    public static translation(v:Vector4):Matrix4
    {
        var newMatrix = new Matrix4();
        var m = newMatrix._matrix;

        m[3] = v.x;
        m[7] = v.y;
        m[11] = v.z;

        return newMatrix;
    }
}
