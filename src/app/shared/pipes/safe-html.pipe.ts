import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(content: string): SafeHtml {
    const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
    return this.sanitizer.bypassSecurityTrustHtml(cleanContent);
  }

}
