import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable()
export class ThemeService {
  private _renderer: Renderer2;
  private head: HTMLElement;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) document: Document
  ) {
    this.head = document.head;
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  loadCss(filename: string) {
    let themeLink = document.getElementById('theme') as HTMLLinkElement;
    if (themeLink) {
      this._renderer.removeChild(this.head, themeLink);
    }

    const linkEl: HTMLElement = this._renderer.createElement('link');
    this._renderer.setAttribute(linkEl, 'id', 'theme');
    this._renderer.setAttribute(linkEl, 'rel', 'stylesheet');
    this._renderer.setAttribute(linkEl, 'type', 'text/css');
    this._renderer.setAttribute(linkEl, 'href', filename);
    this._renderer.appendChild(this.head, linkEl);
  }
}
