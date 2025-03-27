import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'

@Component({
  selector: 'app-add-interface',
  imports: [ReactiveFormsModule,MatSlideToggleModule],
  templateUrl: './add-interface.component.html',
  styleUrl: './add-interface.component.css'
})

export class AddInterfaceComponent {
   addinterfaceForm : FormGroup = new FormGroup({
      public_key : new FormControl('')  
   });
}
