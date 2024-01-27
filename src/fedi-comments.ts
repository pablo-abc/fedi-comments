import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Post } from "./types";

import "./fedi-post";

type PostContext = {
  ancestors: Post[];
  descendants: Post[];
};

@customElement("fedi-comments")
export class FediComments extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    ul {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    li {
      list-style: none;
    }
  `;

  @property({ type: String })
  postId!: string;

  @property({ type: String })
  instance!: string;

  @property({ type: Array })
  comments: Post[] = [];

  async fetchComments() {
    if (!this.postId || !this.instance) return;
    const response = await fetch(
      `https://${this.instance}/api/v1/statuses/${this.postId}/context`,
    );
    const data: PostContext = await response.json();
    this.comments = data.descendants;
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("postId") || changedProperties.has("instance")) {
      this.fetchComments();
    }
  }

  render() {
    return html`<ul>
      ${this.comments.map(
        (comment) =>
          html`<li>
            <fedi-post .post=${comment}></fedi-post>
          </li>`,
      )}
    </ul>`;
  }
}
