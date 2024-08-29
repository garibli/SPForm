import { Version } from '@microsoft/sp-core-library'
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane'
import {
  BaseClientSideWebPart,
  WebPartContext,
} from '@microsoft/sp-webpart-base'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import Form from './components/Form'
import { IFormProps } from './components/IFormProps'
import { sp } from '@pnp/sp/presets/all'

export interface IFormWebPartProps {
  context: WebPartContext
}

export default class FormWebPart extends BaseClientSideWebPart<IFormWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      sp.setup({
        spfxContext: this.context as any,
      })
    })
  }

  public render(): void {
    const element: React.ReactElement<IFormProps> = React.createElement(Form, {
      context: this.context,
    })

    ReactDom.render(element, this.domElement)
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0')
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [],
    }
  }
}
