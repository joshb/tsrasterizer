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

class Application
{
    private canvas;
    private fps;
    private rast;

    private modelview:Matrix4 = new Matrix4();
    private x:number = 0.0;
    private z:number = -8.0;
    private rotation:number = 0.0;
    private boxes:Box[] = [];

    private time:number = 0.0;
    private keyState:boolean[] = [];
    private firstCycle:boolean = true;

    public constructor(time:number)
    {
        this.time = time;

        this.canvas = document.getElementsByTagName("canvas")[0];
        if(!this.canvas) {
            window.alert("No canvas element found.");
            return;
        }

        this.fps = document.getElementById("fps");

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

    public cycle(time:number):void
    {
        var timeElapsed:number = (time - this.time) / 1000.0;
        this.time = time;

        this.processKeyState(timeElapsed);

        this.rotation += Math.PI * timeElapsed / 10.0;
        var mr = Matrix4.rollRotation(this.rotation);
        var my = Matrix4.yawRotation(-this.rotation * 1.5);
        var mt = Matrix4.translation(new Vector4(this.x, 0, this.z));
        this.modelview = mt.multiply(my.multiply(mr));

        this.render(timeElapsed);
    }

    private processKeyState(timeElapsed:number):void
    {
        timeElapsed *= 5.0;

        if(this.keyState[37]) // left
            this.rotation -= Math.PI * timeElapsed / 30.0;

        if(this.keyState[38]) { // up
            this.z += timeElapsed;
        }

        if(this.keyState[39]) // right
            this.rotation += Math.PI * timeElapsed / 30.0;

        if(this.keyState[40]) { // down
            this.z -= timeElapsed;
        }
    }

    public keyDown(e:KeyboardEvent):void
    {
        this.keyState[e.keyCode] = true;
    }

    public keyUp(e:KeyboardEvent):void
    {
        this.keyState[e.keyCode] = false;
    }

    private render(timeElapsed:number):void
    {
        this.rast.clear();
        this.rast.setModelviewMatrix(this.modelview);

        this.boxes.forEach(box => box.render(this.rast));

        this.rast.flush(timeElapsed);

        if(this.fps) {
            var numFramesPerSecond = 1.0 / timeElapsed;
            this.fps.textContent = numFramesPerSecond.toFixed(1) + " fps";
        }
    }
}
