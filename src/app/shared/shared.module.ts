import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterStatusPipe } from './pipes/counter-status.pipe';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CounterStatusPipe,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports : [
    CounterStatusPipe
  ]
})
export class SharedModule { }
