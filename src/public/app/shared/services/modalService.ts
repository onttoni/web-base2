/*
 * Slightly modified from
 * https://github.com/angular/angular/blob/master/modules/angular2_material/src/components/dialog/dialog.ts
 */

import {Component, ComponentRef, Directive, DynamicComponentLoader, forwardRef, Host} from 'angular2/core';
import {Injectable, ReflectiveInjector, provide, ResolvedReflectiveProvider} from 'angular2/core';
import {SkipSelf, Type, ViewContainerRef, ViewEncapsulation} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import _ = require('lodash');


export class Modal {

  public _whenClosedObserver: Observer<any>;

  get whenClosed(): Observable<any> {
    return Observable.create((observer) => {
      this._whenClosedObserver = observer;
    });
  }
}


export class ModalConfig {

  private static _defaultBackdrop: boolean = true;
  public backdrop: boolean;
  public width: number;
  public height: number;
  public providers: ResolvedReflectiveProvider[];

  constructor(public type: Type, public elementRef: ViewContainerRef, providers?: ResolvedReflectiveProvider[],
              width?: number, height?: number, backdrop?: boolean) {
    this.backdrop = backdrop === undefined ? ModalConfig._defaultBackdrop : backdrop;
    this.providers = providers || [];
  }
}


@Component({
  directives: [forwardRef(() => ModalContent)],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'md',
    'tabindex': '0',
    '(body:keydown)': 'documentKeypress($event)',
  },
  selector: 'modal-container',
  template: `
    <style>
      .md {
        position: absolute;
        z-index: 80;
        /** Center the dialog. */
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border: 1px solid black;
        box-shadow: 0 4px 4px;;
        padding: 20px;
      }
      .md-backdrop {
        position: absolute;
        top:0 ;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
    </style>
    <modal-content></modal-content>
    <div tabindex="0" (focus)="wrapFocus()"></div>
  `
})
class ModalContainer {

  // Ref to the modal content. Used by the DynamicComponentLoader to load the modal content.
  public contentRef: ViewContainerRef;
  // Ref to the open modal. Used to close the modal based on certain events.
  public _modalRef: ModalRef;

  constructor() {
    this.contentRef = null;
    this._modalRef = null;
  }

  public documentKeypress(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this._modalRef.close();
    }
  }
}


/**
 * Simple decorator used only to communicate an ViewContainerRef to the parent ModalContainer as the
 * location
 * for where the dialog content will be loaded.
 */
@Directive({
  selector: 'modal-content',
})
class ModalContent {
  constructor(@Host() @SkipSelf() modalContainer: ModalContainer, elementRef: ViewContainerRef) {
    modalContainer.contentRef = elementRef;
  }
}


export class ModalRef {

  // Reference to the ModalContainer component.
  public containerRef: ComponentRef;
  // Reference to the Component loaded as the dialog content.
  private _contentRef: ComponentRef;
  // Observable for the content ComponentRef is set event. Only used internally.
  private _contentRefObservable: Observable<ComponentRef>;
  // Whether the dialog is closed.
  private _isClosed: boolean;
  // Observer to emit the modal closing status. The observable for this observer is publicly exposed.
  private _whenClosedObserver: Observer<any>;

  constructor() {
    this._contentRef = null;
    this.containerRef = null;
    this._isClosed = false;
  }

  set contentRef(value: ComponentRef) {
    this._contentRef = value;
    this._contentRefObservable = Observable.create((observer) => {
      observer.next(value);
    });
  }

  /** Gets the component instance for the content of the dialog. */
  get instance() {
    if (_.has(this, '_contentRef.instance')) {
      return this._contentRef.instance;
    }

    // The only time one could attempt to access this property before the value is set is if an
    // access occurs during
    // the constructor of the very instance they are trying to get (which is much more easily
    // accessed as `this`).
    let err = 'Cannot access dialog component instance *from* that component\'s constructor.';
    console.error(err);
    throw err;
  }

  /** Gets an observer that is resolved when the dialog is closed. */
  get whenClosed(): Observable<any> {
    return Observable.create((observer) => {
      this._whenClosedObserver = observer;
    });
  }

  /** Closes the dialog. This operation is asynchronous. */
  public close(result: any = null) {
    this._contentRefObservable.subscribe(() => {
      if (!this._isClosed) {
        this._isClosed = true;
        this.containerRef.destroy();
        this._whenClosedObserver.next(result);
      }
    });
  }
}


@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': 'onClick()',
  },
  selector: 'modal-backdrop',
  template: ''
})
class ModalBackdrop {

  constructor(private _modalRef: ModalRef, private _modalConfig: ModalConfig) {
  }

  public onClick() {
    if (this._modalConfig.backdrop === true) {
      this._modalRef.close();
    }
  }
}


@Injectable()
export class ModalService {

  private _bdAdapter: BrowserDomAdapter = new BrowserDomAdapter();
  private _modalRegistry: Map<string, ModalConfig> = new Map<string, ModalConfig>();

  constructor(private _dcLoader: DynamicComponentLoader) {
    console.debug('ModalService constructor');
  }

  /**
   * Opens a modal.
   * @param modalConfig
   * @returns Promise for a reference to the dialog.
   */
  public open(modalConfig: ModalConfig): Promise<ModalRef> {

    let modalRef: ModalRef = new ModalRef();
    let providers: ResolvedReflectiveProvider[] = modalConfig.providers.concat(ReflectiveInjector.resolve([
      provide(ModalRef, {useValue: modalRef}),
      provide(ModalConfig, {useValue: modalConfig})
    ]));
    let backdropRefPromise = this._openBackdrop(modalConfig.elementRef, providers);

    // First, load the ModalContainer, into which the given component will be loaded.
    return this._dcLoader.loadNextToLocation(ModalContainer, modalConfig.elementRef, providers)
        .then(containerRef => {
          let modalElement = containerRef.location.nativeElement;
          this._bdAdapter.appendChild(this._bdAdapter.query('body'), modalElement);
          if (_.has(modalConfig, 'width')) {
            this._bdAdapter.setStyle(modalElement, 'width', `${String(modalConfig.width)}px`);
          }
          if (_.has(modalConfig, 'height')) {
            this._bdAdapter.setStyle(modalElement, 'height', `${String(modalConfig.height)}px`);
          }

          modalRef.containerRef = containerRef;

          // Now load the given component into the ModalContainer.
          return this._dcLoader.loadNextToLocation(modalConfig.type, containerRef.instance.contentRef, providers)
              .then(contentRef => {

                // Wrap both component refs for the container and the content so that we can return
                // the `instance` of the content but the dispose method of the container back to the
                // opener.
                modalRef.contentRef = contentRef;
                containerRef.instance.modalRef = modalRef;

                backdropRefPromise.then(backdropRef => {
                  modalRef.whenClosed.subscribe(() => {
                    backdropRef.destroy();
                  });
                });

                contentRef.instance.whenClosed.subscribe(() => {
                  modalRef.close();
                });

                return modalRef;
              });
        });
  }

  public openModal(name: string): Promise<any> {
    return this.open(this._modalRegistry.get(name));
  }

  public registerModal(name: string, modalConfig: ModalConfig) {
    this._modalRegistry.set(name, modalConfig);
  }

  /** Loads the dialog backdrop (transparent overlay over the rest of the page). */
  private _openBackdrop(elementRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]): Promise<ComponentRef> {
    return this._dcLoader.loadNextToLocation(ModalBackdrop, elementRef, providers)
      .then((componentRef) => {
        let backdropElement = componentRef.location.nativeElement;
        this._bdAdapter.addClass(backdropElement, 'md-backdrop');
        this._bdAdapter.appendChild(this._bdAdapter.query('body'), backdropElement);
        return componentRef;
      });
  }

}
