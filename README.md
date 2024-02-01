# fedi-comments

A web component that displays comments based on replies on the fediverse.

## Installation

```bash
npm add @pberganza/fedi-comments

# OR

pnpm add @pberganza/fedi-comments
```

## Usage

This component is naive. It will _just_ display the replies to a status with a specific ID.

It is intended to be used by first sharing a link of your post to your Fediverse account, grabbing the ID from
it and using it in this component to display replies to that status as replies to your article.

```html
<script type="module">
    import '@pberganza/fedi-comments'
</script>
<fedi-comments id="1234567890" instance="mastodon.social"></fedi-comments>
```
