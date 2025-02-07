# My personal website

> **NOTE:** <p xmlns:cc="http://creativecommons.org/ns#" >The website content is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""></a></p>

This repository contains the code of my personal blog, generated using
[hugo](https://gohugo.io/).

## Development

```shell
hugo server
```

## Static files generation

The [CI workflow](./.github/workflows/static.yml) automatically takes care of
generating the static files, but in case you need to do it locally:

```shell
hugo
```

## Add new content

```shell
hugo new content content/posts/your_title_here.md
```
