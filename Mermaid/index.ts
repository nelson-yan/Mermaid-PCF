import {IInputs, IOutputs} from "./generated/ManifestTypes";
import mermaid from "mermaid";

export class Mermaid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLPreElement;
    private _notifyOutputChanged: () => void;


    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this._notifyOutputChanged = notifyOutputChanged;

        this._container = document.createElement("pre")
        this._container.setAttribute("width", "300px")
        this._container.setAttribute("heigth", "300px")
        this._container.setAttribute("viewBox", `0 0 400 400`)
        this._container.classList.add("mermaid")
        container.appendChild(this._container)
        let config = { startOnLoad: false, flowchart: { useMaxWidth: false, htmlLabels: true } };
        mermaid.initialize(config);
    }

    public updateMermaidView( text:string ) {

        let mermaidText = !text ||  text == 'val'? 'graph TB\nA-->B' :  text

        mermaid.render('mermaid', mermaidText)
        .then( res => {
            this._container.innerHTML = res.svg
            //this._notifyOutputChanged();
        })
        .catch( e => this._container.innerHTML = e)

    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        //console.log(context.updatedProperties.indexOf("mermaid_text"))
        // Add code to update control view
        // if(context.updatedProperties.indexOf("mermaid_text")>-1)
        // {
        //     //let mermaidText = !context.parameters.mermaid_text.raw! ||  context.parameters.mermaid_text.raw! == 'val'? 'graph TB\nsamplea-->sampleb' :  context.parameters.mermaid_text.raw!
        //     this.updateMermaidView( context.parameters.mermaid_text.raw! )
        // }

        this.updateMermaidView( context.parameters.mermaid_text.raw! )
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            svg: document.querySelector(".mermaid")?.innerHTML
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
