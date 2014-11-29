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

class Box
{
    constructor(public position:Vector4, public size:number, public color:Vector4) {}

    public render(rast:Rasterizer):void
    {
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
    }
}
