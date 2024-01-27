import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { Post } from "./types";

@customElement("fedi-post")
export class FediPost extends LitElement {
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

    #content p {
      margin: 8px 0;
    }
  `;

  @property({ type: Object })
  post!: Post;

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
                ${this.post.account.acct}
              </a>
            </p>
          </div>
        </header>
        <div part="content" id="content">${unsafeHTML(content)}</div>
        <footer part="footer">
          <a
            part="view-on-link"
            target="_blank"
            rel="nofollow noreferrer noopener"
            href=${this.post.url}
          >
            View on ${this.post.account.acct}
          </a>
        </footer>
      </section>
    `;
  }
}
