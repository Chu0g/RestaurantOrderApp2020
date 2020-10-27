import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss'],
})

export class CommonDialogComponent implements OnInit{
  title: string;
  content: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
