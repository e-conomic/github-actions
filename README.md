# github-actions
Repository for shared GitHub Actions

This repository contains reusable github action jobs that can be used in the GitHub action workflows in other repositories.

## How to use
In order to use the actions from this repo, it needs to be cloned, since this is a private repo and GitHub does not have access to it.
```yaml
- name: Checkout shared actions
  uses: actions/checkout@v3
  with:
    repository: 'e-conomic/github-actions'
    ref: 'v2'
    ssh-key: ${{ secrets.SHARED_GITHUB_ACTIONS_DEPLOY_KEY }}
    path: '_github-actions'
```
No need to change anything in this declaration, but to just in case you're wondering:
* `ref` -  is a release versino of the repo you want to use. You should always use the [latest version](https://github.com/e-conomic/github-actions/releases)
* `path` - is the location of the local folder on the runner, where the repo will be cloned
* `ssh-key` - is a deploy key that is already available in the organization secrets


## Actions
* docker-build-push
* polaris-sast
* upload-docs

The following examples assume that you have included a github-actions repo checkout in the previous step.

### docker-build-push
Build docker image and publish

```yaml
- name: Docker build and push
  uses: ./_github-actions/docker-build-push
  with:
    password: ${{ secrets.DEVECONOCM_GCR_RW }}
    tags: eu.gcr.io/dev-econo-cm/<project-name-and-version>
```
`tags` - replace **<project-name-and-version>** with you own value.
ex.: `companies:${{ github.ref_name }}-${{ env.SHA7 }}`
  
  By default github context does not provide short SHA of the commit. There are multiple ways to calculate short SHA and this is just one example. You can add an additional step before calling `docker-build-push` to generate a string formatted SHA containing 7 characters:
```yaml
- name: Get commit short SHA
  run: echo SHA7=${GITHUB_SHA::7} >> $GITHUB_ENV
```

## How to contribute
If you want to add a new shareable action, please create a pull request containing:
* Code updates (If you are creating a new action, place it in a new directory)
* Update of the readme.md reflecting your changes if necessary
