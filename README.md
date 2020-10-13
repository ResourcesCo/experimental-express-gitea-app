# app

[![pipeline status](https://gitlab.com/ResourcesCo/app/badges/main/pipeline.svg)](https://gitlab.com/ResourcesCo/app/-/pipelines)

## Development

### Installation

```bash
lerna bootstrap
```

### Overmind

[Overmind](https://github.com/DarthSim/overmind) is used to run both the web app and the API in
development. To install:

```bash
brew install overmind
```

To run:

```bash
overmind s
```

To restart just the api:

```bash
overmind r api
```

To restart just the web app:

```bash
overmind r app
```
