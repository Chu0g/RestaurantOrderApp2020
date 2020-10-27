import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})

export class ConfirmDialogComponent implements OnInit{
  title: string;
  content: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
