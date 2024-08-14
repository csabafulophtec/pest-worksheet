import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [NgIf],
  templateUrl: './signature-pad.component.html',
  styleUrl: './signature-pad.component.scss',
})
export class SignaturePadComponent implements AfterViewInit {
  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;
  @Input('name') name: string = '';
  @Input('title') title: string = '';
  @Output() signatureCreated: EventEmitter<string> = new EventEmitter();

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    // works in device not in browser
    //console.log('startDrawing');
  }

  moved(event: Event) {
    // works in device not in browser
    //console.log('moved');
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureCreated.emit(base64Data);
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
    }
  }

  clearPad() {
    this.signaturePad.clear();
    this.signatureImg = '';
  }
}
