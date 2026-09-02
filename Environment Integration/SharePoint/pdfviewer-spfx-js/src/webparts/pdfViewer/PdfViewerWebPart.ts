import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PdfViewerWebPart.module.scss';
import * as strings from 'PdfViewerWebPartStrings';
import welcomeDark from './assets/welcome-dark.png';
import welcomeLight from './assets/welcome-light.png';

export interface IPdfViewerWebPartProps {
  description: string;
}

export default class PdfViewerWebPart extends BaseClientSideWebPart<IPdfViewerWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

public render(): void {

  this.domElement.innerHTML = `
  <link rel="stylesheet" href="https://cdn.syncfusion.com/ej2/34.1.29/tailwind3.css" />
    <div id="PdfViewer" style="height:800px;width:100%;"></div>
  `;

  const script = document.createElement('script');
  script.src = 'https://syncfusion.sharepoint.com/sites/syncfusionPdfviewer/SiteAssets/ej2.min.js';

  script.onload = () => {

    const ej = (window as any).ej;

    ej.pdfviewer.PdfViewer.Inject(
      ej.pdfviewer.TextSelection,
      ej.pdfviewer.TextSearch,
      ej.pdfviewer.Print,
      ej.pdfviewer.Navigation,
      ej.pdfviewer.Toolbar,
      ej.pdfviewer.Magnification,
      ej.pdfviewer.Annotation,
      ej.pdfviewer.FormDesigner,
      ej.pdfviewer.FormFields
    );

    const pdfviewer = new ej.pdfviewer.PdfViewer({
      documentPath:
        'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',

      resourceUrl:
        'https://syncfusion.sharepoint.com/sites/syncfusionPdfviewer/SiteAssets/ej2-pdfviewer-lib'
    });

    pdfviewer.appendTo('#PdfViewer');
  };

  document.head.appendChild(script);
}
  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
