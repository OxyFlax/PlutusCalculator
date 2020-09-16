import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[longPress]' })
export class LongPressDirective {
    pressing: boolean;
    longPressing: boolean;
    timeout: any;
    interval: any;

    @Output()
    onLongPress = new EventEmitter();

    @Output()
    onShortPress = new EventEmitter();

    @Output()
    onLongPressing = new EventEmitter();

    @HostBinding('class.press')
    get press() { return this.pressing; }

    @HostBinding('class.longpress')
    get longPress() { return this.longPressing; }

    @HostListener('touchstart', ['$event'])
    @HostListener('mousedown', ['$event'])
    onMouseDown(event) {
        this.pressing = true;
        this.longPressing = false;
        this.timeout = setTimeout(() => {
            this.longPressing = true;
            this.onLongPress.emit(event);
            this.interval = setInterval(() => {
                this.onLongPressing.emit(event);
            }, 50);
        }, 400);
    }

    @HostListener('touchend')
    @HostListener('mouseup')
    @HostListener('mouseleave')
    endPress(event) {
        clearTimeout(this.timeout);
        clearInterval(this.interval);
        if (!this.longPressing && this.pressing) {
            this.onShortPress.emit(event);
        }
        this.longPressing = false;
        this.pressing = false;
    }
}