---
date: 2025-03-23
summary:
tags:
  - GitHub Pages
title: How to add redirects to your GitHub Pages website
---

GitHub Pages is a fantastic platform for hosting static websites directly from
your GitHub repository. It's simple, free, and perfect for personal portfolios,
project documentation, and small business landing pages. However, as your
projects evolve, you might find yourself needing to move content, or even switch
to a new domain. This is where redirects become essential.

Without redirects, users who have bookmarked old pages or found links elsewhere
will encounter frustrating `404 Not Found` errors. This can lead to a poor user
experience and lost traffic. In this blog post, we'll delve into why you might
need redirects on your GitHub Pages site and provide a detailed, step-by-step
guide on how to implement them effectively.

<!--more-->

## The problem

Imagine this scenario: you've diligently built your project's website on GitHub
Pages, and over time, you decide to move it to a different organization, or you
simply want to rename the project. Now, anyone with a direct link to the old
project URLs will be met with a dead end. This is the core problem redirects
solve.

The proposed solution works also for cases where you simply changed the
structure of the project and pages ended up at different paths under the same
domain.

## The solution

While GitHub Pages doesn't offer server-side redirect configurations like
.htaccess (as it's a static hosting platform), the most straightforward and
widely used method for implementing redirects is by using the HTML `<meta>`
[refresh tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv).

Here's how the solution works:

1. Create an HTML file for the old URL for each URL you want to redirect, with
   the same name (e.g., if you're redirecting `/old-page.html`, create a file
   named `old-page.html`);
2. Add the `<meta>` refresh tag: inside the `<head>` section of this new HTML
   file, add the following :

    ```html
    <meta http-equiv="refresh" content="0; url=https://your-new-url.com/new-page.html">
    <title>Redirecting...</title>
    ```

    Let's break down the attributes:

    * `http-equiv="refresh"`: this indicates that the browser should perform a
      page refresh.
    * `content="0; url=https://your-new-url.com/new-page.html"`: this is the
      crucial part.
      * `0`: this specifies the delay in seconds before the redirect occurs;
        setting it to 0 makes the redirect immediate;
      * `url=https://your-new-url.com/new-page.html`: replace this with the full
        URL of the new page where you want to redirect the user.

3. Add a fallback link (optional but recommended): within the `<body>` of the HTML
   file, include a paragraph with a direct link to the new page. This is
   important for users whose browsers might not support or have disabled meta
   refresh redirects.

    ```html
    <p>This page has moved to <a href="https://your-new-url.com/new-page.html">https://your-new-url.com/new-page.html</a>. You will be automatically redirected in a few seconds.</p>
    ```

4. Commit and push your changes: Once you've created the redirect HTML files,
   commit them to your GitHub repository and push the changes. GitHub Pages will
   automatically deploy the updated site.

## Example

Let's say you want to redirect `/about.html` to `/company/about-us.html`. You
would create a file named `about.html` in the root of your GitHub Pages
repository with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=https://your-username.github.io/your-repo/company/about-us.html">
    <title>Redirecting...</title>
</head>
<body>
    <p>The About Us page has moved to <a href="https://your-username.github.io/your-repo/company/about-us.html">https://your-username.github.io/your-repo/company/about-us.html</a>. You will be automatically redirected.</p>
</body>
</html>
```

## Conclusion

Implementing redirects on your GitHub Pages site is crucial for maintaining a
positive user experience and preserving your website's SEO value as it evolves.
While the HTML meta refresh method is the primary approach for static hosting,
it's a simple and effective way to guide your visitors to the right content.
Remember to test your redirects thoroughly after implementation to guarantee
they are working as expected.
