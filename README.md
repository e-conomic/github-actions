---
id: github-actions
---
# github-actions
Repository for shared GitHub Actions

This repository contains reusable GitHub action jobs that can be used in the GitHub action workflows in other repositories.

:warning: When making changes to this repository, please keep in mind, that this is a public repo and you should keep the exposure of the internal infrastructure and resources to the minimum.

# How to use
Reference required steps in your workflow `yml` files.

Check the latest version in the [releases](https://github.com/e-conomic/github-actions/releases) and suffix the actions with it.

The current documentation assumes that the latest version is `v6`

# Actions
* docker-build-push
* polaris-sast
* upload-docs
* npm-publish

The following examples assume that you have included a github-actions repo checkout in the previous step.

## docker-build-push
Build docker image and publish to GCR using [Workload Identity Federation](https://cloud.google.com/iam/docs/configuring-workload-identity-federation#github-actions).
This action needs [Workload Identity Federation Setup for Github Actions](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions) and 
Service Account created with permission to Push container images to GCR.

For `tags` you can also use https://github.com/marketplace/actions/docker-metadata-action

```yaml
- name: Docker build and push
  uses: e-conomic/github-actions/docker-build-push@v7
  with:
    tags: eu.gcr.io/dev-econo-cm/<service-name-and-version>
    workload_identity_pool_provider: <workload-identity-pool-provider>
    gcr_service_account_email: <google-service-account-email>
```
### User customizable options
* `context` (optional, default value '.') - Folder containing Dockerfile. Context parameter for docker/build-push-action action
* `tags` - Replace **<project-name-and-version>** with you own value. (ex.: `companies:${{ github.ref_name }}-${{ env.SHA7 }}`)
  
By default, GitHub does not provide a short SHA of the commit. There are multiple ways to calculate short SHA and this is just one example. You can add a step before calling `docker-build-push` to generate a string formatted SHA containing 7 characters:
```yaml
- name: Get commit short SHA
  run: echo SHA7=${GITHUB_SHA::7} >> $GITHUB_ENV
```

## polaris-sast
Run Polaris static application security testing. The action runs on the root folder of the cloned application repository.
```yaml
- name: Static application security testing
  uses: e-conomic/github-actions/polaris-sast@v6
  with:
    api_url: ${{ secrets.POLARIS_API_URL }}
    access_token: ${{ secrets.POLARIS_ACCESS_TOKEN }}
```
### User customizable options
_None_
 
## upload-docs
Upload documentation to docs.e-conomic.ws
```yaml
- name: Upload docs
  uses: e-conomic/github-actions/upload-docs@v6
  with:
    docs_bucket_sa: ${{ secrets.DOCS_BUCKET_SA }}
```
### User customizable options
_None_

## npm-publish
Publish NPM package to registry.npmjs.org

The action is constructed to account for automatic publishing when a new release is created in the repository. When creating a new version consider the following:
> create a tagged release with the following tag format: `x.x.x` (ex. 1.0.11). Do not use any suffixes or prefixes for the tag name.

You should run your publishing workflow on release published event:
```yaml
on: 
  release:
    types:
      - published
```
You will need to extract the version number from the release and then publish:
```yaml
- name: Generate version
  id: package_version
  run: echo ::set-output name=VERSION::${GITHUB_REF/refs\/tags\//}
  
- name: Publish NPM package
  uses: e-conomic/github-actions/npm-publish@v6
  with:
    node-version: '16'
    package-version: ${{ steps.package_version.outputs.VERSION  }}
    npm-token: ${{ secrets.NPMJS_TOKEN_RW }}
```
### User customizable options
* `node-version` - Node version the will be configured for building and publishing
  
# How to contribute
If you want to add a new shareable action, please create a pull request containing:
* Code updates (If you are creating a new action, place it in a new directory)
* Update of the readme.md reflecting your changes if necessary

⚠️Important ⚠️
Once the changes are merged into the `master` branch:
* Create a release with the new version number. Assign the version number tag in the following format `vX.Y.Z`
* If you are not changing the major version, you need to move the `vX` tag to the latest commit so that it contains both `vX.Y.Z` and `vX` tags.
* If you are releasing a new major version, you need to release a semver `vX.0.0` version and also add an additional tag `vX` manually
