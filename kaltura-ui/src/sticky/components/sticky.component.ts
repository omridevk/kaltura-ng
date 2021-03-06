import { Component, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { StickyScrollService } from '../services/sticky-scroll.service';
import { StickyDirective } from '../directives/sticky.directive';

@Component({
	selector: 'kSticky',
	templateUrl: './sticky.component.html',
	styleUrls: ['./sticky.component.scss']
})
export class StickyComponent implements AfterViewInit {

	public wrapperHeight:number = 0;

	@Input() scrollOffset = 0;
	@Input('stickyClass') stickyClass: string;

	@Input('container') container: any;

	@Input() stickyId: string;
	@Input() sticksTo: string;

	@ViewChild('contentWrapper') content: ElementRef;
	@ViewChild(StickyDirective) _sticky: StickyDirective;

	constructor(private _stickyScrollService: StickyScrollService) {}

	ngAfterViewInit(): void {
		setTimeout(()=>{
			this._updateLayout();
		},0);
	}

	private _updateLayout() {
		if (this.content.nativeElement.children.length > 0) {
			this.wrapperHeight = this.content.nativeElement.children[0].clientHeight;
		} else {
			console.warn("Sticky component::could not access content.");
		}
	}

	public updateLayout(manual: boolean = true){
		setTimeout(()=>{
			this._updateLayout();
			this._sticky.update();
		},0);
	}

}

