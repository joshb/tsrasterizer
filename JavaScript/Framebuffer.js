/*
 * Copyright (C) 2014 Josh A. Beam
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

function Framebuffer(stdlib, foreign, heap)
{
    "use asm";

    var heapUint32 = new stdlib.Uint32Array(heap);
    var heapFloat64 = new stdlib.Float64Array(heap);

    var floor = stdlib.Math.floor;
    var imul = stdlib.Math.imul;

    function lerp(f1, f2, factor)
    {
        f1 = +f1;
        f2 = +f2;
        factor = +factor;

        return +(f1 + (f2 - f1) * factor);
    }

    function lerpInt(f1, f2, factor)
    {
        f1 = +f1;
        f2 = +f2;
        factor = +factor;

        return (~~(+lerp(f1, f2, factor)))|0;
    }

    function rgbaBE(r, g, b, a)
    {
        r = r|0;
        g = g|0;
        b = b|0;
        a = a|0;

        return ((r << 24) | (g << 16) | (b << 8) | a)|0;
    }

    function rgbaLE(r, g, b, a)
    {
        r = r|0;
        g = g|0;
        b = b|0;
        a = a|0;

        return ((a << 24) | (b << 16) | (g << 8) | r)|0;
    }

    function setPixel(width, height, x, y, z, c)
    {
        width = width|0;
        height = height|0;
        x = x|0;
        y = y|0;
        z = +z;
        c = c|0;

        var index = 0;
        var depthStartIndex = 0;
        var depthIndex = 0;
        var depth = 0.0;

        if((x|0) < 0)
            return;

        if((x|0) >= (width|0))
            return;

        if((y|0) < 0)
            return;

        if((y|0) >= (height|0))
            return;

        index = ((imul(width, y)|0) + (x|0))|0;
        depthStartIndex = (imul(width, height)|0);

        depthIndex = ((depthStartIndex|0) + (index|0))|0;
        depthIndex = depthIndex << 3;
        depth = +heapFloat64[depthIndex >> 3];
        if((+z) < (+depth))
            return;

        index = index << 2;
        heapUint32[index >> 2] = c;
        heapFloat64[depthIndex >> 3] = z;
    }

    function drawSpan(littleEndian, framebufferWidth, framebufferHeight, factor, step, y,
                      x1, z1, r1, g1, b1, a1, x2, z2, r2, g2, b2, a2)
    {
        littleEndian = littleEndian|0;
        framebufferWidth = framebufferWidth|0;
        framebufferHeight = framebufferHeight|0;
        factor = +factor; step = +step; y = y|0;
        x1 = x1|0; z1 = +z1; r1 = +r1; g1 = +g1; b1 = +b1; a1 = +a1;
        x2 = x2|0; z2 = +z2; r2 = +r2; g2 = +g2; b2 = +b2; a2 = +a2;

        var x = 0; var z = 0.0;
        var r = 0; var g = 0; var b = 0; var a = 0; var c = 0;

        x = x1;
        while((x|0) < (x2|0)) {
            z = +lerp(z1, z2, factor);
            r = lerpInt(r1, r2, factor)|0;
            g = lerpInt(g1, g2, factor)|0;
            b = lerpInt(b1, b2, factor)|0;
            a = lerpInt(a1, a2, factor)|0;

            if(littleEndian|0 == 1)
                c = rgbaLE(r, g, b, a)|0;
            else
                c = rgbaBE(r, g, b, a)|0;

            setPixel(framebufferWidth, framebufferHeight, x, y, z, c);

            factor = factor + step;
            x = x + 1|0;
        }
    }

    return {
        lerp: lerp,
        lerpInt: lerpInt,
        rgbaBE: rgbaBE,
        rgbaLE: rgbaLE,
        setPixel: setPixel,
        drawSpan: drawSpan
    };
}
