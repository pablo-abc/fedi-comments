import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
      --link-color: #5e64f8;
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
        --link-color: #8c8dff;
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

    a,
    a:visited {
      color: var(--link-color);
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

    #instructions {
      padding: 16px;
    }

    #link-spinner {
      --spinner-size: 1em;
      display: inline-block;
    }
  `;

  @property({ type: String })
  postId!: string;

  @property({ type: String })
  instance!: string;

  @state()
  comments: Post[] = [];

  @state()
  post: Post | null = null;

  @state()
  loading = true;

  async fetchComments() {
    if (!this.postId || !this.instance) return;
    const response = await fetch(
      `https://${this.instance}/api/v1/statuses/${this.postId}/context`,
    );
    const data: PostContext = await response.json();
    this.comments = data.descendants;
    this.loading = false;
  }

  async fetchPost() {
    if (!this.postId || !this.instance) return;
    const response = await fetch(
      `https://${this.instance}/api/v1/statuses/${this.postId}`,
    );
    const data: Post = await response.json();
    this.post = data;
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("postId") || changedProperties.has("instance")) {
      this.fetchComments();
      this.fetchPost();
    }
  }

  render() {
    const comments = this.comments.filter(
      (c) => c.in_reply_to_id === this.postId,
    );
    const replies = this.comments.filter(
      (c) => c.in_reply_to_id !== this.postId,
    );
    return html`
      <div>
        <div id="instructions">
          <slot name="instructions">
            You can add your comment by replying with your Fediverse account to
            this post:
          </slot>
          ${when(
            this.post,
            (post) => html`
              <a href=${post.url}>
                <slot name="view-post-text">View post</slot>
              </a>
            `,
            () => html`<fedi-spinner id="link-spinner"></fedi-spinner>`,
          )}
        </div>
        <ul>
          ${when(
            !this.loading,
            () =>
              comments
                .filter((c) => c.in_reply_to_id === this.postId)
                .map((comment) => {
                  return html`<li>
                    <fedi-post instance=${this.instance} .post=${comment}>
                      <span slot="view-on-text">
                        <slot name="view-on-text">View on</slot>
                      </span>
                    </fedi-post>
                    ${when(
                      comment.replies_count,
                      () =>
                        html`<ul class="reply">
                          ${replies
                            .filter((c) => c.in_reply_to_id === comment.id)
                            .map((c) => {
                              return html`<li>
                                <fedi-post instance=${this.instance} .post=${c}>
                                  <span slot="view-on-text">
                                    <slot name="view-on-text">View on</slot>
                                  </span>
                                </fedi-post>
                              </li>`;
                            })}
                        </ul>`,
                    )}
                  </li>`;
                }),
            () =>
              html`<li id="spinner-item"><fedi-spinner></fedi-spinner></li>`,
          )}
        </ul>
      </div>
    `;
  }
}
