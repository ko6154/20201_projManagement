import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhiteboardPageRoutingModule } from './whiteboard-routing.module';

import { WhiteboardPage } from './whiteboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhiteboardPageRoutingModule
  ],
  declarations: [WhiteboardPage]
})
export class WhiteboardPageModule {}
