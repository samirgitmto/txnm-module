import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-content-proj',
  standalone: false,
  templateUrl: './content-proj.html',
  styleUrl: './content-proj.css'
})
export class ContentProj {

  @Input() value: string = '';

ngOnChanges(changes: SimpleChanges) {
  console.log('ngOnChanges:', changes);
}

ngDoCheck() {
  console.log('ngDoCheck triggered');
}


}
