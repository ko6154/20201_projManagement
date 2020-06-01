import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckPasswordPageRoutingModule } from './check-password-routing.module';

import { CheckPasswordPage } from './check-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckPasswordPageRoutingModule
  ],
  declarations: [CheckPasswordPage]
})
export class CheckPasswordPageModule {}
