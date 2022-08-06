import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'v-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Vendetta';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    const theme = 'one-dark';
    const head = this.document.getElementsByTagName('head')[0];

    let themeLink = this.document.getElementById(
      'theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `${theme}.css`;
    } else {
      const style = this.document.createElement('link');
      style.id = 'theme';
      style.rel = 'stylesheet';
      style.href = `${theme}.css`;

      head.appendChild(style);
    }
  }
}
