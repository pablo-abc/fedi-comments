import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("fedi-spinner")
export class FediSpinner extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .loader {
      width: var(--spinner-size, 100px);
      aspect-ratio: 1;
      display: grid;
      -webkit-mask: conic-gradient(from 22deg, #0003, #000);
      mask: conic-gradient(from 22deg, #0003, #000);
      animation: load 1s steps(8) infinite;
    }
    .loader,
    .loader:before {
      --_g: linear-gradient(var(--color) 0 0) 50%; /* update the color here */
      background:
        var(--_g) / 34% 8% space no-repeat,
        var(--_g) / 8% 34% no-repeat space;
    }
    .loader:before {
      content: "";
      transform: rotate(45deg);
    }
    @keyframes load {
      from {
        transform: rotate(0turn);
      }
      to {
        transform: rotate(1turn);
      }
    }
  `;
  override render() {
    return html`<div class="loader"></div>`;
  }
}
