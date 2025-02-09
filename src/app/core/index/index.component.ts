import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent],
})
export class IndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
