---
date: 2024-08-26
tags:
  - blog
  - GatsbyJS
  - Hugo
title: Why I migrated my personal blog from GatsbyJS to Hugo
---
Over the years my personal blog went through different iterations, using
different stacks. When I started using [GatsbyJS](https://www.gatsbyjs.com/) I
thought that would have been my last stack as I was initially very happy with
it: [React](https://react.dev/) is a very good and easy to use library to
develop frontends, the Gatsby community is big, and there are plenty of
resources or example about implementing common frontend features.

Unfortunately through the years I faced quite some challenges in maintaining the
blog, given that the amount of time I was willing to spend on it was very
limited and the (relatively) big effort required to keep the framework updated.

This is the journey that brought me to ditch GatsbyJS in favour of
[Hugo](https://gohugo.io/).

<!--more-->

## A love-hate relationship with GatsbyJS

Surprisingly, with Gatsby it was love at first sight. I initially thought it was
a great way of creating a static website, such as the blog I wanted to develop:
coming from other ecosystems, having a more organized development for
HTML/JS/CSS components compared to the vanilla one was a breath of fresh air,
and more in line with what I was used to.

The first few months it was all good, once developed the main structure of the
blog, adding content was super easy, the deployment was fast and the
performances of the website were good.

The **problems** started to arise like a year after the initial release of the
blog, when I decided to bump the version of the framework: I naively thought it
would be just a matter of downloading the latest one, update all the
dependencies, maybe update 1 or 2 things in the code and then I could go back on
doing what actually mattered, posting content. **Boy I was wrong!**

First of all there were a number of breaking changes in the framework itself,
which to a certain degree are to be expected, but these basically required me to
rewrite big chunks of the code to adapt it to the latest framework version.

In addition to that, updating all the other dependencies, and finding the
right compatible versions with one another, while at the same time addressing
most of the NPM warnings, was challenging to say the least: I couldn't directly
upgrade everything to the latest version as they were incompatible with each
other.

Lastly, I didn't like the fact that to show a simple blog the browser has to
load a bunch of javascript files.

I regularly stumbled into these issues once or twice a year, any time there was
some major update to perform, to the point that for long time I just let the
blog go, as I didn't want to spend energies into fixing it. Recently though, I
got lucky to have had some spare time, so I decided to finally get back to it.

## Choosing an alternative

Now I was faced with a choice: fixing the code once again to adapt it to the
latest Gatsby version or replace the framework altogether. Given the all the
issues described above this was an easy decision, but I was now left with
another hurdle: picking up an alternative.

After evaluating different tools, I chose to go with Hugo because of the
following reasons:

1. it's one of the most popular static site generator, and as such it has
   big community and plenty of tutorials for each use case;
2. the architecture it's relatively simple, no JS framework is required;
3. content is created using markdown, a very clean and easy format;
4. pages are rendered using the powerful Go templates;
5. supposedly it has a very fast build time.

I reckon at least some of these points might be subjective and not valid for
everyone and every use case.

## The development experience with Hugo so far

To be fair the first development experience is not better than GatsbyJS, but I'm
surprised by how easy it was to setup the whole project and replicate the
exact same Gatsby blog with Hugo.

Adding features like comments, pagination, summaries, and so on was as easy as
do a web search with `hugo <feature-name>` to get either some official
documentation or some some other post about it, luckily there's plenty of
useful material out there.

The only learning curve I faced was about understanding how Hugo
[overrides templates](https://gohugo.io/templates/lookup-order/), which
basically allows to define generic templates and specific ones for different
cases and content types: let's assume you have 2 content types, blog posts and
projects you worked on, you can define a generic template to use as a default to
render a single entry in each type, but you can also define specific ones in
case for instance your blog posts require some customization.

Another annoyance I found is that with Gatsby I could use
[CSS modules](https://github.com/css-modules/css-modules) so my style sheets
were nicely organized, with each component having his own CSS. I haven't found
yet an alternative in Hugo, but admittedly I haven't look deep into it enough.

## Improvements in the current blog version

Comparing the posts list load for both stacks:

| Stack    | # requests | size (Kb) |
|----------|------------|-----------|
| GatsbyJS | 19         | 467       |
| Hugo     | 3          | 17        |

you can see that the number of HTTP requests to retrieve all the resources went
from 19 (which is crazy) to a more reasonable 3, 1 for the HTML, 1 for the CSS
and 1 for the favicon, no JS garbage is loaded anymore. A reduction of **84%**.
This of course affected also the total size of the data downloaded, which went
from 467 Kb to 17 Kb, or **-96%**.

For big enough web site such a difference could become noticeable by users and
improve the whole experience.

## Conclusions

This journey from GatsbyJS to Hugo highlights the importance of evaluating a
technology's long-term maintainability and performance. While GatsbyJS provided
a good initial experience, the challenges faced in maintaining and updating the
blog over time outweighed its benefits.

Hugo, on the other hand, proved to be a more suitable choice for my needs,
offering a faster and more efficient experience. The simplicity of its
architecture, strong community support, and focus on performance gave me enough
confidence in the choice made, although admittedly it's still early to draw
definitive conclusions about that.

Key takeaways for others considering similar migrations:

* evaluate long-term maintenance: consider the potential challenges of
  maintaining a technology over time, especially if you have limited resources;
* consider performances: if website performance is a crucial factor, Hugo's
  speed and efficiency might be a compelling reason to switch;
* weigh the pros and cons of different technologies, based on your specific
  needs and goals.

By considering these factors, you can make an informed decision about the best
stack for your project and avoid potential pitfalls in the long run.
