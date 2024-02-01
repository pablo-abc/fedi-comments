import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import type { Post } from "./types";

import "./fedi-spinner";
import "./fedi-post";

type PostContext = {
  ancestors: Post[];
  descendants: Post[];
};

@customElement("fedi-comments")
export class FediComments extends LitElement {
  static styles = css`
    :host {
      --background-color: #fff;
      --color: #000;
      --border-color: #eee;
      display: block;
      background: var(--background-color);
      color: var(--color);
      border-radius: 16px;
      font-family: sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --background-color: #282c37;
        --color: #f9f9f9;
        --border-color: #555;
      }
    }

    ul {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    li {
      list-style: none;
    }

    .reply {
      margin-left: 24px;
    }

    #spinner-item {
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }

    li:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
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
    const comments = this.comments.filter(
      (c) => c.in_reply_to_id === this.postId,
    );
    const replies = this.comments.filter(
      (c) => c.in_reply_to_id !== this.postId,
    );
    return html`<ul>
      ${when(
        this.comments.length,
        () =>
          comments
            .filter((c) => c.in_reply_to_id === this.postId)
            .map((comment) => {
              return html`<li>
                <fedi-post
                  instance=${this.instance}
                  .post=${comment}
                ></fedi-post>
                ${when(
                  comment.replies_count,
                  () =>
                    html`<ul class="reply">
                      ${replies
                        .filter((c) => c.in_reply_to_id === comment.id)
                        .map((c) => {
                          return html`<li>
                            <fedi-post
                              instance=${this.instance}
                              .post=${c}
                            ></fedi-post>
                          </li>`;
                        })}
                    </ul>`,
                )}
              </li>`;
            }),
        () => html`<li id="spinner-item"><fedi-spinner></fedi-spinner></li>`,
      )}
    </ul>`;
  }
}
