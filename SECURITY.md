# Security Policy

## Supported versions

sv5ui follows semantic versioning. Security fixes are applied to the latest minor release.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, report them privately via GitHub's [**Report a vulnerability**](https://github.com/ndlabdev/sv5ui/security/advisories/new) form (repository **Security** tab → **Report a vulnerability**). This keeps the details private until a fix is released.

Please include:

- The affected component(s) and version.
- A description of the vulnerability and its impact.
- A minimal reproduction (code snippet or repro link) and the conditions required to trigger it.

## What to expect

- **Acknowledgement** within a few days.
- An assessment of severity and affected versions, and a coordinated disclosure timeline.
- Credit in the release notes once a fix ships, unless you prefer to remain anonymous.

## Scope

sv5ui is a UI component library — it renders markup and does not handle authentication, secrets, or server logic. The most relevant classes of issues are:

- **XSS / unsafe rendering** — e.g. a component forwarding untrusted input into a dangerous sink (such as a `javascript:` URL in `href`, or unsanitized HTML).
- **Prototype pollution** or unsafe merges in the config system.
- **Supply-chain** concerns in build/publish tooling.

> Note: passing **untrusted user data** into props that map directly to DOM attributes (e.g. `href`, `src`) is the consumer's responsibility to sanitize, consistent with Svelte/SvelteKit defaults. If you believe a component creates an unexpected sink beyond standard behavior, please report it.
