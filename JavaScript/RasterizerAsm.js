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

function RasterizerAsm(stdlib, foreign, heap)
{
    "use asm";

    var heapFloat64 = new stdlib.Float64Array(heap);
    var heapUint8 = new stdlib.Uint8Array(heap);
    var heapUint32 = new stdlib.Uint32Array(heap);

    function lerp(f1, f2, factor)
    {
        f1 = +f1;
        f2 = +f2;
        factor = +factor;

        return +(f1 + (f2 - f1) * factor);
    }

    function lerpVector(x1, y1, z1, w1, x2, y2, z2, w2, factor)
    {
        x1 = +x1;
        y1 = +y1;
        z1 = +z1;
        w1 = +w1;
        x2 = +x2;
        y2 = +y2;
        z2 = +z2;
        w2 = +w2;
        factor = +factor;

        heapFloat64[0] = +lerp(x1, x2, factor);
        heapFloat64[1] = +lerp(y1, y2, factor);
        heapFloat64[2] = +lerp(z1, z2, factor);
        heapFloat64[3] = +lerp(w1, w2, factor);
    }

    function isLittleEndian()
    {
        heapUint8[0] = 1|0;
        heapUint8[1] = 0|0;
        heapUint8[2] = 0|0;
        heapUint8[3] = 0|0;

        return (heapUint32[0] & 0xff)|0;
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

    return {
        lerp: lerp,
        lerpVector: lerpVector,
        isLittleEndian: isLittleEndian,
        rgbaBE: rgbaBE,
        rgbaLE: rgbaLE
    };
}
