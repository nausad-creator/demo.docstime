import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private dom
  ) { }
  updateTitle = (title?: string) => {
    this.title.setTitle(title);
  }
  updateMetaTags = (metaTags: MetaDefinition[]) => {
    metaTags.forEach(m => this.meta.updateTag(m));
  }
  createCanonicalURL = () => {
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', this.dom.URL);
  }
}
