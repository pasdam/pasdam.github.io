---
date: 2019-04-27
summary: Guide on how to add Disqus comments to a GatsbyJS static blog
tags:
  - blog
  - comments
  - Disqus
  - GatsbyJS
  - Tutorial
title: Add Disqus comments to a GatsbyJS static blog
aliases:
  - /blog/gatsbyjs_add_diqus_comments/
---

There are [different ways](https://www.gatsbyjs.org/blog/2018-04-10-how-to-handle-comments-in-gatsby-blogs/) to add a comments section to your static website or blog, in this guide we won't talk about pros and cons of each solution but we will actually focus on how to use [Disqus](https://disqus.com) to enable users to leave comments on a blog generated with [GatsbyJS](https://www.gatsbyjs.org/).

<!--more-->

Even though this tutorial is focused on [GatsbyJS](https://www.gatsbyjs.org/) it should apply to any React website.

## Add website to Disqus

[Disqus](https://disqus.com) offers an easy to use platform to add comments to your website.

According to [Wikipedia](https://en.wikipedia.org/wiki/Disqus):

> [Disqus](https://disqus.com) is a worldwide blog comment hosting service for web sites and online communities that use a networked platform. The company's platform includes various features, such as social integration, social networking, user profiles, spam and moderation tools, analytics, email notifications, and mobile commenting.

Note: the info about the users and the comments will be stored on [Disqus](https://disqus.com) servers.

The first thing to do, if you didn't do it yet, is to **create an account** and then **register your new website** in order to get the **shortname**, that will be used to retrieve the script that will load the comments section. It will be something like:

```none
pasdam-github-io
```

## Configure GatsbyJS to load Disqus comments

Next thing to do is to configure the [GatsbyJS](https://www.gatsbyjs.org/) website to load the [Disqus](https://disqus.com) section. To do this there are few [GatsbyJS](https://www.gatsbyjs.org/) plugins, but in this tutorial we'll use the official React one.

So let's install it with:

```bash
npm install disqus-react
```

The previous command will add the plugin to yours `package.json` file and download the required module.

Finally, last thing left to do is to add the section to the blog page, right under the article content (or wherever you prefer):

```javascript
import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

class Article extends React.Component {
  render() {
    const disqusShortname = 'example';
    const disqusConfig = {
      identifier: this.props.article.id,
      title: this.props.article.title,
    };

    return (
      <div className="article">
        <h1>{this.props.article.title}</h1>
        <p>{this.props.article.body}</p>
        <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    );
  }
}
```

The `disqusShortname` is the value that we got in the previous section when adding the website to [Disqus](https://disqus.com).

To see the few changes I made to this blog to add the comments section just refer to the commit [6186e53]([to.do](https://github.com/pasdam/dev.pasdam.github.io/commit/6186e53a81e75fefea17ac269d2d00fee34237d3)).

---

Sources:

1. [https://mk.gg/add-disqus-comments-to-gatsby-blog/](https://mk.gg/add-disqus-comments-to-gatsby-blog/)
2. [https://github.com/disqus/disqus-react](https://github.com/disqus/disqus-react)
