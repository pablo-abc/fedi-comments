import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { Post } from "./types";

import { RelativeTimeElement } from "@github/relative-time-element/relative-time";

@customElement("fedi-post")
export class FediPost extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    "relative-time": RelativeTimeElement,
  };

  static styles = css`
    :host {
      display: block;
      padding: 10px;
    }

    .emoji {
      display: inline-block;
      width: 1em;
      height: 1em;
      vertical-align: -0.1em;
    }

    header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    footer {
      font-size: 0.9em;
      padding-top: 8px;
    }

    #avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    #account-container p {
      margin: 0;
    }

    #display-name {
      font-weight: bold;
    }

    #account-url {
      font-size: 0.9em;
    }

    #content {
      margin: 16px 0;
    }

    a,
    a:visited {
      color: #5e64f8;
    }

    @media (prefers-color-scheme: dark) {
      a,
      a:visited {
        color: #8c8dff;
      }
    }

    #content p {
      margin: 8px 0;
      line-height: 1.2em;
    }

    relative-time {
      font-size: 0.8em;
      margin-left: auto;
      align-self: flex-start;
    }
  `;

  @property({ type: Object })
  post!: Post;

  @property({ type: String })
  instance!: string;

  render() {
    let displayName = this.post.account.display_name ?? this.post.account.acct;
    for (const emoji of this.post.account.emojis) {
      displayName = displayName.replace(
        `:${emoji.shortcode}:`,
        `<img class="emoji" src="${emoji.url}" alt="${emoji.shortcode}" />`,
      );
    }
    const content = this.post.emojis.reduce((acc, emoji) => {
      return acc.replace(
        `:${emoji.shortcode}:`,
        `<img class="emoji" src="${emoji.url}" alt="${emoji.shortcode}" />`,
      );
    }, this.post.content);

    const acct = this.post.account.acct.includes("@")
      ? this.post.account.acct
      : `${this.post.account.acct}@${this.instance}`;
    return html`
      <section>
        <header part="header">
          <img
            part="avatar"
            id="avatar"
            src=${this.post.account.avatar_static}
          />
          <div part="account-container" id="account-container">
            <p part="display-name" id="display-name">
              ${unsafeHTML(displayName)}
            </p>
            <p part="account-url" id="account-url">
              <a
                target="_blank"
                rel="nofollow noreferrer noopener"
                href=${this.post.account.url}
              >
                ${acct}
              </a>
            </p>
          </div>
          <relative-time datetime=${this.post.created_at}></relative-time>
        </header>
        <div part="content" id="content">${unsafeHTML(content)}</div>
        <footer part="footer">
          <a
            part="view-on-link"
            target="_blank"
            rel="nofollow noreferrer noopener"
            href=${this.post.url}
          >
            View on
            <em>${acct.split("@")[1]}</em>
          </a>
        </footer>
      </section>
    `;
  }
}
