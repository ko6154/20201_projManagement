import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteListPageRoutingModule } from './invite-list-routing.module';

import { InviteListPage } from './invite-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteListPageRoutingModule
  ],
  declarations: [InviteListPage]
})
export class InviteListPageModule {}
